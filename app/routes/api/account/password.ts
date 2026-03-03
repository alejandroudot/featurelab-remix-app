import { requireUser } from '~/infra/auth/require-user';
import { authRepository } from '~/infra/auth/auth.repository.provider';
import { handlePasswordUpdate } from '~/server/account/action/password';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return handlePasswordUpdate({ formData, userId: user.id, authRepository });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
