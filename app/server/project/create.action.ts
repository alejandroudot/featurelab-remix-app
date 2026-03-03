import { redirect } from 'react-router';
import { projectRepository } from '~/infra/project/project.repository.provider';
import { getSafeRedirectTo } from '~/server/shared/redirect';

type RunProjectCreateActionInput = {
  formData: FormData;
  userId: string;
};

export async function runProjectCreateAction({ formData, userId }: RunProjectCreateActionInput) {
  const redirectTo = getSafeRedirectTo(formData, '/');
  const name = String(formData.get('name') ?? '').trim();
  const imageUrlRaw = String(formData.get('imageUrl') ?? '').trim();

  if (name.length > 0) {
    await projectRepository.create({
      userId,
      name,
      imageUrl: imageUrlRaw.length > 0 ? imageUrlRaw : null,
    });
  }

  return redirect(redirectTo);
}
