
type MentionRangeInput = {
  fullText: string;
  cursorOffset: number;
};

type MentionRange = {
  mentionStart: number;
  mentionEnd: number;
};

const MENTION_TOKEN_REGEX = /(?:^|\s)@([a-zA-Z0-9._%+-]{0,50})$/;
const MENTION_CHAR_REGEX = /[a-zA-Z0-9._%+-]/;

export const MAX_MENTION_OPTIONS = 6;

export function findMentionQuery(beforeCursor: string): string | null {
  const match = MENTION_TOKEN_REGEX.exec(beforeCursor);
  return match?.[1]?.toLowerCase() ?? null;
}

export function buildMentionOptions(candidates: string[], query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();

  return candidates
    .map((email) => email.toLowerCase())
    .filter((email) => {
      const localPart = email.split('@')[0] ?? '';
      if (!normalizedQuery) return true;
      return email.startsWith(normalizedQuery) || localPart.startsWith(normalizedQuery);
    })
    .slice(0, MAX_MENTION_OPTIONS)
    .map((email) => (email.split('@')[0] ?? email).toLowerCase());
}

export function getActiveMentionRange({ fullText, cursorOffset }: MentionRangeInput): MentionRange | null {
  const beforeCursor = fullText.slice(0, cursorOffset);
  const query = findMentionQuery(beforeCursor);
  if (query === null) return null;

  const mentionStart = cursorOffset - query.length - 1;
  if (mentionStart < 0 || fullText[mentionStart] !== '@') return null;

  let mentionEnd = cursorOffset;
  for (let index = cursorOffset; index < fullText.length; index += 1) {
    if (!MENTION_CHAR_REGEX.test(fullText[index] ?? '')) {
      break;
    }
    mentionEnd = index + 1;
  }

  return { mentionStart, mentionEnd };
}

export function applyMentionToText(fullText: string, range: MentionRange, localPart: string) {
  const replacement = `@${localPart} `;
  const nextText =
    fullText.slice(0, range.mentionStart) + replacement + fullText.slice(range.mentionEnd);
  const nextOffset = range.mentionStart + replacement.length;

  return { nextText, nextOffset };
}

