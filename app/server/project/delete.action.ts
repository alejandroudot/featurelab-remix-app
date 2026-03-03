import { redirect } from 'react-router';
import { projectRepository } from '~/infra/project/project.repository.provider';
import { getSafeRedirectTo } from '~/server/shared/redirect';

type RunProjectDeleteActionInput = {
  formData: FormData;
  userId: string;
};

export async function runProjectDeleteAction({ formData, userId }: RunProjectDeleteActionInput) {
  const redirectTo = getSafeRedirectTo(formData, '/');
  const id = String(formData.get('id') ?? '').trim();

  if (id.length > 0) {
    await projectRepository.remove({
      id,
      userId,
    });
  }

  return redirect(redirectTo);
}
