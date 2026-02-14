import * as React from 'react';
import { Form } from 'react-router';
import type { FlagActionData } from './types';

export function CreateFlagForm({ actionData }: { actionData: FlagActionData }) {
  const [currentType, setCurrentType] = React.useState<string>(
    actionData?.values?.type ?? 'boolean',
  );

  React.useEffect(() => {
    setCurrentType(actionData?.values?.type ?? 'boolean');
  }, [actionData?.values?.type]);

  return (
    <section className="border rounded p-4 space-y-3 max-w-xl">
      <h2 className="font-semibold">Crear flag</h2>

      {actionData?.formError ? (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
          {actionData.formError}
        </div>
      ) : null}

      <Form method="post" className="space-y-3">
        <input type="hidden" name="intent" value="create" />

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="key">
            Key
          </label>
          <input
            id="key"
            name="key"
            className="border rounded px-3 py-2"
            placeholder="dark-theme"
            defaultValue={actionData?.values?.key ?? ''}
          />
          {actionData?.fieldErrors?.key?.[0] ? (
            <p className="text-sm text-red-600">{actionData.fieldErrors.key[0]}</p>
          ) : null}
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
          {actionData?.fieldErrors?.description?.[0] ? (
            <p className="text-sm text-red-600">{actionData.fieldErrors.description[0]}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="environment">
            Environment
          </label>
          <select
            id="environment"
            name="environment"
            className="border rounded px-3 py-2"
            defaultValue={actionData?.values?.environment ?? 'development'}
          >
            <option value="development">development</option>
            <option value="production">production</option>
          </select>
          {actionData?.fieldErrors?.environment?.[0] ? (
            <p className="text-sm text-red-600">{actionData.fieldErrors.environment[0]}</p>
          ) : null}
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
          {actionData?.fieldErrors?.type?.[0] ? (
            <p className="text-sm text-red-600">{actionData.fieldErrors.type[0]}</p>
          ) : null}
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
            {actionData?.fieldErrors?.rolloutPercent?.[0] ? (
              <p className="text-sm text-red-600">{actionData.fieldErrors.rolloutPercent[0]}</p>
            ) : null}
          </div>
        ) : null}

        <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium">
          Crear
        </button>
      </Form>
    </section>
  );
}
