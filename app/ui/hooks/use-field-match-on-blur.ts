import { useMemo, useState } from 'react';

type UseFieldMatchOnBlurInput = {
  leftValue: string;
  rightValue: string;
  message: string;
  normalize?: (value: string) => string;
};

export function useFieldMatchOnBlur({
  leftValue,
  rightValue,
  message,
  normalize,
}: UseFieldMatchOnBlurInput) {
  const [touched, setTouched] = useState(false);

  const mismatchError = useMemo(() => {
    if (!touched) return null;
    if (!leftValue || !rightValue) return null;

    const normalizeValue = normalize ?? ((value: string) => value);
    return normalizeValue(leftValue) === normalizeValue(rightValue) ? null : message;
  }, [leftValue, rightValue, message, normalize, touched]);

  function markTouched() {
    setTouched(true);
  }

  return {
    mismatchError,
    markTouched,
  };
}
