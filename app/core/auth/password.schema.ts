import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from './password-policy';

export const passwordPolicySchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, 'Minimo 10 caracteres')
  .regex(/[A-Z]/, 'Debe incluir al menos una mayuscula')
  .regex(/[a-z]/, 'Debe incluir al menos una minuscula')
  .regex(/[0-9]/, 'Debe incluir al menos un numero')
  .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un simbolo')
  .regex(/^\S+$/, 'No puede contener espacios');
