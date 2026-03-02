import { useMemo, useState } from 'react';

type UseFieldMatchOnBlurInput = {
  leftValue: string;
  rightValue: string;
  message: string;
  normalize?: (value: string) => string;
};

// Hook para validar "campo A === campo B" recien despues de blur
// (casos tipicos: confirmar email o confirmar password).
export function useFieldMatchOnBlur({
  leftValue,
  rightValue,
  message,
  normalize,
}: UseFieldMatchOnBlurInput) {
  // Evita mostrar mismatch mientras el usuario todavia no salio del campo (blur).
  const [touched, setTouched] = useState(false);

  const mismatchError = useMemo(() => {
    // Sin blur previo no hay mensaje de error.
    if (!touched) return null;
    // Si falta alguno de los dos valores, no evaluamos mismatch todavia.
    if (!leftValue || !rightValue) return null;

    // Permite comparar versiones normalizadas (ej: email trim/lowercase).
    const normalizeValue = normalize ?? ((value: string) => value);
    return normalizeValue(leftValue) === normalizeValue(rightValue) ? null : message;
  }, [leftValue, rightValue, message, normalize, touched]);

  function markTouched() {
    // Se dispara desde onBlur en el campo para activar validacion.
    setTouched(true);
  }

  return {
    mismatchError,
    markTouched,
  };
}
