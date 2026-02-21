export type HomePageProps = {
  env: {
    mode: string;
    dbProvider: string;
  };
  stats: {
    total: number;
    open: number;
    ready: number;
    byStatus: {
      todo: number;
      inProgress: number;
      qa: number;
      readyToGoLive: number;
    };
  };
  recentActivity: Array<{
    id: string;
    taskId: string;
    taskTitle: string;
    action: 'ha creado' | 'ha actualizado' | 'ha cerrado';
    actor: string;
    timestamp: string;
  }>;
  flagsSummary?: {
    environment: 'development' | 'production';
    total: number;
    enabled: number;
    switches: Array<{
      id: string;
      key: string;
      enabled: boolean;
      type: 'boolean' | 'percentage';
      rolloutPercent?: number | null;
    }>;
  };
  user: {
    role: 'user' | 'admin';
  };
};
