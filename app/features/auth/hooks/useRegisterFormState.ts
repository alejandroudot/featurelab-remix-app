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
};

export function useRegisterFormState(actionData: AuthActionData) {
  const [values, setValues] = useState<RegisterValuesState>({
    displayName: actionData?.values?.displayName ?? '',
    email: actionData?.values?.email ?? '',
    confirmEmail: actionData?.values?.confirmEmail ?? '',
    password: '',
    confirmPassword: '',
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
      displayName: actionData?.values?.displayName ?? '',
      email: actionData?.values?.email ?? '',
      confirmEmail: actionData?.values?.confirmEmail ?? '',
    }));
  }, [actionData?.values?.displayName, actionData?.values?.email, actionData?.values?.confirmEmail]);

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
