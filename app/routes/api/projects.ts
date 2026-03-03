import { redirect } from 'react-router';
import { requireUser } from '~/infra/auth/require-user';
import { projectRepository } from '~/infra/project/project.repository.provider';

function getSafeRedirectTo(formData: FormData, fallback = '/') {
  const raw = String(formData.get('redirectTo') ?? '').trim();
  return raw.startsWith('/') ? raw : fallback;
}

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '').trim();
  const redirectTo = getSafeRedirectTo(formData, '/');

  if (intent === 'project-create') {
    const name = String(formData.get('name') ?? '').trim();
    const imageUrlRaw = String(formData.get('imageUrl') ?? '').trim();
    if (name.length > 0) {
      await projectRepository.create({
        userId: user.id,
        name,
        imageUrl: imageUrlRaw.length > 0 ? imageUrlRaw : null,
      });
    }
    return redirect(redirectTo);
  }

  if (intent === 'project-delete') {
    const id = String(formData.get('id') ?? '').trim();
    if (id.length > 0) {
      await projectRepository.remove({
        id,
        userId: user.id,
      });
    }
    return redirect(redirectTo);
  }

  return Response.json({ success: false, formError: 'Intent invalido' }, { status: 400 });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
