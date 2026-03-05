import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { MoreHorizontal, Trash2, Upload } from 'lucide-react';
import { ActionDropdown } from '~/ui/menus/action-dropdown';

type ProjectImageUpdateProps = {
  disabled: boolean;
  hasImage: boolean;
  onSelectImage: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
};

export function ProjectImageUpdate({
  disabled,
  hasImage,
  onSelectImage,
  onRemoveImage,
}: ProjectImageUpdateProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(event) => {
          event.currentTarget.value = '';
        }}
        onChange={onSelectImage}
      />
      <ActionDropdown
        trigger={<MoreHorizontal className="size-4" />}
        triggerLabel="Acciones del proyecto"
        items={[
          {
            label: 'Cambiar imagen',
            icon: <Upload className="size-4" />,
            disabled,
            onSelect: () => setTimeout(() => imageInputRef.current?.click(), 0),
          },
          {
            label: 'Quitar imagen',
            icon: <Trash2 className="size-4" />,
            disabled: disabled || !hasImage,
            destructive: true,
            onSelect: onRemoveImage,
          },
        ]}
      />
    </>
  );
}
