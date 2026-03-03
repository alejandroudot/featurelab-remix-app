import { runLoginAction } from '~/server/auth/login.action';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const redirectTo = String(formData.get('redirectTo') ?? '').trim() || null;
  return runLoginAction({ formData, redirectTo });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
