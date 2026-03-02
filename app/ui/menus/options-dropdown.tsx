import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '~/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/ui/primitives/dropdown-menu';

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownSection = {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
};

type OptionsDropdownProps = {
  triggerLabel: string;
  triggerIcon?: ReactNode;
  contentClassName?: string;
  sections: DropdownSection[];
};

export function OptionsDropdown({
  triggerLabel,
  triggerIcon,
  contentClassName = 'w-56',
  sections,
}: OptionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="shrink-0">
          {triggerIcon}
          {triggerLabel}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={contentClassName}>
        {sections.map((section, index) => (
          <div key={`${triggerLabel}-${index}`}>
            {section.label ? <DropdownMenuLabel>{section.label}</DropdownMenuLabel> : null}
            <DropdownMenuRadioGroup value={section.value} onValueChange={section.onValueChange}>
              {section.options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {index < sections.length - 1 ? <DropdownMenuSeparator /> : null}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
