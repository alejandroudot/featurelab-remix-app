import { requireUser } from '~/infra/auth/require-user';
import { runProjectUpdateAction } from '~/server/project/update.action';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runProjectUpdateAction({ formData, userId: user.id });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}

