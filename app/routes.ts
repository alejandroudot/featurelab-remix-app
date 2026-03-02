import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/tasks', 'routes/tasks.tsx'),
  route('/account', 'routes/account.tsx'),
  route('/api/notifications', 'routes/api/notifications.ts'),
  route('/api/tasks/attachments', 'routes/api/tasks.attachments.ts'),
  route('/api/tasks/images/cleanup', 'routes/api/tasks.images.cleanup.ts'),
  route('/flags', 'routes/flags.tsx'),
	route('/auth/login', 'routes/auth/login.tsx'),
	route('/auth/register', 'routes/auth/register.tsx'),
	route('/auth/verify-email', 'routes/auth/verify-email.tsx'),
	route('/auth/logout', 'routes/auth/logout.tsx'),
] satisfies RouteConfig;
