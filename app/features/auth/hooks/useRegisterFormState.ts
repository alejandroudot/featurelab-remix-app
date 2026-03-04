import { useEffect, useMemo, useState } from 'react';
import {
  areEquivalentEmails,
  isValidEmailFormat,
  normalizeComparableEmail,
} from '~/core/auth/credential-utils';
import { getPasswordChecks, isPasswordPolicySatisfied } from '~/core/auth/password-policy';
import { useFieldMatchOnBlur } from '~/ui/hooks/use-field-match-on-blur';
import type { AuthActionData } from '../types';

type RegisterValuesState = {
  displayName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  phone: string;
  timezone: string;
};

export function useRegisterFormState(actionData: AuthActionData, runtimeTimezone: string) {
  const errorValues = actionData && actionData.success === false ? actionData.values : undefined;

  const [values, setValues] = useState<RegisterValuesState>({
    displayName: errorValues?.displayName ?? '',
    email: errorValues?.email ?? '',
    confirmEmail: errorValues?.confirmEmail ?? '',
    password: '',
    confirmPassword: '',
    phone: errorValues?.phone ?? '',
    timezone: errorValues?.timezone ?? runtimeTimezone,
  });

  const passwordChecks = useMemo(() => getPasswordChecks(values.password), [values.password]);

  const passwordMatch = useFieldMatchOnBlur({
    leftValue: values.password,
    rightValue: values.confirmPassword,
    message: 'Las passwords no coinciden',
  });

  const emailMatch = useFieldMatchOnBlur({
    leftValue: values.email,
    rightValue: values.confirmEmail,
    message: 'Los emails no coinciden',
    normalize: normalizeComparableEmail,
  });

  const hasAllRequiredFields =
    values.displayName.trim().length >= 2 &&
    isValidEmailFormat(values.email) &&
    isValidEmailFormat(values.confirmEmail) &&
    areEquivalentEmails(values.email, values.confirmEmail) &&
    values.password.length > 0 &&
    values.confirmPassword.length > 0 &&
    values.password === values.confirmPassword;
  const isPasswordPolicyValid = isPasswordPolicySatisfied(values.password);

  useEffect(() => {
    setValues((current) => ({
      ...current,
      displayName: errorValues?.displayName ?? '',
      email: errorValues?.email ?? '',
      confirmEmail: errorValues?.confirmEmail ?? '',
      phone: errorValues?.phone ?? '',
      timezone: errorValues?.timezone ?? runtimeTimezone,
    }));
  }, [
    errorValues?.displayName,
    errorValues?.email,
    errorValues?.confirmEmail,
    errorValues?.phone,
    errorValues?.timezone,
    runtimeTimezone,
  ]);

  function setFieldValue<Key extends keyof RegisterValuesState>(
    field: Key,
    value: RegisterValuesState[Key],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return {
    values,
    setFieldValue,
    passwordChecks,
    passwordMatch,
    emailMatch,
    isRegisterEnabled: hasAllRequiredFields && isPasswordPolicyValid,
  };
}
