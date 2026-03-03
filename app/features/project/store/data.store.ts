import { create } from 'zustand';
import type { Project } from '~/core/project/project.types';
import type { Task, TaskActivity, TaskComment } from '~/core/task/task.types';
import type { TaskAssigneeOption } from '~/features/task/types';

type WorkspaceDataState = {
  currentUserId: string;
  projects: Project[];
  tasks: Task[];
  taskActivities: TaskActivity[];
  taskComments: TaskComment[];
  assignableUsers: TaskAssigneeOption[];
};

type WorkspaceDataActions = {
  setWorkspaceData: (payload: WorkspaceDataState) => void;
};

const initialState: WorkspaceDataState = {
  currentUserId: '',
  projects: [],
  tasks: [],
  taskActivities: [],
  taskComments: [],
  assignableUsers: [],
};

export const useWorkspaceDataStore = create<WorkspaceDataState & WorkspaceDataActions>((set) => ({
  ...initialState,
  setWorkspaceData: (payload) => set(payload),
}));
