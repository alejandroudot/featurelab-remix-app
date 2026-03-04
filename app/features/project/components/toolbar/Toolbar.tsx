import type { ProjectViewState } from '~/features/task/types';
import { ToolbarControls } from './ToolbarControls';
import { ToolbarSearch } from './ToolbarSearch';
import { ToolbarTitle } from './ToolbarTitle';
import type { Project } from '~/core/project/project.types';

type ToolbarProps = {
  initialProjects: Project[];
  initialViewState: ProjectViewState;
  initialActiveProjectId: string | null;
};

export function Toolbar({ initialProjects, initialViewState, initialActiveProjectId }: ToolbarProps) {
  return (
    <header className="space-y-3">
      <ToolbarTitle initialProjects={initialProjects} initialActiveProjectId={initialActiveProjectId} />
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarSearch />
        <ToolbarControls initialViewState={initialViewState} initialActiveProjectId={initialActiveProjectId} />
      </div>
    </header>
  );
}
