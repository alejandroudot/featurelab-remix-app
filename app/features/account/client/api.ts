import type { AccountActionData } from '../types';

type ProfilePayload = {
  displayName: string;
  phone: string;
  about: string;
};

type PasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

async function parseAccountActionResponse(
  response: Response,
  intent: 'profile' | 'password',
): Promise<AccountActionData> {
  try {
    return (await response.json()) as AccountActionData;
  } catch {
    return {
      success: false,
      intent,
      formError: 'No se pudo procesar la respuesta del servidor.',
    };
  }
}

async function postAccountAction(
  input: { url: '/api/account/profile' | '/api/account/password'; formData: FormData; intent: 'profile' | 'password' },
): Promise<AccountActionData> {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      body: input.formData,
      headers: { Accept: 'application/json' },
    });
    return parseAccountActionResponse(response, input.intent);
  } catch {
    return {
      success: false,
      intent: input.intent,
      formError: 'No se pudo conectar con el servidor.',
    };
  }
}

export async function submitProfile(payload: ProfilePayload) {
  const formData = new FormData();
  formData.set('displayName', payload.displayName);
  formData.set('phone', payload.phone);
  formData.set('about', payload.about);

  return postAccountAction({
    url: '/api/account/profile',
    formData,
    intent: 'profile',
  });
}

export async function submitPassword(payload: PasswordPayload) {
  const formData = new FormData();
  formData.set('currentPassword', payload.currentPassword);
  formData.set('newPassword', payload.newPassword);
  formData.set('confirmPassword', payload.confirmPassword);

  return postAccountAction({
    url: '/api/account/password',
    formData,
    intent: 'password',
  });
}

