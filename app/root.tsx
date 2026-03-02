import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { getOptionalUser } from '~/infra/auth/require-user';
import { getThemeFromRequest } from '~/infra/theme/theme-cookie';
import { getUserPreferencesFromRequest } from '~/infra/preferences/preferences-cookie';
import { AppHeader } from './ui/layout/app-header';
import { AppShell } from './ui/layout/app-shell';
import { Toaster } from './ui/primitives/sonner';
import { projectRepository } from './infra/project/project.repository.provider';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'FeatureLab – Tasks & Feature Flags' },
    {
      name: 'description',
      content: 'Dashboard fullstack para gestionar tasks y feature flags.',
    },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // auth (optional)
  const user = await getOptionalUser(request);
  const theme = getThemeFromRequest(request);
  const preferences = getUserPreferencesFromRequest(request);
  const projects = user ? await projectRepository.listByUser(user.id) : [];

  return { user, theme, density: preferences.density, projects };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const user = data?.user ?? null;
  const theme = data?.theme ?? 'system';
  const density = data?.density ?? 'comfortable';
  const projects = data?.projects ?? [];
  const isDark = theme === 'dark';
  const colorScheme = isDark ? 'dark' : 'light';
  const shouldRenderAppShell = Boolean(user) && !location.pathname.startsWith('/auth');

  return (
    <html lang="en" className={isDark ? 'dark' : undefined} style={{ colorScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body data-density={density}>
        {shouldRenderAppShell && user ? (
          <AppShell user={user} theme={theme} projects={projects}>
            {children}
          </AppShell>
        ) : (
          <>
            <AppHeader user={user} theme={theme} />
            {children}
          </>
        )}
        <Toaster position="bottom-right" richColors theme={isDark ? 'dark' : 'light'} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
