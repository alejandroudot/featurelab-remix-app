import type { Project } from '~/core/project/project.types';
import type { Task } from '~/core/task/task.types';
import type { TaskAssigneeOption, ProjectViewState } from '~/features/task/types';
import { ToolbarControls } from './components/toolbar/ToolbarControls';
import { ToolbarSearch } from './components/toolbar/ToolbarSearch';
import { ToolbarTitle } from './components/toolbar/ToolbarTitle';
import { View } from './components/view/View';
import { Modal } from '~/features/task/components/detail/Modal';

type ProjectProps = {
  project: Project;
  initialState: {
    currentUserId: string;
    tasks: Task[];
    assignableUsers: TaskAssigneeOption[];
    activeProjectId: string;
    viewState: ProjectViewState;
  };
};

export function Project({ project, initialState }: ProjectProps) {
  return (
    <main className="container mx-auto space-y-6 p-4">
      <header className="space-y-3">
        <ToolbarTitle project={project} />
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarSearch />
          <ToolbarControls />
        </div>
      </header>
      <View initialState={initialState} />
      <Modal />
    </main>
  );
}
