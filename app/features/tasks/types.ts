import type { TaskService } from "~/core/tasks/tasks.port";

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskActionData =
  | {
      success: false;
      fieldErrors?: Record<string, string[] | undefined>;
    }
  | undefined;

export type TaskActionResult = Response | TaskActionData;

export type RunTaskActionInput = {
  formData: FormData;
  userId: string;
  taskService: TaskService;
};
