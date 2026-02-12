	// para que cuando de alguna url me mandan a logear luego redirija al lugar de donde me mando
export function safeRedirect(
  redirectTo: string | null | undefined,
  defaultRedirect = "/tasks"
) {
  if (!redirectTo) return defaultRedirect;

  // solo permitimos paths internos tipo "/flags"
  if (!redirectTo.startsWith("/")) return defaultRedirect;

  // bloquea "//evil.com"
  if (redirectTo.startsWith("//")) return defaultRedirect;

  // opcional: bloquea caracteres raros
  if (redirectTo.includes("\n") || redirectTo.includes("\r")) return defaultRedirect;

  return redirectTo;
}