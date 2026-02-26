import { useEffect, useMemo, useRef, useState } from 'react';
import type { ClipboardEvent, JSX } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  $createParagraphNode,
  $createTextNode,
  $isElementNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  ListX,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';

type RichTextEditorProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  mentionCandidates?: string[];
  placeholder?: string;
  autoFocus?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  onPendingUploadsChange?: (hasPendingUploads: boolean) => void;
  onImageUploadError?: (message: string) => void;
  enableImageUpload?: boolean;
};

type SerializedImageNode = {
  type: 'image';
  version: 1;
  src: string;
  altText: string;
};

class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.altText);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (!(domNode instanceof HTMLImageElement)) return null;
          return {
            node: new ImageNode(domNode.getAttribute('src') ?? '', domNode.getAttribute('alt') ?? ''),
          };
        },
        priority: 1,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    if (this.__altText) {
      element.setAttribute('alt', this.__altText);
    }
    return { element };
  }

  constructor(src: string, altText = '', key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  getSrc(): string {
    return this.__src;
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return <img src={this.__src} alt={this.__altText} className="h-auto max-w-full rounded" />;
  }
}

function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}

function $createImageNode(src: string, altText = ''): ImageNode {
  return new ImageNode(src, altText);
}

function setEditorHtml(editor: LexicalEditor, html: string) {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const source = html?.trim() ? html : '<p></p>';
    const dom = new DOMParser().parseFromString(source, 'text/html');
    const rawNodes = $generateNodesFromDOM(editor, dom);
    const nodes: LexicalNode[] = [];
    for (const node of rawNodes) {
      if ($isElementNode(node) || node instanceof DecoratorNode) {
        nodes.push(node);
        continue;
      }
      const paragraph = $createParagraphNode();
      paragraph.append(node);
      nodes.push(paragraph);
    }
    if (nodes.length === 0) {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(''));
      root.append(paragraph);
      return;
    }
    root.append(...nodes);
  });
}

function insertImageAtSelection(editor: LexicalEditor, src: string) {
  editor.update(() => {
    const selection = $getSelection();
    const imageNode = $createImageNode(src);
    if ($isRangeSelection(selection)) {
      selection.insertNodes([imageNode]);
      return;
    }
    $getRoot().append(imageNode);
  });
}

function replaceImageSrc(editor: LexicalEditor, fromSrc: string, toSrc: string) {
  editor.update(() => {
    const visit = (node: LexicalNode) => {
      if ($isImageNode(node) && node.getSrc() === fromSrc) {
        node.setSrc(toSrc);
      }
      if (node instanceof ElementNode) {
        node.getChildren().forEach(visit);
      }
    };
    visit($getRoot());
  });
}

function removeImageBySrc(editor: LexicalEditor, targetSrc: string) {
  editor.update(() => {
    const visit = (node: LexicalNode) => {
      if ($isImageNode(node) && node.getSrc() === targetSrc) {
        node.remove();
        return;
      }
      if (node instanceof ElementNode) {
        node.getChildren().forEach(visit);
      }
    };
    visit($getRoot());
  });
}

function insertPlainTextAtSelection(editor: LexicalEditor, text: string) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.insertText(text);
      return;
    }
    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode(text));
    $getRoot().append(paragraph);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntilImageReachable(url: string, attempts = 6, delayMs = 200): Promise<void> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const probeUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}-${attempt}`;
    const loaded = await new Promise<boolean>((resolve) => {
      const img = new globalThis.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = probeUrl;
    });
    if (loaded) return;
    await wait(delayMs);
  }
  throw new Error('Image not reachable yet');
}

function dataUrlToFile(dataUrl: string, fallbackName = 'pasted-image.png'): File | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const base64 = match[2];
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], fallbackName, { type: mimeType });
  } catch {
    return null;
  }
}

function extractPreferredPastedText(plainText: string, html: string, uriListRaw: string): string {
  const uriLines = uriListRaw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  const uriFromList = uriLines[0] ?? '';
  if (uriFromList) return uriFromList;

  const hrefMatch = html.match(/href=["']([^"']+)["']/i);
  const hrefFromHtml = hrefMatch?.[1]?.trim() ?? '';
  if (hrefFromHtml) return hrefFromHtml;

  const firstUrlMatch = plainText.match(/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/i);
  if (firstUrlMatch?.[1]) return firstUrlMatch[1];

  return plainText;
}

type IconButtonProps = {
  label: string;
  onClick: () => void;
  children: JSX.Element;
};

function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}

type ToolbarPluginProps = {
  enableImageUpload: boolean;
  onPickImage: (file: File) => Promise<void>;
};

function getSelectedLinkUrl(editor: LexicalEditor): string {
  let currentUrl = '';

  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const nodes = selection.getNodes();
    for (const node of nodes) {
      let current: LexicalNode | null = node;
      while (current) {
        if (current instanceof LinkNode) {
          currentUrl = current.getURL();
          return;
        }
        current = current.getParent();
      }
    }
  });

  return currentUrl;
}

function ToolbarPlugin({ enableImageUpload, onPickImage }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const run = <TPayload,>(
    command: Parameters<LexicalEditor['dispatchCommand']>[0],
    payload: TPayload,
  ) => {
    editor.focus();
    editor.dispatchCommand(command as never, payload as never);
  };

  function setLink() {
    const currentUrl = getSelectedLinkUrl(editor);
    const rawUrl = window.prompt('URL del link (vacio para cancelar):', currentUrl);
    if (rawUrl === null) return;
    const trimmed = rawUrl.trim();
    if (!trimmed) return;

    const normalized = /^(https?:\/\/|mailto:)/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, normalized);
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded border bg-muted/30 p-1">
      <IconButton label="Undo" onClick={() => run(UNDO_COMMAND, undefined)}>
        <Undo2 className="h-4 w-4" />
      </IconButton>
      <IconButton label="Redo" onClick={() => run(REDO_COMMAND, undefined)}>
        <Redo2 className="h-4 w-4" />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-border" />

      <IconButton label="Bold" onClick={() => run(FORMAT_TEXT_COMMAND, 'bold')}>
        <Bold className="h-4 w-4" />
      </IconButton>
      <IconButton label="Italic" onClick={() => run(FORMAT_TEXT_COMMAND, 'italic')}>
        <Italic className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Underline"
        onClick={() => run(FORMAT_TEXT_COMMAND, 'underline')}
      >
        <Underline className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Strikethrough"
        onClick={() => run(FORMAT_TEXT_COMMAND, 'strikethrough')}
      >
        <Strikethrough className="h-4 w-4" />
      </IconButton>
      <IconButton label="Inline code" onClick={() => run(FORMAT_TEXT_COMMAND, 'code')}>
        <Code2 className="h-4 w-4" />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-border" />

      <IconButton
        label="Align left"
        onClick={() => run(FORMAT_ELEMENT_COMMAND, 'left')}
      >
        <AlignLeft className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Align center"
        onClick={() => run(FORMAT_ELEMENT_COMMAND, 'center')}
      >
        <AlignCenter className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Align right"
        onClick={() => run(FORMAT_ELEMENT_COMMAND, 'right')}
      >
        <AlignRight className="h-4 w-4" />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-border" />

      <IconButton
        label="Bullet list"
        onClick={() => run(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <List className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Ordered list"
        onClick={() => run(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <ListOrdered className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Remove list"
        onClick={() => run(REMOVE_LIST_COMMAND, undefined)}
      >
        <ListX className="h-4 w-4" />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-border" />

      <IconButton label="Set link" onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </IconButton>
      <IconButton label="Remove link" onClick={() => run(TOGGLE_LINK_COMMAND, null)}>
        <Link2Off className="h-4 w-4" />
      </IconButton>
      {enableImageUpload ? (
        <>
          <IconButton label="Image" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              await onPickImage(file);
              event.currentTarget.value = '';
            }}
          />
        </>
      ) : null}
    </div>
  );
}

type AutoFocusPluginProps = {
  enabled: boolean;
};

function AutoFocusPlugin({ enabled }: AutoFocusPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!enabled) return;
    editor.focus();
  }, [enabled, editor]);

  return null;
}

type MentionsPluginProps = {
  candidates: string[];
};

function MentionsPlugin({ candidates }: MentionsPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          setQuery(null);
          return;
        }

        const anchorNode = selection.anchor.getNode();
        if (!$isTextNode(anchorNode)) {
          setQuery(null);
          return;
        }

        const beforeCursor = anchorNode.getTextContent().slice(0, selection.anchor.offset);
        const match = /(?:^|\s)@([a-zA-Z0-9._%+-]{0,50})$/.exec(beforeCursor);
        const nextQuery = match?.[1]?.toLowerCase() ?? null;
        setQuery(nextQuery);
        if (nextQuery === null) setActiveIndex(0);
      });
    });
  }, [editor]);

  const options = useMemo(() => {
    if (query === null) return [];
    const normalizedQuery = query.toLowerCase().trim();

    return candidates
      .map((email) => email.toLowerCase())
      .filter((email) => {
        const localPart = email.split('@')[0] ?? '';
        if (!normalizedQuery) return true;
        return email.startsWith(normalizedQuery) || localPart.startsWith(normalizedQuery);
      })
      .slice(0, 6)
      .map((email) => (email.split('@')[0] ?? email).toLowerCase());
  }, [candidates, query]);

  useEffect(() => {
    if (activeIndex >= options.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, options.length]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        if (query === null || options.length === 0) return false;

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setActiveIndex((prev) => (prev + 1) % options.length);
          return true;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
          return true;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          selectMention(options[activeIndex] ?? options[0]);
          return true;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          setQuery(null);
          setActiveIndex(0);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [activeIndex, editor, options, query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const root = editor.getRootElement();
      if (!root) return;
      const target = event.target;
      if (target instanceof Node && root.contains(target)) return;
      setQuery(null);
      setActiveIndex(0);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [editor]);

  if (query === null || options.length === 0) return null;

  function selectMention(localPart: string) {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (!selection.isCollapsed()) return;

      const anchorNode = selection.anchor.getNode();
      if ($isTextNode(anchorNode)) {
        const fullText = anchorNode.getTextContent();
        const cursorOffset = selection.anchor.offset;
        const beforeCursor = fullText.slice(0, cursorOffset);
        const triggerMatch = /(?:^|\s)@([a-zA-Z0-9._%+-]{0,50})$/.exec(beforeCursor);
        if (!triggerMatch) return;

        const typedToken = triggerMatch[1] ?? '';
        const mentionStart = cursorOffset - typedToken.length - 1;
        if (mentionStart < 0 || fullText[mentionStart] !== '@') return;

        // Si el cursor esta en el medio de una mención, tambien removemos la parte derecha.
        let mentionEnd = cursorOffset;
        while (
          mentionEnd < fullText.length &&
          /[a-zA-Z0-9._%+-]/.test(fullText[mentionEnd] ?? '')
        ) {
          mentionEnd += 1;
        }

        const replacement = `@${localPart} `;
        const nextText = fullText.slice(0, mentionStart) + replacement + fullText.slice(mentionEnd);

        anchorNode.setTextContent(nextText);
        const nextOffset = mentionStart + replacement.length;
        selection.anchor.set(anchorNode.getKey(), nextOffset, 'text');
        selection.focus.set(anchorNode.getKey(), nextOffset, 'text');
        setQuery(null);
        return;
      }

      selection.insertText(`@${localPart} `);
      setQuery(null);
      setActiveIndex(0);
    });
  }

  return (
    <div className="rounded border bg-popover p-1 shadow-sm">
      <div className="mb-1 px-2 text-[11px] opacity-70">Menciones</div>
      <div className="space-y-1">
        {options.map((localPart, index) => (
          <button
            key={localPart}
            type="button"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseDown={(event) => {
              event.preventDefault();
              selectMention(localPart);
            }}
            className={`block w-full rounded px-2 py-1 text-left text-sm ${
              activeIndex === index ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60'
            }`}
          >
            @{localPart}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RichTextEditor({
  name,
  value,
  onChange,
  mentionCandidates = [],
  placeholder = 'Escribe...',
  autoFocus = false,
  onImageUpload,
  onPendingUploadsChange,
  onImageUploadError,
  enableImageUpload = true,
}: RichTextEditorProps) {
  const [pendingUploads, setPendingUploads] = useState(0);

  useEffect(() => {
    onPendingUploadsChange?.(pendingUploads > 0);
  }, [onPendingUploadsChange, pendingUploads]);

  const lexicalConfig = useMemo(
    () => ({
      namespace: 'task-rich-text-editor',
      theme: {
        text: {
          bold: 'font-semibold',
          italic: 'italic',
          underline: 'underline',
          strikethrough: 'line-through',
          code: 'rounded bg-muted px-1 py-0.5 font-mono text-[12px]',
        },
      },
      onError(error: Error) {
        throw error;
      },
      nodes: [ListNode, ListItemNode, LinkNode, ImageNode],
    }),
    [],
  );

  async function handlePickImage(editor: LexicalEditor, file: File) {
    const localPreviewSrc = await fileToDataUrl(file);
    insertImageAtSelection(editor, localPreviewSrc);

    if (!onImageUpload) return;

    try {
      setPendingUploads((count) => count + 1);
      const uploadedSrc = await onImageUpload(file);
      try {
        await waitUntilImageReachable(uploadedSrc);
      } catch {
        // Si tarda en propagarse, igual reemplazamos src.
      }
      replaceImageSrc(editor, localPreviewSrc, uploadedSrc);
    } catch {
      removeImageBySrc(editor, localPreviewSrc);
      onImageUploadError?.('No se pudo subir la imagen. Intenta nuevamente.');
    } finally {
      setPendingUploads((count) => Math.max(0, count - 1));
    }
  }

  return (
    <LexicalComposer initialConfig={lexicalConfig}>
      <EditorShell
        name={name}
        value={value}
        onChange={onChange}
        mentionCandidates={mentionCandidates}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onPickImage={handlePickImage}
        enableImageUpload={enableImageUpload}
      />
    </LexicalComposer>
  );
}

type EditorShellProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  mentionCandidates: string[];
  placeholder: string;
  autoFocus: boolean;
  onPickImage: (editor: LexicalEditor, file: File) => Promise<void>;
  enableImageUpload: boolean;
};

function EditorShell({
  name,
  value,
  onChange,
  mentionCandidates,
  placeholder,
  autoFocus,
  onPickImage,
  enableImageUpload,
}: EditorShellProps) {
  const [editor] = useLexicalComposerContext();
  const lastHtmlFromEditorRef = useRef(value || '<p></p>');
  const didHydrateInitialValueRef = useRef(false);

  const handlePickImage = async (file: File) => {
    await onPickImage(editor, file);
  };

  useEffect(() => {
    const nextHtml = value?.trim() ? value : '<p></p>';
    if (!didHydrateInitialValueRef.current) {
      didHydrateInitialValueRef.current = true;
      setEditorHtml(editor, nextHtml);
      lastHtmlFromEditorRef.current = nextHtml;
      return;
    }
    if (nextHtml === lastHtmlFromEditorRef.current) return;
    setEditorHtml(editor, nextHtml);
    lastHtmlFromEditorRef.current = nextHtml;
  }, [editor, value]);

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const clipboard = event.clipboardData;
    if (!clipboard) return;

    const imageFileFromFiles = Array.from(clipboard.files ?? []).find((file) =>
      file.type.startsWith('image/'),
    );
    const imageFileFromItems = Array.from(clipboard.items ?? [])
      .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile();
    const imageFile = imageFileFromFiles ?? imageFileFromItems ?? null;
    if (imageFile && enableImageUpload) {
      event.preventDefault();
      void handlePickImage(imageFile);
      return;
    }

    const html = clipboard.getData('text/html');
    const dataUrlMatch = html.match(/<img[^>]+src=["'](data:image\/[^"']+)["']/i);
    const dataUrl = dataUrlMatch?.[1];
    if (dataUrl) {
      const imageFromHtml = enableImageUpload ? dataUrlToFile(dataUrl) : null;
      if (imageFromHtml) {
        event.preventDefault();
        void handlePickImage(imageFromHtml);
        return;
      }
    }

    const plainText = clipboard.getData('text/plain').trim();
    const uriList = clipboard.getData('text/uri-list').trim();
    const textToInsert = extractPreferredPastedText(plainText, html, uriList).trim();
    if (!textToInsert) return;

    event.preventDefault();
    event.stopPropagation();
    insertPlainTextAtSelection(editor, textToInsert);
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value} />
      <AutoFocusPlugin enabled={autoFocus} />
      <ToolbarPlugin enableImageUpload={enableImageUpload} onPickImage={handlePickImage} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            onPasteCapture={handlePaste}
            className="min-h-[140px] rounded border p-2 text-sm outline-none [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
          />
        }
        placeholder={<div className="px-3 py-2 text-sm opacity-70">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LinkPlugin />
      <ListPlugin />
      <MentionsPlugin candidates={mentionCandidates} />
      <OnChangePlugin
        ignoreSelectionChange
        onChange={(editorState, nextEditor) => {
          editorState.read(() => {
            const html = $generateHtmlFromNodes(nextEditor, null);
            lastHtmlFromEditorRef.current = html;
            onChange(html);
          });
        }}
      />
    </div>
  );
}

type RichTextViewerProps = {
  content: string;
};

export function RichTextViewer({ content }: RichTextViewerProps) {
  const highlightedContent = (content || '<p></p>').replace(
    /(^|[\s>])@([a-zA-Z0-9._%+-]+)/g,
    '$1<span class="mention-token">@$2</span>',
  );

  return (
    <div
      className="rounded border border-dashed p-2 text-left text-sm opacity-85 [&_a]:text-blue-600 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_.mention-token]:font-medium [&_.mention-token]:text-sky-600 [&_.mention-token]:underline-offset-2 [&_.mention-token]:hover:underline"
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  );
}
