import { runLogoutAction } from '~/server/auth/logout.action';

export async function action({ request }: { request: Request }) {
  return runLogoutAction({ request });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
