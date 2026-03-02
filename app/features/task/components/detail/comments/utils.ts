export function getMeaningfulTextFromHtml(html: string): string {
  return html
    // 1) Quita todas las etiquetas HTML (<p>, <strong>, etc.) y las reemplaza por espacio.
    .replace(/<[^>]*>/g, ' ')
    // 2) Convierte espacios no separables (&nbsp;) en espacios normales.
    .replace(/&nbsp;/gi, ' ')
    // 3) Colapsa multiples espacios/saltos/tabulaciones en un solo espacio.
    .replace(/\s+/g, ' ')
    // 4) Elimina espacios al inicio y al final.
    .trim();
}

