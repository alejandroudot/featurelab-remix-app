function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function fileToDataUrl(file: File): Promise<string> {
  // Convierte archivo a data URL para preview inmediata local.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

export async function waitUntilImageReachable(
  url: string,
  attempts = 6,
  delayMs = 200,
): Promise<void> {
  // Sondea la URL final hasta que responda como imagen cargable.
  // Evita mostrar "imagen rota" justo despues del upload.
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

export function dataUrlToFile(dataUrl: string, fallbackName = 'pasted-image.png'): File | null {
  // Convierte data URL de clipboard HTML en un File para reutilizar el mismo flujo de upload.
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

export function extractPreferredPastedText(plainText: string, html: string, uriListRaw: string): string {
  // Prioridad de pegado:
  // 1) text/uri-list, 2) href de HTML, 3) primera URL en plain text, 4) plain text original.
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
