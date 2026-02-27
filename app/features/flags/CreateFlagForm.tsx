import { useEffect, useState } from 'react';
import { Form } from 'react-router';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
import type { FlagActionData } from './types';

export function CreateFlagForm({ actionData }: { actionData: FlagActionData }) {
  const [currentType, setCurrentType] = useState<string>(
    actionData?.values?.type ?? 'boolean',
  );

  useEffect(() => {
    setCurrentType(actionData?.values?.type ?? 'boolean');
  }, [actionData?.values?.type]);

  return (
      <section className="border rounded p-4 space-y-3 max-w-xl">
      <h2 className="font-semibold">Crear flag</h2>

      <ActionFeedbackText
        actionData={actionData}
        showFormError
        errorClassName="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm"
      />

      <Form method="post" className="space-y-3">
        <input type="hidden" name="intent" value="create" />

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="key">
            Key
          </label>
          <input
            id="key"
            name="key"
						autoFocus
            className="border rounded px-3 py-2"
            placeholder="dark-theme"
            defaultValue={actionData?.values?.key ?? ''}
          />
          <ActionFeedbackText actionData={actionData} fieldKey="key" errorClassName="text-sm text-red-600" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="description">
            Descripción
          </label>
          <input
            id="description"
            name="description"
            className="border rounded px-3 py-2"
            placeholder="Activa modo oscuro"
            defaultValue={actionData?.values?.description ?? ''}
          />
          <ActionFeedbackText
            actionData={actionData}
            fieldKey="description"
            errorClassName="text-sm text-red-600"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="type">
            Tipo de flag
          </label>
          <select
            id="type"
            name="type"
            className="border rounded px-3 py-2"
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
          >
            <option value="boolean">boolean (on/off)</option>
            <option value="percentage">percentage rollout</option>
          </select>
          <ActionFeedbackText actionData={actionData} fieldKey="type" errorClassName="text-sm text-red-600" />
        </div>

        {currentType === 'percentage' ? (
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="rolloutPercent">
              Rollout %
            </label>
            <input
              id="rolloutPercent"
              name="rolloutPercent"
              type="number"
              min={0}
              max={100}
              className="border rounded px-3 py-2"
              placeholder="ej: 20"
              defaultValue={actionData?.values?.rolloutPercent ?? ''}
            />
            <ActionFeedbackText
              actionData={actionData}
              fieldKey="rolloutPercent"
              errorClassName="text-sm text-red-600"
            />
          </div>
        ) : null}

        <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium">
          Crear
        </button>
      </Form>
    </section>
  );
}
