export type ProjectActionData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: {
        id?: string;
        name?: string;
        imageUrl?: string;
      };
    }
  | {
      success: true;
      message?: string;
    }
  | undefined;
