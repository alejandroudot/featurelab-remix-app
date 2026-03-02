import { Link } from 'react-router';
import type { UserRole } from '~/core/auth/auth.types';
import type { Project } from '~/core/project/project.types';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import type { ThemeMode } from '~/infra/theme/theme-cookie';

type AppShellUser = {
  email: string;
  role: UserRole;
};

export function AppShell({
  user,
  theme,
  projects,
  children,
}: {
  user: AppShellUser;
  theme: ThemeMode;
  projects: Project[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr] md:grid-rows-[65px_1fr]">
      <div className="hidden items-center justify-start border-b border-r px-6 md:flex">
        <Link to="/" className="text-lg font-semibold leading-none hover:opacity-80">
          FeatureLab
        </Link>
      </div>

      <div className="border-b md:col-start-2 md:row-start-1">
        <AppHeader user={user} theme={theme} hideBrand noBorder />
      </div>

      <div className="md:col-start-1 md:row-start-2">
        <AppSidebar userRole={user.role} projects={projects} />
      </div>

      <div className="min-w-0 md:col-start-2 md:row-start-2">{children}</div>
    </div>
  );
}
