import { redirect } from "react-router";
import { authService } from "~/infra/auth/auth.service";
import { getSessionId } from "~/infra/auth/session-cookie";

export async function requireUser(request: Request) {
  const sessionId = getSessionId(request);

  if (!sessionId) {
    throw redirect("/auth/login");
  }

  const user = await authService.getUserBySession(sessionId);

  if (!user) {
    throw redirect("/auth/login");
  }

  return user;
}

export async function getOptionalUser(request: Request) {
  const sessionId = getSessionId(request);
  if (!sessionId) return null;
  return authService.getUserBySession(sessionId);
}