export function getSafeRedirectTo(formData: FormData, fallback = '/') {
  const raw = String(formData.get('redirectTo') ?? '').trim();
  return raw.startsWith('/') ? raw : fallback;
}
