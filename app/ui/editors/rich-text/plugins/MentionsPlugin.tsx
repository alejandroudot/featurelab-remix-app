import { useEffect, useMemo, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from 'lexical';
import {
  applyMentionToText,
  buildMentionOptions,
  findMentionQuery,
  getActiveMentionRange,
} from './mentions.utils';

// Plugin de menciones:
// - detecta "@token" cerca del cursor
// - filtra candidatos
// - inserta/reemplaza la mencion seleccionada.
type MentionsPluginProps = {
  candidates: string[];
};

export function MentionsPlugin({ candidates }: MentionsPluginProps) {
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
        // Busca un token de mencion activo en el tramo previo al cursor.
        const nextQuery = findMentionQuery(beforeCursor);
        setQuery(nextQuery);
        if (nextQuery === null) setActiveIndex(0);
      });
    });
  }, [editor]);

  const options = useMemo(() => {
    if (query === null) return [];
    // Normalizamos y filtramos opciones para mostrar un shortlist util.
    return buildMentionOptions(candidates, query);
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
        // Capturamos teclado solo cuando hay lista activa de menciones.
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
      // Click fuera del editor: cerramos el menu de menciones.
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
        const mentionRange = getActiveMentionRange({ fullText, cursorOffset });
        if (!mentionRange) return;
        // Reemplaza solo el token activo de mencion y deja el resto del texto intacto.
        const { nextText, nextOffset } = applyMentionToText(fullText, mentionRange, localPart);

        anchorNode.setTextContent(nextText);
        selection.anchor.set(anchorNode.getKey(), nextOffset, 'text');
        selection.focus.set(anchorNode.getKey(), nextOffset, 'text');
        setQuery(null);
        setActiveIndex(0);
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
