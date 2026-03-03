import { redirect } from 'react-router';
import { authRepository } from '~/infra/auth/auth.repository.provider';
import { clearSessionCookie, getSessionId } from '~/infra/auth/session-cookie';

export async function runLogoutAction({ request }: { request: Request }) {
  const sessionId = getSessionId(request);

  if (sessionId) {
    await authRepository.logout(sessionId);
  }

  const headers = new Headers();
  clearSessionCookie(headers);

  return redirect('/auth/login', { headers });
}
