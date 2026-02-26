import { useCallback } from 'react';
import type { ClipboardEvent } from 'react';
import type { LexicalEditor } from 'lexical';
import { insertPlainTextAtSelection } from '../utils/editorOperations';
import { dataUrlToFile, extractPreferredPastedText } from '../utils/uploadUtils';

// Hook de pegado:
// - prioriza imagen si hay archivo/image data
// - si no, normaliza texto/url pegada para evitar HTML raro.
type UseRichTextPasteHandlerInput = {
  editor: LexicalEditor;
  enableImageUpload: boolean;
  onPickImage: (file: File) => Promise<void>;
};

export function useRichTextPasteHandler({
  editor,
  enableImageUpload,
  onPickImage,
}: UseRichTextPasteHandlerInput) {
  return useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
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
        // Caso 1: pegado de imagen real desde clipboard.
        event.preventDefault();
        void onPickImage(imageFile);
        return;
      }

      const html = clipboard.getData('text/html');
      // Algunos navegadores pegan imagen como <img src="data:image/..."> dentro de HTML.
      const dataUrlMatch = html.match(/<img[^>]+src=["'](data:image\/[^"']+)["']/i);
      const dataUrl = dataUrlMatch?.[1];
      if (dataUrl) {
        const imageFromHtml = enableImageUpload ? dataUrlToFile(dataUrl) : null;
        if (imageFromHtml) {
          // Caso 2: imagen embebida como data URL en HTML del clipboard.
          event.preventDefault();
          void onPickImage(imageFromHtml);
          return;
        }
      }

      const plainText = clipboard.getData('text/plain').trim();
      const uriList = clipboard.getData('text/uri-list').trim();
      const textToInsert = extractPreferredPastedText(plainText, html, uriList).trim();
      if (!textToInsert) return;

      // Caso 3: texto/url simple.
      event.preventDefault();
      event.stopPropagation();
      insertPlainTextAtSelection(editor, textToInsert);
    },
    [editor, enableImageUpload, onPickImage],
  );
}
