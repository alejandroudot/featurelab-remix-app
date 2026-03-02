import { getCookieValue } from '~/infra/http/cookies';

const COOKIE_NAME = "fl_session";

function cookieBase() {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `Path=/; HttpOnly; SameSite=Lax;${secure}`;
}

export function setSessionCookie(headers: Headers, sessionId: string) {
  headers.append("Set-Cookie", `${COOKIE_NAME}=${sessionId}; ${cookieBase()}`);
}

export function clearSessionCookie(headers: Headers) {
  // IMPORTANTE: mismos atributos que setSessionCookie (Path/SameSite/Secure)
  // y además Expires en el pasado + Max-Age=0
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; ${cookieBase()} Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
  );
}

export function getSessionId(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return getCookieValue(cookie, COOKIE_NAME);
}
