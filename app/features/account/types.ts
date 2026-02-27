export type AccountActionData =
  | {
      success: false;
      intent: 'profile' | 'password';
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: Record<string, string>;
    }
  | {
      success: true;
      intent: 'profile' | 'password';
      message: string;
    };
