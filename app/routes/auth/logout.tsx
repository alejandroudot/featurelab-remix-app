import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { authService } from "~/infra/auth/auth.service";
import { clearSessionCookie, getSessionId } from "~/infra/auth/session-cookie";

export async function action({ request }: Route.ActionArgs) {
  const sessionId = getSessionId(request);

  if (sessionId) {
    await authService.logout(sessionId);
  }

  const headers = new Headers();
  clearSessionCookie(headers);

  return redirect("/auth/login", { headers });
}
