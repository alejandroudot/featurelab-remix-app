import type { TasksViewState } from '../server/task-view-state';
import { ToggleGroup, ToggleGroupItem } from '~/ui/primitives/toggle-group';

type TasksViewControlsProps = {
  viewState: TasksViewState;
  onSetView: (view: 'list' | 'board') => void;
  onSetOrder: (order: 'manual' | 'priority') => void;
};

export function TasksViewControls({ viewState, onSetView, onSetOrder }: TasksViewControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs opacity-70">View</span>
        <ToggleGroup
          type="single"
          value={viewState.view}
          onValueChange={(value) => {
            if (value === 'list' || value === 'board') onSetView(value);
          }}
          className="w-full sm:w-auto"
        >
          <ToggleGroupItem value="board" aria-label="Vista board" className="flex-1 sm:flex-none">
            Board
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vista lista" className="flex-1 sm:flex-none">
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs opacity-70">Order</span>
        <ToggleGroup
          type="single"
          value={viewState.order}
          onValueChange={(value) => {
            if (value === 'manual' || value === 'priority') onSetOrder(value);
          }}
          className="w-full sm:w-auto"
        >
          <ToggleGroupItem value="manual" aria-label="Vista manual" className="flex-1 sm:flex-none">
            Manual
          </ToggleGroupItem>
          <ToggleGroupItem value="priority" aria-label="Vista priority" className="flex-1 sm:flex-none">
            Priority
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
