import type { Task } from '~/core/tasks/tasks.types';

type ChecklistProps = {
  checklist: Task['checklist'];
  newChecklistText: string;
  onNewChecklistTextChange: (value: string) => void;
  onAddChecklistItem: () => void;
  onToggleChecklistItem: (itemId: string) => void;
  onRemoveChecklistItem: (itemId: string) => void;
};

export function Checklist({
  checklist,
  newChecklistText,
  onNewChecklistTextChange,
  onAddChecklistItem,
  onToggleChecklistItem,
  onRemoveChecklistItem,
}: ChecklistProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium">Checklist / subtareas</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={newChecklistText}
          onChange={(event) => onNewChecklistTextChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAddChecklistItem();
            }
          }}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="Agregar subtarea..."
        />
        <button type="button" onClick={onAddChecklistItem} className="rounded border px-2 py-1 text-sm">
          Agregar
        </button>
      </div>
      {checklist.length > 0 ? (
        <ul className="space-y-1">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-2 rounded border px-2 py-1 text-sm">
              <input type="checkbox" checked={item.done} onChange={() => onToggleChecklistItem(item.id)} />
              <span className={item.done ? 'line-through opacity-70' : ''}>{item.text}</span>
              <button
                type="button"
                onClick={() => onRemoveChecklistItem(item.id)}
                className="ml-auto text-xs opacity-70 hover:opacity-100"
              >
                quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs opacity-70">Sin subtareas.</p>
      )}
    </div>
  );
}


