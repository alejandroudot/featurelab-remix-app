import type { UserRole } from '~/core/auth/auth.types';
import type { Project } from '~/core/project/project.types';

export type AppSidebarProps = {
  userRole: UserRole;
  projects: Project[];
};

