import type { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/ui/primitives/dropdown-menu';

type ActionDropdownItem = {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onSelect: () => void;
};

type ActionDropdownProps = {
  trigger: ReactNode;
  triggerLabel: string;
  items: ActionDropdownItem[];
  align?: 'start' | 'center' | 'end';
};

export function ActionDropdown({
  trigger,
  triggerLabel,
  items,
  align = 'end',
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={triggerLabel}
        className="inline-flex size-8 items-center justify-center rounded-md border transition hover:bg-accent"
      >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onSelect={(event) => {
              event.preventDefault();
              item.onSelect();
            }}
            disabled={item.disabled}
            variant={item.destructive ? 'destructive' : 'default'}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

