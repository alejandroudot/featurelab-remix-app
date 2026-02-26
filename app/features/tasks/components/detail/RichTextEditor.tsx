import { useEffect, useMemo, useRef, useState } from 'react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import type { EditorView } from '@tiptap/pm/view';
import { EditorContent, useEditor } from '@tiptap/react';

type RichTextEditorProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  onPendingUploadsChange?: (hasPendingUploads: boolean) => void;
  onImageUploadError?: (message: string) => void;
};

export function RichTextEditor({
  name,
  value,
  onChange,
  placeholder = 'Escribe...',
  autoFocus,
  onImageUpload,
  onPendingUploadsChange,
  onImageUploadError,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onPendingUploadsChange?.(pendingUploads > 0);
  }, [onPendingUploadsChange, pendingUploads]);

  const extensions = useMemo(
    () => [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TiptapImage.configure({
        inline: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    [placeholder],
  );

  function insertImageInView(view: EditorView, src: string) {
    const imageNodeType = view.state.schema.nodes.image;
    if (!imageNodeType) return;
    const imageNode = imageNodeType.create({ src });
    const transaction = view.state.tr.replaceSelectionWith(imageNode).scrollIntoView();
    view.dispatch(transaction);
  }

  function replaceImageSrcInView(view: EditorView, fromSrc: string, toSrc: string) {
    const transaction = view.state.tr;
    let hasChanges = false;

    view.state.doc.descendants((node, pos) => {
      if (node.type.name !== 'image') return;
      if (node.attrs.src !== fromSrc) return;

      transaction.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        src: toSrc,
      });
      hasChanges = true;
    });

    if (hasChanges) {
      view.dispatch(transaction);
    }
  }

  function removeImageSrcInView(view: EditorView, targetSrc: string) {
    const transaction = view.state.tr;
    let hasChanges = false;

    view.state.doc.descendants((node, pos) => {
      if (node.type.name !== 'image') return;
      if (node.attrs.src !== targetSrc) return;
      transaction.delete(pos, pos + node.nodeSize);
      hasChanges = true;
    });

    if (hasChanges) {
      view.dispatch(transaction);
    }
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

  function dataUrlToFile(dataUrl: string, fallbackName = 'pasted-image.png'): File | null {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return null;
    const mimeType = match[1];
    const base64 = match[2];
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new File([bytes], fallbackName, { type: mimeType });
    } catch {
      return null;
    }
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

  const editor = useEditor(
    {
      extensions,
      content: value || '<p></p>',
      immediatelyRender: false,
      autofocus: autoFocus ? 'end' : false,
      editorProps: {
        handlePaste(_view, event) {
          const clipboard = event.clipboardData;
          if (!clipboard) return false;

          const imageFileFromFiles = Array.from(clipboard.files ?? []).find((file) =>
            file.type.startsWith('image/'),
          );
          const imageFileFromItems = Array.from(clipboard.items ?? [])
            .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
            ?.getAsFile();
          const imageFile = imageFileFromFiles ?? imageFileFromItems ?? null;
          if (imageFile) {
            event.preventDefault();
            void handlePickImage(imageFile, _view);
            return true;
          }

          const html = clipboard.getData('text/html');
          const dataUrlMatch = html.match(/<img[^>]+src=["'](data:image\/[^"']+)["']/i);
          const dataUrl = dataUrlMatch?.[1];
          if (!dataUrl) return false;

          const imageFromHtml = dataUrlToFile(dataUrl);
          if (!imageFromHtml) return false;

          event.preventDefault();
          void handlePickImage(imageFromHtml, _view);
          return true;
        },
      },
      onUpdate({ editor: currentEditor }) {
        onChange(currentEditor.getHTML());
      },
    },
    [extensions, autoFocus, onChange],
  );

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
    }
  }, [editor, value]);

  async function handlePickImage(file: File, view: EditorView) {
    const localPreviewSrc = await fileToDataUrl(file);
    insertImageInView(view, localPreviewSrc);

    if (!onImageUpload) return;

    try {
      setPendingUploads((count) => count + 1);
      const uploadedSrc = await onImageUpload(file);
      try {
        await waitUntilImageReachable(uploadedSrc);
      } catch {
        // Si tarda en propagarse, igual reemplazamos src para evitar guardar data URLs.
      }
      replaceImageSrcInView(view, localPreviewSrc, uploadedSrc);
    } catch {
      removeImageSrcInView(view, localPreviewSrc);
      onImageUploadError?.('No se pudo subir la imagen. Intenta nuevamente.');
    } finally {
      setPendingUploads((count) => Math.max(0, count - 1));
    }
  }

  if (!isMounted || !editor) {
    return (
      <div className="rounded border p-2 text-sm opacity-70">
        Cargando editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="rounded border px-2 py-1 text-xs"
        >
          Negrita
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="rounded border px-2 py-1 text-xs"
        >
          Italica
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="rounded border px-2 py-1 text-xs"
        >
          Lista
        </button>
        <button
          type="button"
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className="rounded border px-2 py-1 text-xs"
        >
          Imagen
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file || !editor) return;
            await handlePickImage(file, editor.view);
            event.currentTarget.value = '';
          }}
        />
      </div>

      <EditorContent
        editor={editor}
        className="rounded border p-2 text-sm [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:outline-none [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded"
      />
    </div>
  );
}

type RichTextViewerProps = {
  content: string;
};

export function RichTextViewer({ content }: RichTextViewerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor(
    {
      extensions: [StarterKit, Link, TiptapImage],
      content: content || '<p></p>',
      editable: false,
      immediatelyRender: false,
    },
    [content],
  );

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content || '<p></p>', { emitUpdate: false });
    }
  }, [editor, content]);

  if (!isMounted || !editor) {
    return <div className="text-sm opacity-70">Cargando...</div>;
  }

  return (
    <EditorContent
      editor={editor}
      className="rounded border border-dashed p-2 text-left text-sm opacity-85 [&_.ProseMirror]:outline-none [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded"
    />
  );
}
