import { redirect } from "react-router";
import { authRepository } from "~/infra/auth/auth.repository.provider";
import { getSessionId } from "~/infra/auth/session-cookie";

export async function requireUser(request: Request) {
  const sessionId = getSessionId(request);

  const url = new URL(request.url);
  const redirectTo = url.pathname + url.search;

  if (!sessionId) {
    throw redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const user = await authRepository.getUserBySession(sessionId);

  if (!user) {
    throw redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return user;
}

export async function getOptionalUser(request: Request) {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;
  return authRepository.getUserBySession(sessionId);
}