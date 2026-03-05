export type ProjectActionResponseData =
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: {
        id?: string;
        name?: string;
        imageUrl?: string;
        description?: string;
        pinned?: string;
        orderedProjectIds?: string;
      };
    }
  | {
      success: true;
      message?: string;
    };
