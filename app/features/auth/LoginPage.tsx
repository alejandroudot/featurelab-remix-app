import { useState } from 'react';
import { Link } from 'react-router';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useLoginMutation } from './client/mutation';

export function LoginPage({
  infoMessage,
  redirectTo,
}: {
  infoMessage?: string;
  redirectTo?: string;
}) {
  const { data: actionData, isPending: isSubmitting, mutateAsync: submitLogin } = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const result = await submitLogin({
      email,
      password,
      redirectTo,
    });
    if (!result || !result.success) return;

    const target = result.redirectTo ?? '/';
    window.location.assign(target);
  }

  return (
    <main className="container mx-auto p-4 max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>

      {infoMessage ? (
        <p className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          {infoMessage}
        </p>
      ) : null}

      <ActionFeedbackText
        actionData={actionData}
        showFormError
        errorClassName="border rounded p-3 text-sm bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200"
      />

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="email" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="password" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-sm opacity-80">
        No tenes cuenta?{' '}
        <Link className="underline" to="/auth/register">
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}
