export const PASSWORD_MIN_LENGTH = 10;

type PasswordCheck = {
  label: string;
  valid: boolean;
};

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    { label: 'Minimo 10 caracteres', valid: password.length >= PASSWORD_MIN_LENGTH },
    { label: 'Al menos una mayuscula', valid: /[A-Z]/.test(password) },
    { label: 'Al menos una minuscula', valid: /[a-z]/.test(password) },
    { label: 'Al menos un numero', valid: /[0-9]/.test(password) },
    { label: 'Al menos un simbolo', valid: /[^A-Za-z0-9]/.test(password) },
    { label: 'Sin espacios', valid: /^\S*$/.test(password) },
  ];
}

export function isPasswordPolicySatisfied(password: string) {
  return getPasswordChecks(password).every((check) => check.valid);
}
