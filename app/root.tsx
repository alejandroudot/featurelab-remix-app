import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { getOptionalUser } from '~/infra/auth/require-user';
import { AppHeader } from './ui/layout/app-header';

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
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  // server-only
  const { flagRepository } = await import('./infra/flags/flags.service');
  const darkMode = await flagRepository.isEnabled('dark-theme', environment);

  // auth (optional)
  const user = await getOptionalUser(request);

  return { darkMode, environment, user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const darkMode = data?.darkMode ?? false;
  const user = data?.user ?? null;

  return (
    <html lang="en" className={darkMode ? 'dark' : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body>
        <AppHeader user={user} />
        {children}
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
