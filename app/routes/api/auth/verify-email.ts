import { runVerifyEmailLoader } from '~/server/auth/verify-email.loader';

export async function loader({ request }: { request: Request }) {
  return runVerifyEmailLoader({ request });
}
