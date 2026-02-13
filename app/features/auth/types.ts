export type AuthActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: { email: string };
    }
  | undefined;
