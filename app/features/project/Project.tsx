import type { Project } from '~/core/project/project.types';
import { ToolbarControls } from './components/toolbar/ToolbarControls';
import { ToolbarSearch } from './components/toolbar/ToolbarSearch';
import { ToolbarTitle } from './components/toolbar/ToolbarTitle';
import { View } from './components/view/View';
import { Modal } from '~/features/task/components/detail/Modal';

type ProjectProps = {
  project: Project;
};

export function Project({ project }: ProjectProps) {
  return (
    <main className="container mx-auto space-y-6 p-4">
      <header className="space-y-3">
        <ToolbarTitle projectName={project.name} />
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarSearch />
          <ToolbarControls />
        </div>
      </header>
      <View />
      <Modal />
    </main>
  );
}
