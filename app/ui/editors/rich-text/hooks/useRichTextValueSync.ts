import { useEffect, useRef } from 'react';
import type { LexicalEditor } from 'lexical';
import { setEditorHtml } from '../utils/editorOperations';

// Hook de sincronizacion controlada:
// mantiene editor y prop `value` alineados sin generar bucles.
export function useRichTextValueSync(editor: LexicalEditor, value: string) {
  // Ultimo HTML emitido desde OnChangePlugin.
  // Se usa para distinguir "cambio externo real" vs "eco del propio editor".
  const lastHtmlFromEditorRef = useRef(value || '<p></p>');
  // Evita rehidratar varias veces el valor inicial.
  const didHydrateInitialValueRef = useRef(false);

  useEffect(() => {
    const nextHtml = value?.trim() ? value : '<p></p>';
    if (!didHydrateInitialValueRef.current) {
      // Primera hidratacion: escribimos valor inicial al editor.
      didHydrateInitialValueRef.current = true;
      setEditorHtml(editor, nextHtml);
      lastHtmlFromEditorRef.current = nextHtml;
      return;
    }
    // Si viene el mismo HTML que ya emitio el editor, no reescribimos.
    if (nextHtml === lastHtmlFromEditorRef.current) return;
    setEditorHtml(editor, nextHtml);
    lastHtmlFromEditorRef.current = nextHtml;
  }, [editor, value]);

  return { lastHtmlFromEditorRef };
}
