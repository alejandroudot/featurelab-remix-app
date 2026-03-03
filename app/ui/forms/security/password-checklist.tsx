type PasswordPolicyCheck = {
  label: string;
  valid: boolean;
};

type PasswordPolicyChecklistProps = {
  checks: PasswordPolicyCheck[];
  className?: string;
  itemClassName?: string;
  validClassName?: string;
  invalidClassName?: string;
};

export function PasswordChecklist({
  checks,
  className = 'space-y-1 text-xs',
  itemClassName,
  validClassName = 'text-emerald-700',
  invalidClassName = 'text-amber-700',
}: PasswordPolicyChecklistProps) {
  return (
    <ul className={className}>
      {checks.map((item) => (
        <li
          key={item.label}
          className={`${item.valid ? validClassName : invalidClassName}${itemClassName ? ` ${itemClassName}` : ''}`}
        >
          {item.valid ? 'OK' : 'Pendiente'} {item.label}
        </li>
      ))}
    </ul>
  );
}
