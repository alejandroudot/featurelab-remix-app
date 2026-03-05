type MutationResult = { success?: boolean } | null | undefined;

export function isSuccessfulMutation(result: MutationResult): boolean {
  return Boolean(result?.success);
}

export function revalidateAfterSuccess(
  result: MutationResult,
  revalidate: () => void,
): boolean {
  if (!isSuccessfulMutation(result)) return false;
  revalidate();
  return true;
}

