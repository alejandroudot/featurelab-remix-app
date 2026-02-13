export type HomePageProps = {
  env: {
    mode: string;
    dbProvider: string;
  };
  stats: {
    total: number;
    open: number;
    done: number;
  };
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
  user: {
    role: string;
  };
};
