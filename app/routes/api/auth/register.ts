import { runRegisterAction } from '~/server/auth/register.action';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  return runRegisterAction({ formData, requestUrl: request.url });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
