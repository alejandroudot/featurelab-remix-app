import { authRepository } from '~/infra/auth/auth.repository.provider';

export type VerifyEmailLoaderData = {
  status: 'success' | 'invalid' | 'expired' | 'missing' | 'error';
  message: string;
};

export async function runVerifyEmailLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return Response.json({
      status: 'missing',
      message: 'Falta el token de verificacion.',
    } satisfies VerifyEmailLoaderData);
  }

  try {
    await authRepository.verifyEmailToken({ token });
    return Response.json({
      status: 'success',
      message: 'Tu email fue verificado correctamente.',
    } satisfies VerifyEmailLoaderData);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    if (code === 'EMAIL_TOKEN_EXPIRED') {
      return Response.json({
        status: 'expired',
        message: 'El link de verificacion expiro. Pedi uno nuevo.',
      } satisfies VerifyEmailLoaderData);
    }
    if (code === 'EMAIL_TOKEN_INVALID') {
      return Response.json({
        status: 'invalid',
        message: 'El link de verificacion no es valido o ya fue usado.',
      } satisfies VerifyEmailLoaderData);
    }
    return Response.json({
      status: 'error',
      message: 'No se pudo verificar el email. Intenta nuevamente.',
    } satisfies VerifyEmailLoaderData);
  }
}
