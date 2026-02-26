import type { ReactNode } from 'react';

// Detecta menciones estilo @usuario dentro de texto libre.
const MENTION_TOKEN_REGEX = /@[a-zA-Z0-9._%+-]+/g;

export function renderMentions(text: string): ReactNode[] {
  // Construimos una secuencia de nodos mezclando texto normal + spans de mención.
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  // matchAll nos da cada token @... con su posicion en el string.
  for (const match of text.matchAll(MENTION_TOKEN_REGEX)) {
    const token = match[0];
    const index = match.index ?? 0;
    // Agrega el tramo de texto plano previo a la mención.
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }
    // Renderiza la mención con estilo visual de "link" para destacarla.
    nodes.push(
      <span
        key={`${index}-${token}`}
        className="font-medium text-sky-600 underline-offset-2 hover:underline"
      >
        {token}
      </span>,
    );
    // Mueve el cursor lógico al final del token actual.
    lastIndex = index + token.length;
  }

  // Agrega el texto restante luego de la ultima mención.
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  // React puede renderizar este array directamente dentro de <div>/<p>.
  return nodes;
}
