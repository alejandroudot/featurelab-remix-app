import { useState } from 'react';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useCreateFlagMutation } from './client/mutation';

export function CreateFlagForm() {
  const createFlagMutation = useCreateFlagMutation();
  const actionData = createFlagMutation.data;
  const isSubmitting = createFlagMutation.isPending;
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [currentType, setCurrentType] = useState<'boolean' | 'percentage'>('boolean');
  const [rolloutPercent, setRolloutPercent] = useState('');

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const data = await createFlagMutation.mutateAsync({
      key,
      description,
      type: currentType,
      rolloutPercent,
    });
    if (!data || !data.success) return;
    setKey('');
    setDescription('');
    setCurrentType('boolean');
    setRolloutPercent('');
  }

  return (
    <section className="border rounded p-4 space-y-3 max-w-xl">
      <h2 className="font-semibold">Crear flag</h2>

      <ActionFeedbackText
        actionData={actionData}
        showFormError
        errorClassName="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm"
      />

      <form className="space-y-3" onSubmit={handleSubmit}>
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
            value={key}
            onChange={(event) => setKey(event.currentTarget.value)}
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
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
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
            onChange={(event) => setCurrentType(event.currentTarget.value as 'boolean' | 'percentage')}
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
              value={rolloutPercent}
              onChange={(event) => setRolloutPercent(event.currentTarget.value)}
            />
            <ActionFeedbackText
              actionData={actionData}
              fieldKey="rolloutPercent"
              errorClassName="text-sm text-red-600"
            />
          </div>
        ) : null}

        <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm font-medium" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </section>
  );
}
