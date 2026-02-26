import { useMemo, useRef, useState } from 'react';

type MentionTextareaProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  candidates: string[];
  className?: string;
  placeholder?: string;
  rows?: number;
  autoFocus?: boolean;
};

type MentionContext = {
  start: number;
  end: number;
  query: string;
};

function getMentionContext(text: string, cursor: number): MentionContext | null {
  if (cursor <= 0) return null;

  let atIndex = -1;
  // Busca hacia atras desde el cursor hasta encontrar el @ activo.
  for (let i = cursor - 1; i >= 0; i -= 1) {
    const char = text[i];
    if (char === '@') {
      atIndex = i;
      break;
    }
    if (/\s/.test(char)) break;
  }

  if (atIndex === -1) return null;
  const query = text.slice(atIndex + 1, cursor);
  return { start: atIndex, end: cursor, query };
}

export function MentionTextarea({
  name,
  value,
  onChange,
  candidates,
  className,
  placeholder,
  rows = 4,
  autoFocus,
}: MentionTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // Guarda el estado de "mencion en curso" (@ + texto parcial).
  const [mention, setMention] = useState<MentionContext | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    if (!mention) return [];
    const query = mention.query.toLowerCase().replace(/^@+/, '');
    // Con solo "@" no mostramos lista para evitar ruido.
    if (query.length === 0) return [];
    // Matchea por inicio de email o local-part: @ale -> ale@dominio.
    return candidates
      .filter((candidate) => {
        const email = candidate.toLowerCase();
        const localPart = email.split('@')[0] ?? '';
        return email.startsWith(query) || localPart.startsWith(query);
      })
      .slice(0, 6);
  }, [candidates, mention]);

  function refreshMentionFromCursor() {
    const textareaElement = textareaRef.current;
    if (!textareaElement) return;
    // Recalcula contexto cuando el usuario mueve cursor/click.
    const next = getMentionContext(textareaElement.value, textareaElement.selectionStart ?? 0);
    setMention(next);
    setActiveIndex(0);
  }

  function applyMention(candidate: string) {
    if (!mention) return;
    const email = candidate.toLowerCase().replace(/^@+/, '');
    const localPart = email.split('@')[0] ?? email;
    const mentionText = `@${localPart}`;
    // Reemplaza el fragmento @parcial por @usuario final + espacio.
    const nextValue = `${value.slice(0, mention.start)}${mentionText} ${value.slice(mention.end)}`;
    const nextCursor = mention.start + mentionText.length + 1;

    onChange(nextValue);
    setMention(null);
    setActiveIndex(0);

    // Reubica cursor/foco luego del texto insertado para seguir escribiendo fluido.
    requestAnimationFrame(() => {
      const textareaElement = textareaRef.current;
      if (!textareaElement) return;
      textareaElement.focus();
      textareaElement.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          // Mientras se escribe, revisa si el cursor sigue dentro de una mencion activa.
          const next = getMentionContext(event.target.value, event.target.selectionStart ?? 0);
          setMention(next);
          setActiveIndex(0);
        }}
        onClick={refreshMentionFromCursor}
        onKeyUp={refreshMentionFromCursor}
        onKeyDown={(event) => {
          if (!mention || filtered.length === 0) return;

          // Navegacion por teclado de sugerencias.
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((prev) => (prev + 1) % filtered.length);
            return;
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
            return;
          }
          if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            applyMention(filtered[activeIndex] ?? filtered[0]);
            return;
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            // Cierra sugerencias sin modificar texto.
            setMention(null);
            setActiveIndex(0);
          }
        }}
        className={className}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
      />

      {mention && filtered.length > 0 ? (
        // Lista de sugerencias contextual, debajo del textarea.
        <ul className="mt-1 w-full rounded border bg-background p-1">
          {filtered.map((candidate, index) => (
            <li key={candidate}>
              <button
                type="button"
                // Evita que el click saque foco del textarea antes de insertar.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyMention(candidate)}
                className={`w-full rounded px-2 py-1 text-left text-xs ${
                  activeIndex === index ? 'bg-accent' : ''
                }`}
              >
                <span className="font-medium">{candidate.split('@')[0]}</span>
                <span className="opacity-70"> ({candidate})</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
