import type { ProjectViewState } from '~/features/task/types';
import { ToolbarControls } from './ToolbarControls';
import { ToolbarSearch } from './ToolbarSearch';
import { ToolbarTitle } from './ToolbarTitle';

type ToolbarProps = {
  initialViewState: ProjectViewState;
  initialActiveProjectId: string | null;
  onOpenDeleteProject: (projectId: string) => void;
  projectName: string;
};

export function Toolbar({ initialViewState, initialActiveProjectId, onOpenDeleteProject, projectName }: ToolbarProps) {
  return (
    <header className="space-y-3">
      <ToolbarTitle projectName={projectName} />
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarSearch />
        <ToolbarControls
          initialViewState={initialViewState}
          initialActiveProjectId={initialActiveProjectId}
          onOpenDeleteProject={onOpenDeleteProject}
        />
      </div>
    </header>
  );
}
