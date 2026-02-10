import { Form, Link } from "react-router";

type Props = {
  user: { email: string } | null;
};

export function AppHeader({ user }: Props) {
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

          {user ? (
            <>
              <span className="opacity-80">Hola, {user.email}</span>

              <Form method="post" action="/auth/logout">
                <button type="submit" className="border rounded px-3 py-1 text-sm">
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="border rounded px-3 py-1 text-sm">
                Login
              </Link>
              <Link to="/auth/register" className="border rounded px-3 py-1 text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
