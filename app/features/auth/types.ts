export type AuthActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: {
        displayName?: string;
        email: string;
        confirmEmail?: string;
        phone?: string;
        timezone?: string;
      };
    }
  | undefined;
