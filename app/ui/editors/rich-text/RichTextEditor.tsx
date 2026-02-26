import { useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import type { LexicalEditor } from 'lexical';
import { ImageNode } from './nodes/ImageNode';
import { RichTextEditorShell } from './RichTextEditorShell';
import { RichTextViewer } from './viewer/RichTextViewer';
import { useRichTextImageUpload } from './hooks/useRichTextImageUpload';

// Fachada publica del editor rich text.
// Este componente solo compone: config de Lexical + shell + hook de upload.
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

export function RichTextEditor({
  name,
  value,
  onChange,
  mentionCandidates = [],
  placeholder = '',
  autoFocus = false,
  onImageUpload,
  onPendingUploadsChange,
  onImageUploadError,
  enableImageUpload = true,
}: RichTextEditorProps) {
  // Encapsula todo el ciclo de imagenes (preview local, upload remoto, replace de src y pending state).
  const { handlePickImage } = useRichTextImageUpload({
    onImageUpload,
    onPendingUploadsChange,
    onImageUploadError,
  });

  const lexicalConfig = useMemo(
    () => ({
      // Namespace de Lexical para aislar este editor de otros posibles editores en la app.
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
        // Dejamos que el boundary/app capture errores reales del editor.
        throw error;
      },
      // Nodos extra que habilitamos sobre el core de Lexical.
      nodes: [ListNode, ListItemNode, LinkNode, ImageNode],
    }),
    [],
  );

  return (
    <LexicalComposer initialConfig={lexicalConfig}>
      <RichTextEditorShell
        name={name}
        value={value}
        onChange={onChange}
        mentionCandidates={mentionCandidates}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onPickImage={async (editor: LexicalEditor, file: File) => {
          await handlePickImage(editor, file);
        }}
        enableImageUpload={enableImageUpload}
      />
    </LexicalComposer>
  );
}

export { RichTextViewer };
