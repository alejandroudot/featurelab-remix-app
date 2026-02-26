import { useRef } from 'react';
import type { JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
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

// Toolbar de formato.
// Solo dispara comandos Lexical; no guarda estado de negocio.
type ToolbarPluginProps = {
  enableImageUpload: boolean;
  onPickImage: (file: File) => Promise<void>;
};

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
      // PreventDefault evita perder el foco del editor al clickear un boton.
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}

function getSelectedLinkUrl(editor: LexicalEditor): string {
  // Lee la seleccion para detectar si ya estamos dentro de un link
  // y asi prellenar el prompt de edicion.
  let currentUrl = '';

  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const nodes = selection.getNodes();
    for (const node of nodes) {
      let current: LexicalNode | null = node;
      while (current) {
        if (current instanceof LinkNode) {
          // Si la seleccion cae dentro de un link, devolvemos esa URL para prellenar el prompt.
          currentUrl = current.getURL();
          return;
        }
        current = current.getParent();
      }
    }
  });

  return currentUrl;
}

export function ToolbarPlugin({ enableImageUpload, onPickImage }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const run = <TPayload,>(
    command: Parameters<LexicalEditor['dispatchCommand']>[0],
    payload: TPayload,
  ) => {
    // Enfocamos antes de ejecutar comando para asegurar que actue sobre la seleccion actual.
    editor.focus();
    editor.dispatchCommand(command as never, payload as never);
  };

  function setLink() {
    // UX simple: prompt para definir/cambiar URL del enlace seleccionado.
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
      <IconButton label="Underline" onClick={() => run(FORMAT_TEXT_COMMAND, 'underline')}>
        <Underline className="h-4 w-4" />
      </IconButton>
      <IconButton label="Strikethrough" onClick={() => run(FORMAT_TEXT_COMMAND, 'strikethrough')}>
        <Strikethrough className="h-4 w-4" />
      </IconButton>
      <IconButton label="Inline code" onClick={() => run(FORMAT_TEXT_COMMAND, 'code')}>
        <Code2 className="h-4 w-4" />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-border" />

      <IconButton label="Align left" onClick={() => run(FORMAT_ELEMENT_COMMAND, 'left')}>
        <AlignLeft className="h-4 w-4" />
      </IconButton>
      <IconButton label="Align center" onClick={() => run(FORMAT_ELEMENT_COMMAND, 'center')}>
        <AlignCenter className="h-4 w-4" />
      </IconButton>
      <IconButton label="Align right" onClick={() => run(FORMAT_ELEMENT_COMMAND, 'right')}>
        <AlignRight className="h-4 w-4" />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-border" />

      <IconButton label="Bullet list" onClick={() => run(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        <List className="h-4 w-4" />
      </IconButton>
      <IconButton label="Ordered list" onClick={() => run(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        <ListOrdered className="h-4 w-4" />
      </IconButton>
      <IconButton label="Remove list" onClick={() => run(REMOVE_LIST_COMMAND, undefined)}>
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
              // El upload real lo maneja el hook, aqui solo seleccionamos archivo.
              await onPickImage(file);
              event.currentTarget.value = '';
            }}
          />
        </>
      ) : null}
    </div>
  );
}

