import type {
  NotificationService,
  TaskAssignmentNotificationInput,
} from '~/core/notifications/notification.port';

function logAssignmentDebug(input: TaskAssignmentNotificationInput) {
  if (process.env.NOTIFICATIONS_DEBUG !== '1') return;
  console.info('[notifications][task-assigned]', input);
}

export const notificationService: NotificationService = {
  async notifyTaskAssigned(input) {
    // Hook listo para Slack (o cualquier canal) sin acoplar todavía al proveedor real.
    logAssignmentDebug(input);
  },
};
