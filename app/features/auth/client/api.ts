import type { AuthActionData } from '../types';

type LoginPayload = {
  email: string;
  password: string;
  redirectTo?: string;
};

type RegisterPayload = {
  displayName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  phone: string;
  timezone: string;
};

function toInternalPath(input: string | undefined): string | undefined {
  if (!input) return undefined;
  try {
    const url = new URL(input);
    if (!url.pathname.startsWith('/')) return undefined;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}

async function parseAuthActionResponse(response: Response): Promise<AuthActionData> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as AuthActionData;
  }

  if (response.redirected) {
    return {
      success: true,
      redirectTo: toInternalPath(response.url),
    };
  }

  if (response.ok) {
    return { success: true };
  }

  return {
    success: false,
    formError: 'No se pudo procesar la respuesta del servidor.',
  };
}

async function postAuthAction(input: { url: '/api/auth/login' | '/api/auth/register'; formData: FormData }) {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      body: input.formData,
      headers: { Accept: 'application/json' },
    });
    return parseAuthActionResponse(response);
  } catch {
    return {
      success: false,
      formError: 'No se pudo conectar con el servidor.',
    } satisfies AuthActionData;
  }
}

export async function submitLogin(payload: LoginPayload) {
  const formData = new FormData();
  formData.set('email', payload.email);
  formData.set('password', payload.password);
  if (payload.redirectTo) {
    formData.set('redirectTo', payload.redirectTo);
  }

  return postAuthAction({
    url: '/api/auth/login',
    formData,
  });
}

export async function submitRegister(payload: RegisterPayload) {
  const formData = new FormData();
  formData.set('displayName', payload.displayName);
  formData.set('email', payload.email);
  formData.set('confirmEmail', payload.confirmEmail);
  formData.set('password', payload.password);
  formData.set('confirmPassword', payload.confirmPassword);
  formData.set('phone', payload.phone);
  formData.set('timezone', payload.timezone);

  return postAuthAction({
    url: '/api/auth/register',
    formData,
  });
}
