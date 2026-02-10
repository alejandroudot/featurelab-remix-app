import type { TaskActionData } from './types';
import { CreateTaskForm } from './CreateTaskForm';
import { TasksList } from './TasksList';

export function TasksPage({ tasks, actionData, isSubmitting }: { tasks: any[]; actionData: TaskActionData, isSubmitting: boolean }) {
	return (
		<main className="container mx-auto p-4 space-y-6">
			<header className="space-y-2">
				<h1 className="text-2xl font-semibold">Tasks</h1>
				<p className="opacity-80 text-sm">
					Aqui puedes crear tus tareas y acomodarlas.
				</p>
			</header>

			<CreateTaskForm actionData={actionData} isSubmitting={isSubmitting} />
			<TasksList tasks={tasks} />
		</main>
	);
}