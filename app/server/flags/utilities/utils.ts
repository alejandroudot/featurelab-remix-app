// Extrae valores del form de create para poder repintar la UI ante errores.
export function getCreateFlagFormValues(formData: FormData) {
  return {
    key: String(formData.get('key') ?? ''),
    description: String(formData.get('description') ?? ''),
    type: String(formData.get('type') ?? 'boolean'),
    rolloutPercent: String(formData.get('rolloutPercent') ?? ''),
  };
}
