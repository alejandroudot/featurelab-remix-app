import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import type { UserPreferences } from '~/infra/preferences/preferences-cookie';
import type { ThemeMode } from '~/infra/theme/theme-cookie';
import type { AccountActionData } from '../../types';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
import { SectionCard } from '../../shared/SectionCard';
import { applyThemeModeAndNotify } from '~/ui/theme/theme-sync';

type PreferencesSectionProps = {
  initialValues: UserPreferences & { theme: ThemeMode };
  asCard?: boolean;
};

export function PreferencesSection({ initialValues, asCard = true }: PreferencesSectionProps) {
  const fetcher = useFetcher<AccountActionData>();
  const isSubmitting = fetcher.state === 'submitting';
  const actionData = fetcher.data;
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (!actionData || !actionData.success || actionData.intent !== 'preferences') return;
    const theme = actionData.values?.theme;
    if (!theme) return;
    applyThemeModeAndNotify(theme as ThemeMode);
  }, [actionData]);

  const content = (
    <fetcher.Form method="post" className="space-y-3">
      <input type="hidden" name="intent" value="preferences-update" />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Tema
        </label>
        <input type="hidden" name="theme" value={values.theme} />
        <div className="grid grid-cols-3 gap-2">
          {(['system', 'light', 'dark'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                setValues((prev) => ({
                  ...prev,
                  theme: option,
                }))
              }
              className={`rounded border px-2 py-1 text-xs font-medium transition ${
                values.theme === option
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900'
                  : 'hover:bg-accent/40'
              }`}
            >
              {option === 'system' ? 'System' : option === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
        <ActionFeedbackText actionData={actionData} intent="preferences" fieldKey="theme" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="density" className="text-sm font-medium">
          Densidad
        </label>
        <select
          id="density"
          name="density"
          value={values.density}
          onChange={(event) => {
            const value = event.currentTarget.value as UserPreferences['density'];
            setValues((prev) => ({
              ...prev,
              density: value,
            }));
          }}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
        <ActionFeedbackText actionData={actionData} intent="preferences" fieldKey="density" />
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="defaultTasksView" className="text-sm font-medium">
            Vista default tasks
          </label>
          <select
            id="defaultTasksView"
            name="defaultTasksView"
            value={values.defaultTasksView}
            onChange={(event) => {
              const value = event.currentTarget.value as UserPreferences['defaultTasksView'];
              setValues((prev) => ({
                ...prev,
                defaultTasksView: value,
              }));
            }}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="board">Board</option>
            <option value="list">List</option>
          </select>
          <ActionFeedbackText actionData={actionData} intent="preferences" fieldKey="defaultTasksView" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="defaultTasksOrder" className="text-sm font-medium">
            Orden default tasks
          </label>
          <select
            id="defaultTasksOrder"
            name="defaultTasksOrder"
            value={values.defaultTasksOrder}
            onChange={(event) => {
              const value = event.currentTarget.value as UserPreferences['defaultTasksOrder'];
              setValues((prev) => ({
                ...prev,
                defaultTasksOrder: value,
              }));
            }}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="manual">Manual</option>
            <option value="priority">Priority</option>
          </select>
          <ActionFeedbackText actionData={actionData} intent="preferences" fieldKey="defaultTasksOrder" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="defaultTasksScope" className="text-sm font-medium">
            Scope default tasks
          </label>
          <select
            id="defaultTasksScope"
            name="defaultTasksScope"
            value={values.defaultTasksScope}
            onChange={(event) => {
              const value = event.currentTarget.value as UserPreferences['defaultTasksScope'];
              setValues((prev) => ({
                ...prev,
                defaultTasksScope: value,
              }));
            }}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="assigned">Assigned</option>
            <option value="created">Created</option>
          </select>
          <ActionFeedbackText actionData={actionData} intent="preferences" fieldKey="defaultTasksScope" />
        </div>
      </div>

      <ActionFeedbackText
        actionData={actionData}
        intent="preferences"
        showFormError
        showSuccessMessage
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar preferencias'}
      </button>
    </fetcher.Form>
  );

  if (!asCard) return content;

  return (
    <SectionCard title="Preferences" description="Tema, densidad y defaults de trabajo.">
      {content}
    </SectionCard>
  );
}
