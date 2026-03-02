export function getCookieValue(cookieHeader: string, key: string): string | null {
  const match = cookieHeader.match(new RegExp(`${key}=([^;]+)`));
  return match?.[1] ?? null;
}
