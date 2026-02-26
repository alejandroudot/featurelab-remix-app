import type {
  TaskActivityCommandService,
  TaskCommentQueryService,
  TaskCommentCommandService,
  TaskQueryService,
  TaskCommandService,
} from '~/core/tasks/tasks.port';
import type { NotificationService } from '~/core/notifications/notification.port';

export type TaskStatus =
	| 'todo'
	| 'in-progress'
	| 'qa'
	| 'ready-to-go-live'
	| 'done'
	| 'discarded';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskAssigneeOption = { id: string; email: string };

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
	| undefined;

export type TaskActionResult = Response | TaskActionData;

export type RunTaskActionInput = {
	formData: FormData;
	userId: string;
	taskCommandService: TaskCommandService;
	taskQueryService: TaskQueryService;
	taskActivityCommandService: TaskActivityCommandService;
	taskCommentQueryService: TaskCommentQueryService;
	taskCommentCommandService: TaskCommentCommandService;
	notificationService: NotificationService;
};
