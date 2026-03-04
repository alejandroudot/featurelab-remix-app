export type AuthActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: {
        displayName?: string;
        email?: string;
        confirmEmail?: string;
        password?: string;
        confirmPassword?: string;
        phone?: string;
        timezone?: string;
      };
    }
  | {
      success: true;
      message?: string;
      redirectTo?: string;
    }
  | undefined;
