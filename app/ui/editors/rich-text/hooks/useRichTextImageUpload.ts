import { useCallback, useEffect, useState } from 'react';
import type { LexicalEditor } from 'lexical';
import {
  insertImageAtSelection,
  removeImageBySrc,
  replaceImageSrc,
} from '../utils/editorOperations';
import { fileToDataUrl, waitUntilImageReachable } from '../utils/uploadUtils';

// Hook de upload de imagenes embebidas.
// Encapsula pending state + reemplazo de preview local por URL final.
type UseRichTextImageUploadInput = {
  onImageUpload?: (file: File) => Promise<string>;
  onPendingUploadsChange?: (hasPendingUploads: boolean) => void;
  onImageUploadError?: (message: string) => void;
};

export function useRichTextImageUpload({
  onImageUpload,
  onPendingUploadsChange,
  onImageUploadError,
}: UseRichTextImageUploadInput) {
  const [pendingUploads, setPendingUploads] = useState(0);

  useEffect(() => {
    // Le avisamos al contenedor si hay uploads en curso (para bloquear submit, mostrar texto, etc.).
    onPendingUploadsChange?.(pendingUploads > 0);
  }, [onPendingUploadsChange, pendingUploads]);

  const handlePickImage = useCallback(
    async (editor: LexicalEditor, file: File) => {
      const localPreviewSrc = await fileToDataUrl(file);
      // 1) Insertamos preview inmediata para feedback visual.
      insertImageAtSelection(editor, localPreviewSrc);

      if (!onImageUpload) return;
      // Si no hay backend de upload, dejamos solo preview local (modo local/simple).

      try {
        setPendingUploads((count) => count + 1);
        // 2) Subimos y obtenemos URL final.
        const uploadedSrc = await onImageUpload(file);
        try {
          // 3) Esperamos propagacion de archivo para evitar "imagen rota" instantanea.
          await waitUntilImageReachable(uploadedSrc);
        } catch {
          // Si tarda en propagarse, igual reemplazamos src.
        }
        // 4) Reemplazamos src local por src final.
        replaceImageSrc(editor, localPreviewSrc, uploadedSrc);
      } catch {
        // Si falla upload, eliminamos el preview para no dejar basura visual.
        removeImageBySrc(editor, localPreviewSrc);
        onImageUploadError?.('No se pudo subir la imagen. Intenta nuevamente.');
      } finally {
        setPendingUploads((count) => Math.max(0, count - 1));
      }
    },
    [onImageUpload, onImageUploadError],
  );

  return {
    pendingUploads,
    handlePickImage,
  };
}
