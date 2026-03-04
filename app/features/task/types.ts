import type {
  TaskRepository,
} from '~/core/task/task.repository.port';
import type { NotificationService } from '~/core/notifications/notifications.port';

export type TaskAssigneeOption = { id: string; email: string };

export type ProjectViewState = {
  view: 'list' | 'board';
  order: 'manual' | 'priority';
  scope: 'all' | 'assigned' | 'created';
};

export type TaskActionData =
	| {
		success: false;
		intent?:
      | 'create'
      | 'update'
      | 'delete'
      | 'reorder-column'
      | 'comment-create'
      | 'comment-update'
      | 'comment-delete'
      | 'unknown';
		formError?: string;
		fieldErrors?: Record<string, string[] | undefined>;
		values?: {
			title?: string;
			description?: string;
      projectId?: string;
			labels?: string;
      checklist?: string;
      commentBody?: string;
      commentId?: string;
			id?: string;
			status?: string;
			priority?: string;
			dueDate?: string;
			orderIndex?: string;
			assigneeId?: string;
			orderedTaskIds?: string;
		}
	}
  | {
    success: true;
    message?: string;
  }
	| undefined;

export type TaskActionResult = Response | TaskActionData;

export type RunTaskActionInput = {
	formData: FormData;
	userId: string;
	taskRepository: TaskRepository;
	notificationService: NotificationService;
};




