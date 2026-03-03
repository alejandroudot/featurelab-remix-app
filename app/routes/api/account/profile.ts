import { requireUser } from '~/infra/auth/require-user';
import { authRepository } from '~/infra/auth/auth.repository.provider';
import { handleProfileUpdate } from '~/server/account/action/profile';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return handleProfileUpdate({ formData, userId: user.id, authRepository });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
