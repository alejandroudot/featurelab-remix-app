import type { Task } from '~/core/task/task.types';

export function formatLabelsSummary(labels: Task['labels']) {
  return labels.length > 0 ? labels.map((label) => `#${label}`).join(', ') : 'None';
}

export function formatChecklistSummary(checklist: Task['checklist']) {
  return checklist.length > 0
    ? `${checklist.filter((item) => item.done).length}/${checklist.length}`
    : 'None';
}

export function formatPlainDescription(description: string) {
  return description
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatStatusLabel(status: Task['status']) {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'ready-to-go-live':
      return 'Ready to Go Live';
    case 'done':
      return 'Done';
    case 'discarded':
      return 'Discarded';
    default:
      return 'QA';
  }
}

export function formatPriorityLabel(priority: Task['priority']) {
  switch (priority) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    default:
      return 'Critical';
  }
}
