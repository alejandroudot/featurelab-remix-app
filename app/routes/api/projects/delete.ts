import { requireUser } from '~/infra/auth/require-user';
import { runProjectDeleteAction } from '~/server/project/delete.action';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runProjectDeleteAction({ formData, userId: user.id });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
