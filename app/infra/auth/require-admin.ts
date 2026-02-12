import { redirect } from "react-router";
import { requireUser } from "~/infra/auth/require-user";

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (user.role !== "admin") throw redirect("/tasks");
  return user;
}
