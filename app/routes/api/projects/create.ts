import { requireUser } from '~/infra/auth/require-user';
import { runProjectCreateAction } from '~/server/project/create.action';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runProjectCreateAction({ formData, userId: user.id });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
