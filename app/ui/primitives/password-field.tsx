import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  wrapperClassName?: string;
};

export function PasswordField({
  id,
  className,
  wrapperClassName,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={wrapperClassName ?? 'relative'}>
      <input
        {...props}
        id={inputId}
        type={isVisible ? 'text' : 'password'}
        className={`password-field__input ${className ?? ''}`}
      />
      <button
        type="button"
        aria-label={isVisible ? 'Ocultar password' : 'Mostrar password'}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-accent/40 hover:text-slate-700"
      >
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
