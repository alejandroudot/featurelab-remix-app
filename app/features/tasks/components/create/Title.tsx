type TitleFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function TitleField({ value, error, onChange }: TitleFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="title" className="font-medium">
        Titulo
      </label>
      <input
        id="title"
        name="title"
        className="rounded border px-3 py-2"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
