export type Flag = {
  id: string;
  key: string;
  description: string | null;
  environment: 'development' | 'production' | string;
  enabled: boolean;
};

export type FlagsActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: { key?: string; description?: string; environment?: string };
    }
  | undefined;

