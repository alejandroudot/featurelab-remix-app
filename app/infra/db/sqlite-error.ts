export function isSqliteUniqueConstraintError(err: unknown) {
  if (!err || typeof err !== "object") return false;
  const anyErr = err as any;
  if (anyErr.code === "SQLITE_CONSTRAINT_UNIQUE") return true;
  return String(anyErr.message ?? "").includes("UNIQUE constraint failed");
}
