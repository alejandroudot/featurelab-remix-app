import * as React from 'react';
import { Menu } from 'lucide-react';
import { Form, Link, useLocation } from 'react-router';
import { ThemeToggle } from './theme-toggle';
import type { ThemeMode } from '~/infra/theme/theme-cookie';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/ui/primitives/sheet';

type Props = {
  user: { email: string; role: 'user' | 'admin' } | null;
  theme: ThemeMode;
};

export function AppHeader({ user, theme }: Props) {
  const loc = useLocation();
  const redirectTo = loc.pathname + loc.search;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationLinks = (
    <>
      <Link to="/tasks" className="underline-offset-4 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
        Tasks
      </Link>
      <Link to="/flags" className="underline-offset-4 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
        Flags
      </Link>
    </>
  );

  const authLinks = user ? (
    <>
      {user.role === 'admin' ? <span className="rounded border px-2 py-0.5 text-xs">ADMIN</span> : null}
      <span className="opacity-80">Hola, {user.email}</span>
      <ThemeToggle theme={theme} />
      <Form method="post" action="/auth/logout">
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
    <header className="border-b">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold">
          FeatureLab
        </Link>
        <nav className="hidden md:flex items-center gap-3 text-sm">
          {navigationLinks}
          <span className="mx-2 opacity-40">|</span>
          {authLinks}
        </nav>

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
              {navigationLinks}
              <div className="h-px bg-muted-foreground/30" />
              {authLinks}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
