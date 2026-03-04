import { ToolbarControls } from './ToolbarControls';
import { ToolbarSearch } from './ToolbarSearch';
import { ToolbarTitle } from './ToolbarTitle';

export function Toolbar({ projectName }: { projectName: string }) {
  return (
    <header className="space-y-3">
      <ToolbarTitle projectName={projectName} />
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarSearch />
        <ToolbarControls />
      </div>
    </header>
  );
}
