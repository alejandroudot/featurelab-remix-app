export function getFlagDebugOverrideFromUrl(input: {
  url: URL;
  key: string;
  enabled: boolean;
}): boolean | undefined {
  if (!input.enabled) return undefined;

  const raw = input.url.searchParams.get(`ff.${input.key}`);
  if (!raw) return undefined;

  const value = raw.toLowerCase();
  if (value === '1' || value === 'true' || value === 'on') return true;
  if (value === '0' || value === 'false' || value === 'off') return false;

  return undefined;
}
