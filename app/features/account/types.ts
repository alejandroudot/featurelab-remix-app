export type AccountActionData =
  | {
      success: false;
      intent: 'profile' | 'password' | 'preferences';
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: Record<string, string>;
    }
  | {
      success: true;
      intent: 'profile' | 'password' | 'preferences';
      message: string;
      values?: Record<string, string>;
    };
