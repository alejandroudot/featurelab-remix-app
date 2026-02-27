export function labelsEqual(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((label, index) => label === right[index]);
}

export function checklistEqual(
  left: Array<{ id: string; text: string; done: boolean }>,
  right: Array<{ id: string; text: string; done: boolean }>,
) {
  if (left.length !== right.length) return false;
  return left.every(
    (item, index) =>
      item.id === right[index]?.id &&
      item.text === right[index]?.text &&
      item.done === right[index]?.done,
  );
}
