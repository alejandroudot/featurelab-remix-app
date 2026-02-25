import { useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { TaskComment } from '~/core/tasks/tasks.types';
import type { TaskActionData } from '../../types';

type TaskDetailCommentsProps = {
  taskId: string;
  comments: TaskComment[];
  currentUserId: string;
};

export function TaskDetailComments({ taskId, comments, currentUserId }: TaskDetailCommentsProps) {
  const createFetcher = useFetcher<TaskActionData>();
  const updateFetcher = useFetcher<TaskActionData>();
  const deleteFetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const redirectTo = `${location.pathname}${location.search}`;

  const createFormActionData =
    createFetcher.data?.success === false && createFetcher.data.intent === 'comment-create'
      ? createFetcher.data
      : undefined;
  const updateFormActionData =
    updateFetcher.data?.success === false && updateFetcher.data.intent === 'comment-update'
      ? updateFetcher.data
      : undefined;
  const deleteFormActionData =
    deleteFetcher.data?.success === false && deleteFetcher.data.intent === 'comment-delete'
      ? deleteFetcher.data
      : undefined;

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Comentarios</h3>

      <createFetcher.Form method="post" className="space-y-2">
        <input type="hidden" name="intent" value="comment-create" />
        <input type="hidden" name="id" value={taskId} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <textarea
          name="commentBody"
          defaultValue={createFormActionData?.values?.commentBody ?? ''}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="Escribe un comentario..."
        />
        {createFormActionData?.fieldErrors?.commentBody?.[0] ? (
          <p className="text-xs text-red-600">{createFormActionData.fieldErrors.commentBody[0]}</p>
        ) : null}
        {createFormActionData?.formError ? (
          <p className="text-xs text-red-600">{createFormActionData.formError}</p>
        ) : null}
        <button
          type="submit"
          disabled={createFetcher.state === 'submitting'}
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {createFetcher.state === 'submitting' ? 'Comentando...' : 'Comentar'}
        </button>
      </createFetcher.Form>

      <ul className="mt-3 space-y-2">
        {comments.length === 0 ? (
          <li className="text-sm opacity-70">Sin comentarios todavia.</li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id} className="rounded border p-2 text-sm">
              <div className="font-medium">{comment.authorEmail ?? 'Usuario'}</div>
              {editingCommentId === comment.id ? (
                <updateFetcher.Form method="post" className="mt-2 space-y-2">
                  <input type="hidden" name="intent" value="comment-update" />
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <textarea
                    name="commentBody"
                    value={editingBody}
                    onChange={(event) => setEditingBody(event.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                  {updateFormActionData?.fieldErrors?.commentBody?.[0] ? (
                    <p className="text-xs text-red-600">{updateFormActionData.fieldErrors.commentBody[0]}</p>
                  ) : null}
                  {updateFormActionData?.formError ? (
                    <p className="text-xs text-red-600">{updateFormActionData.formError}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={updateFetcher.state === 'submitting'}
                      className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {updateFetcher.state === 'submitting' ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingBody('');
                      }}
                      className="rounded border px-2 py-1 text-xs font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </updateFetcher.Form>
              ) : (
                <div className="opacity-90">{comment.body}</div>
              )}
              <div className="text-xs opacity-70">
                {new Date(comment.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
              </div>
              {comment.authorUserId === currentUserId && editingCommentId !== comment.id ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingBody(comment.body);
                    }}
                    className="rounded border px-2 py-1 text-xs font-medium"
                  >
                    Editar
                  </button>
                  <deleteFetcher.Form method="post">
                    <input type="hidden" name="intent" value="comment-delete" />
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <button
                      type="submit"
                      disabled={deleteFetcher.state === 'submitting'}
                      className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deleteFetcher.state === 'submitting' ? 'Borrando...' : 'Borrar'}
                    </button>
                  </deleteFetcher.Form>
                </div>
              ) : null}
            </li>
          ))
        )}
      </ul>

      {deleteFormActionData?.formError ? (
        <p className="mt-2 text-xs text-red-600">{deleteFormActionData.formError}</p>
      ) : null}
    </div>
  );
}
