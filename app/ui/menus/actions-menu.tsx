import { DropdownMenu } from "radix-ui";
import * as React from "react";

export function ActionsMenu({
  children,
}: {
	//Funcion para manejar el cierre de modal
  children: (api: { close: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="Acciones" className="border rounded px-2 py-1 text-sm">
          ⋯
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-40 min-w-45 rounded-md border bg-white p-1 shadow-lg dark:bg-zinc-950 dark:border-zinc-800"
        >
          {children({ close: () => setOpen(false) })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MenuItem({
  children,
  onSelect,
  destructive,
}: {
  children: React.ReactNode;
  onSelect?: (e: Event) => void;
  destructive?: boolean;
}) {
  return (
    <DropdownMenu.Item
      onSelect={(e) => onSelect?.(e)}
      className={[
        "cursor-pointer select-none rounded px-2 py-2 text-sm outline-none",
        "focus:bg-zinc-100 dark:focus:bg-zinc-900",
        destructive ? "text-red-600 dark:text-red-400" : "",
      ].join(" ")}
    >
      {children}
    </DropdownMenu.Item>
  );
}