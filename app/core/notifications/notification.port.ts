export type TaskAssignmentNotificationInput = {
  taskId: string;
  taskTitle: string;
  actorUserId: string;
  assigneeUserId: string;
};

export interface NotificationService {
  notifyTaskAssigned(input: TaskAssignmentNotificationInput): Promise<void>;
}
