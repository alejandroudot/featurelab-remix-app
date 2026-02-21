import type { TasksViewState } from '../server/task-view-state';

type TasksViewControlsProps = {
  viewState: TasksViewState;
  onSetView: (view: 'list' | 'board') => void;
  onSetOrder: (order: 'manual' | 'priority') => void;
};

export function TasksViewControls({ viewState, onSetView, onSetOrder }: TasksViewControlsProps) {
  const toggleClass = (isActive: boolean) =>
    isActive
      ? 'rounded border bg-slate-900 px-3 py-1 text-xs font-medium text-white'
      : 'rounded border px-3 py-1 text-xs font-medium';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs opacity-70">View</span>
      <button
        type="button"
        onClick={() => onSetView('list')}
        className={toggleClass(viewState.view === 'list')}
      >
        List
      </button>
      <button
        type="button"
        onClick={() => onSetView('board')}
        className={toggleClass(viewState.view === 'board')}
      >
        Board
      </button>

      <span className="ml-2 text-xs opacity-70">Order</span>
      <button
        type="button"
        onClick={() => onSetOrder('manual')}
        className={toggleClass(viewState.order === 'manual')}
      >
        Manual
      </button>
      <button
        type="button"
        onClick={() => onSetOrder('priority')}
        className={toggleClass(viewState.order === 'priority')}
      >
        Priority
      </button>
    </div>
  );
}
