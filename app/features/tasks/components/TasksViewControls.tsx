import type { TasksViewState } from '../server/task-view-state';
import { ToggleGroup, ToggleGroupItem } from '~/ui/primitives/toggle-group';

type TasksViewControlsProps = {
  viewState: TasksViewState;
  onSetView: (view: 'list' | 'board') => void;
  onSetOrder: (order: 'manual' | 'priority') => void;
};

export function TasksViewControls({ viewState, onSetView, onSetOrder }: TasksViewControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs opacity-70">View</span>
      <ToggleGroup
        type="single"
        value={viewState.view}
        onValueChange={(value) => {
          if (value === 'list' || value === 'board') onSetView(value);
        }}
      >
        <ToggleGroupItem value="list" aria-label="Vista lista">
          List
        </ToggleGroupItem>
        <ToggleGroupItem value="board" aria-label="Vista board">
          Board
        </ToggleGroupItem>
				</ToggleGroup>
      <ToggleGroup
        type="single"
        value={viewState.order}
        onValueChange={(value) => {
          if (value === 'manual' || value === 'priority') onSetOrder(value);
        }}
      >
        <span className="ml-2 text-xs opacity-70">Order</span>
        <ToggleGroupItem value="manual" aria-label="Vista manual">
          Manual
        </ToggleGroupItem>
        <ToggleGroupItem value="priority" aria-label="Vista priority">
          Priority
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
