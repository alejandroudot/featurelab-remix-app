import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // App pages
  index('routes/index.tsx'),
  route('/account', 'routes/account.tsx'),
  route('/flags', 'routes/flags.tsx'),

  // Auth pages
  route('/auth/login', 'routes/auth/login.tsx'),
  route('/auth/register', 'routes/auth/register.tsx'),
  route('/auth/verify-email', 'routes/auth/verify-email.tsx'),

  // API - Auth
  route('/api/auth/login', 'routes/api/auth/login.ts'),
  route('/api/auth/register', 'routes/api/auth/register.ts'),
  route('/api/auth/logout', 'routes/api/auth/logout.ts'),
  route('/api/auth/verify-email', 'routes/api/auth/verify-email.ts'),

  // API - Account
  route('/api/account/profile', 'routes/api/account/profile.ts'),
  route('/api/account/password', 'routes/api/account/password.ts'),

  // API - Notifications
  route('/api/notifications', 'routes/api/notifications/notifications.ts'),

  // API - Projects
  route('/api/projects/create', 'routes/api/projects/create.ts'),
  route('/api/projects/delete', 'routes/api/projects/delete.ts'),

  // API - Tasks
  route('/api/tasks/create', 'routes/api/tasks/create.ts'),
  route('/api/tasks/update', 'routes/api/tasks/update.ts'),
  route('/api/tasks/delete', 'routes/api/tasks/delete.ts'),
  route('/api/tasks/reorder-column', 'routes/api/tasks/reorder-column.ts'),
  route('/api/tasks/attachments', 'routes/api/tasks/attachments.ts'),
  route('/api/tasks/images/cleanup', 'routes/api/tasks/images.cleanup.ts'),

  // API - Task comments
  route('/api/task-comments/create', 'routes/api/task-comments/create.ts'),
  route('/api/task-comments/update', 'routes/api/task-comments/update.ts'),
  route('/api/task-comments/delete', 'routes/api/task-comments/delete.ts'),

  // API - Flags
  route('/api/flags/create', 'routes/api/flags/create.ts'),
  route('/api/flags/list', 'routes/api/flags/list.ts'),
  route('/api/flags/toggle', 'routes/api/flags/toggle.ts'),
  route('/api/flags/update-state', 'routes/api/flags/update-state.ts'),
  route('/api/flags/delete', 'routes/api/flags/delete.ts'),
] satisfies RouteConfig;


