import { useState } from 'react';
import { Menu, UserRound } from 'lucide-react';
import { Form, Link, useLocation } from 'react-router';
import type { UserRole } from '~/core/auth/auth.types';
import { HeaderNotifications } from './header-notifications';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/ui/primitives/sheet';
import type { ThemeMode } from '~/infra/theme/theme-cookie';
import { ThemeToggle } from './theme-toggle';

type Props = {
  user: { id: string; email: string; role: UserRole } | null;
  theme?: ThemeMode;
  hideBrand?: boolean;
  noBorder?: boolean;
};

export function AppHeader({ user, theme = 'system', hideBrand = false, noBorder = false }: Props) {
  const loc = useLocation();
  const redirectTo = loc.pathname + loc.search;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAccountActive = loc.pathname === '/account';

  const mobileNavigationLinks = user ? (
    <>
      <Link to="/" className="underline-offset-4 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
        Tasks
      </Link>
      <p className="text-xs text-muted-foreground">Projects (proximamente)</p>
      {(user.role === 'manager' || user.role === 'admin') ? (
        <p className="text-xs text-muted-foreground">Teams (proximamente)</p>
      ) : null}
      {user.role === 'admin' ? (
        <Link to="/flags" className="underline-offset-4 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
          Flags
        </Link>
      ) : null}
      <Link to="/account" className="underline-offset-4 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
        Account
      </Link>
    </>
  ) : null;

  const authLinks = user ? (
    <>
      {user.role === 'admin' ? <span className="rounded border px-2 py-0.5 text-xs">ADMIN</span> : null}
      {user.role === 'manager' ? <span className="rounded border px-2 py-0.5 text-xs">MANAGER</span> : null}
      <ThemeToggle theme={theme} />
      <Link
        to="/account"
        className={`inline-flex items-center gap-2 rounded border px-3 py-1 text-sm font-medium transition ${
          isAccountActive
            ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
            : 'bg-background hover:bg-muted'
        }`}
      >
        <UserRound className="size-4" />
        Account
      </Link>
      <span className="opacity-80">Hola, {user.email}</span>
      <HeaderNotifications userId={user.id} />
      <Form method="post" action="/api/auth/logout">
        <button type="submit" className="border rounded px-3 py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
          Logout
        </button>
      </Form>
    </>
  ) : (
    <>
      <Link
        to={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        className="border rounded px-3 py-1 text-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Login
      </Link>
      <Link
        to={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`}
        className="border rounded px-3 py-1 text-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <header className={noBorder ? undefined : 'border-b'}>
      <div className="flex h-16.25 items-center justify-between gap-4 px-4">
        {!hideBrand ? (
          <Link to="/" className="font-semibold">
            FeatureLab
          </Link>
        ) : (
          <span />
        )}
        <nav className="hidden md:flex items-center gap-3 text-sm">{authLinks}</nav>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button type="button" className="inline-flex md:hidden items-center justify-center rounded border p-2">
              <Menu className="size-4" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="md:hidden">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 px-4 pb-4 text-sm">
              {mobileNavigationLinks}
              <div className="h-px bg-muted-foreground/30" />
              {authLinks}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
