import { Form, Link, useLocation } from 'react-router';
import { ThemeToggle } from './theme-toggle';

type Props = {
  user: { email: string; role: 'user' | 'admin' } | null;
};

export function AppHeader({ user }: Props) {
  const loc = useLocation();
  const redirectTo = loc.pathname + loc.search;
  return (
    <header className="border-b">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold">
          FeatureLab
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/tasks" className="underline-offset-4 hover:underline">
            Tasks
          </Link>
          <Link to="/flags" className="underline-offset-4 hover:underline">
            Flags
          </Link>

          <span className="mx-2 opacity-40">|</span>
          {user?.role === 'admin' ? (
            <span className="rounded border px-2 py-0.5 text-xs">ADMIN</span>
          ) : null}

          {user ? (
            <>
              <span className="opacity-80">Hola, {user.email}</span>
              <div className="mx-0.5 h-5 w-px bg-muted-foreground/40" aria-hidden="true" />
              <ThemeToggle />
							<div className="mx-0.5 h-5 w-px bg-muted-foreground/40" aria-hidden="true" />
              <Form method="post" action="/auth/logout">
                <button type="submit" className="border rounded px-3 py-1 text-sm">
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link
                to={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                className="border rounded px-3 py-1 text-sm"
              >
                Login
              </Link>
              <Link
                to={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`}
                className="border rounded px-3 py-1 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
