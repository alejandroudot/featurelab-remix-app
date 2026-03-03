import { requireAdmin } from '~/infra/auth/require-admin';
import { flagRepository } from '~/infra/flags/flag.repository.provider';
import { handleDelete } from '~/server/flags/action/delete';

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);
  const formData = await request.formData();
  return handleDelete({ formData, flagRepository });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
