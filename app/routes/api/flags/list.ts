import { requireAdmin } from '~/infra/auth/require-admin';
import { flagRepository } from '~/infra/flags/flag.repository.provider';
import { runFlagLoader } from '~/server/flags/loader';

export async function loader({ request }: { request: Request }) {
  await requireAdmin(request);
  return Response.json(await runFlagLoader({ flagRepository }));
}

export async function action() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}

