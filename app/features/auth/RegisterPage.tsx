import { Form, Link } from 'react-router';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
import { PasswordPolicyChecklist } from '~/ui/forms/password-policy-checklist';
import { PasswordField } from '~/ui/primitives/password-field';
import { TimezoneSelect } from '~/ui/primitives/timezone-select';
import { useRegisterFormState } from './hooks/useRegisterFormState';
import type { AuthActionData } from './types';

export function RegisterPage({ actionData }: { actionData: AuthActionData }) {
  const { values, setFieldValue, passwordChecks, passwordMatch, emailMatch, isRegisterEnabled } =
    useRegisterFormState(actionData);

  function getRuntimeTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    } catch {
      return '';
    }
  }
  const timezoneDefaultValue = actionData?.values?.timezone ?? getRuntimeTimezone();

  return (
    <main className="container mx-auto p-4 max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>

      <ActionFeedbackText
        actionData={actionData}
        showFormError
        errorClassName="border rounded p-3 text-sm bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200"
      />

      <Form method="post" className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="displayName">
            Nombre visible
          </label>
          <input
            id="displayName"
            name="displayName"
            value={values.displayName}
            onChange={(event) => setFieldValue('displayName', event.currentTarget.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="name"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="displayName" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={values.email}
            onChange={(event) => setFieldValue('email', event.currentTarget.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
            onBlur={emailMatch.markTouched}
          />
          <ActionFeedbackText actionData={actionData} fieldKey="email" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="confirmEmail">
            Confirmar email
          </label>
          <input
            id="confirmEmail"
            name="confirmEmail"
            value={values.confirmEmail}
            onChange={(event) => setFieldValue('confirmEmail', event.currentTarget.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="email"
            onBlur={emailMatch.markTouched}
          />
          <ActionFeedbackText
            actionData={actionData}
            fieldKey="confirmEmail"
            fallbackError={emailMatch.mismatchError}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <PasswordField
            id="password"
            name="password"
            value={values.password}
            onChange={(event) => setFieldValue('password', event.currentTarget.value)}
            className="w-full border rounded px-3 py-2 pr-10"
            autoComplete="new-password"
            onBlur={passwordMatch.markTouched}
          />
          <ActionFeedbackText actionData={actionData} fieldKey="password" />
          <PasswordPolicyChecklist checks={passwordChecks} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="confirmPassword">
            Confirmar password
          </label>
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={(event) => setFieldValue('confirmPassword', event.currentTarget.value)}
            className="w-full border rounded px-3 py-2 pr-10"
            autoComplete="new-password"
            onBlur={passwordMatch.markTouched}
          />
          <ActionFeedbackText
            actionData={actionData}
            fieldKey="confirmPassword"
            fallbackError={passwordMatch.mismatchError}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="phone">
            Telefono (opcional)
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={actionData?.values?.phone ?? ''}
            className="w-full border rounded px-3 py-2"
            autoComplete="tel"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="phone" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="timezone">
            Timezone (opcional)
          </label>
          <TimezoneSelect
            id="timezone"
            name="timezone"
            defaultValue={timezoneDefaultValue}
            className="w-full border rounded px-3 py-2"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="timezone" />
        </div>

        <button
          type="submit"
          disabled={!isRegisterEnabled}
          className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          Registrarme
        </button>
      </Form>

      <p className="text-sm opacity-80">
        Ya tenes cuenta?{' '}
        <Link className="underline" to="/auth/login">
          Entrar
        </Link>
      </p>
    </main>
  );
}
