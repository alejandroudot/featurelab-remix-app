import type { TaskService } from '~/core/tasks/tasks.port';

export type TaskStatus = 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskAssigneeOption = { id: string; email: string };

export type TaskActionData =
	| {
		success: false;
		formError?: string;
		fieldErrors?: Record<string, string[] | undefined>;
		values?: { title?: string; description?: string; id?: string; status?: string; priority?: string; assigneeId?: string }
	}
	| undefined;

export type TaskActionResult = Response | TaskActionData;

export type RunTaskActionInput = {
	formData: FormData;
	userId: string;
	taskService: TaskService;
};
