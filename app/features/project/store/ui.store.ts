import { create } from 'zustand';
import type { ProjectViewState } from '~/features/task/types';

type WorkspaceUiState = {
  activeProjectId: string | null;
  view: ProjectViewState['view'];
  order: ProjectViewState['order'];
  scope: ProjectViewState['scope'];
  searchTerm: string;
  isCreateTaskOpen: boolean;
  selectedTaskId: string | null;
  isDetailOpen: boolean;
};

type WorkspaceUiActions = {
  hydrateViewState: (input: {
    activeProjectId: string | null;
    view: ProjectViewState['view'];
    order: ProjectViewState['order'];
    scope: ProjectViewState['scope'];
  }) => void;
  setView: (value: ProjectViewState['view']) => void;
  setOrder: (value: ProjectViewState['order']) => void;
  setScope: (value: ProjectViewState['scope']) => void;
  setSearchTerm: (value: string) => void;
  setCreateTaskOpen: (open: boolean) => void;
  openTaskDetail: (taskId: string) => void;
  setDetailOpen: (open: boolean) => void;
};

const initialState: WorkspaceUiState = {
  activeProjectId: null,
  view: 'board',
  order: 'manual',
  scope: 'all',
  searchTerm: '',
  isCreateTaskOpen: false,
  selectedTaskId: null,
  isDetailOpen: false,
};

export const useWorkspaceUiStore = create<WorkspaceUiState & WorkspaceUiActions>((set) => ({
  ...initialState,
  hydrateViewState: (input) =>
    set({
      activeProjectId: input.activeProjectId,
      view: input.view,
      order: input.order,
      scope: input.scope,
    }),
  setView: (value) => set({ view: value }),
  setOrder: (value) => set({ order: value }),
  setScope: (value) => set({ scope: value }),
  setSearchTerm: (value) => set({ searchTerm: value }),
  setCreateTaskOpen: (open) => set({ isCreateTaskOpen: open }),
  openTaskDetail: (taskId) => set({ selectedTaskId: taskId, isDetailOpen: true }),
  setDetailOpen: (open) => set({ isDetailOpen: open }),
}));
