import { copyFile, mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads', 'tasks');
const TMP_UPLOAD_DIR = path.join(UPLOAD_DIR, 'tmp');
const TMP_URL_PREFIX = '/uploads/tasks/tmp/';
const FINAL_URL_PREFIX = '/uploads/tasks/';

// Normaliza nombre para evitar caracteres invalidos en filesystem/URL.
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Extrae rutas /tmp referenciadas dentro del HTML del editor.
function extractTmpImagePathsFromHtml(html: string): string[] {
  const matches = html.match(/\/uploads\/tasks\/tmp\/[a-zA-Z0-9._-]+/g) ?? [];
  return [...new Set(matches)];
}

// Convierte una URL publica /tmp al path real en disco.
function toTmpDiskPath(tmpStoragePath: string): string | null {
  if (!tmpStoragePath.startsWith(TMP_URL_PREFIX)) return null;
  const fileName = tmpStoragePath.slice(TMP_URL_PREFIX.length);
  if (!fileName) return null;
  return path.join(TMP_UPLOAD_DIR, fileName);
}

// Guarda una imagen subida por el editor en carpeta temporal y devuelve su URL publica.
export async function saveRichTextImageTemp(file: File): Promise<{
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
}> {
  await mkdir(TMP_UPLOAD_DIR, { recursive: true });

  const safeFileName = sanitizeFileName(file.name || 'image');
  const finalName = `${crypto.randomUUID()}-${safeFileName}`;
  const fullPath = path.join(TMP_UPLOAD_DIR, finalName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(fullPath, bytes);

  return {
    fileName: file.name || safeFileName,
    mimeType: file.type || 'application/octet-stream',
    sizeBytes: file.size,
    storagePath: `${TMP_URL_PREFIX}${finalName}`,
  };
}

// Reescribe HTML pasando rutas /tmp a rutas finales y copia archivos a carpeta definitiva.
export async function finalizeRichTextTempImagesInHtml(html: string): Promise<string> {
  const tmpPaths = extractTmpImagePathsFromHtml(html);
  if (tmpPaths.length === 0) return html;

  await mkdir(UPLOAD_DIR, { recursive: true });
  let nextHtml = html;

  for (const tmpPath of tmpPaths) {
    const tmpFilePath = toTmpDiskPath(tmpPath);
    if (!tmpFilePath) continue;
    const fileName = tmpPath.slice(TMP_URL_PREFIX.length);
    const finalPath = `${FINAL_URL_PREFIX}${fileName}`;
    const finalDiskPath = path.join(UPLOAD_DIR, fileName);

    try {
      // Copiamos en lugar de mover para evitar "imagen rota" si el cliente
      // renderiza por un instante HTML viejo apuntando a /tmp.
      await copyFile(tmpFilePath, finalDiskPath);
      nextHtml = nextHtml.replaceAll(tmpPath, finalPath);
    } catch {
      // Si el archivo tmp ya no existe, dejamos el src original.
    }
  }

  return nextHtml;
}

// Borra todos los archivos /tmp referenciados en un HTML (uso en cancel/reset).
export async function cleanupRichTextTempImagesFromHtml(html: string): Promise<void> {
  const tmpPaths = extractTmpImagePathsFromHtml(html);
  if (tmpPaths.length === 0) return;

  await Promise.all(
    tmpPaths.map(async (tmpPath) => {
      const tmpFilePath = toTmpDiskPath(tmpPath);
      if (!tmpFilePath) return;
      try {
        await unlink(tmpFilePath);
      } catch {
        // No bloqueamos flujo por archivo ya eliminado.
      }
    }),
  );
}

// Borra solo los /tmp que estan en el borrador pero no en el contenido persistido.
// Sirve para limpiar "huerfanas" sin tocar imagenes que siguen usadas por la task.
export async function cleanupRichTextTempImagesNotInPersistedHtml(
  draftHtml: string,
  persistedHtml: string,
): Promise<void> {
  const draftTmpPaths = extractTmpImagePathsFromHtml(draftHtml);
  if (draftTmpPaths.length === 0) return;

  const persistedTmpPathSet = new Set(extractTmpImagePathsFromHtml(persistedHtml));
  const removableTmpPaths = draftTmpPaths.filter((tmpPath) => !persistedTmpPathSet.has(tmpPath));
  if (removableTmpPaths.length === 0) return;

  await Promise.all(
    removableTmpPaths.map(async (tmpPath) => {
      const tmpFilePath = toTmpDiskPath(tmpPath);
      if (!tmpFilePath) return;
      try {
        await unlink(tmpFilePath);
      } catch {
        // No bloqueamos flujo por archivo ya eliminado.
      }
    }),
  );
}
