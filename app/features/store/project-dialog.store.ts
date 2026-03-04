import { create } from 'zustand';

type ProjectDialogState = {
  isCreateProjectOpen: boolean;
  isProjectDeleteOpen: boolean;
  projectToDeleteId: string | null;
};

type ProjectDialogActions = {
  setCreateProjectOpen: (open: boolean) => void;
  openCreateProjectDialog: () => void;
  setProjectDeleteOpen: (open: boolean) => void;
  openProjectDeleteDialog: (projectId: string) => void;
};

const initialState: ProjectDialogState = {
  isCreateProjectOpen: false,
  isProjectDeleteOpen: false,
  projectToDeleteId: null,
};

export const useProjectDialogStore = create<ProjectDialogState & ProjectDialogActions>((set) => ({
  ...initialState,
  setCreateProjectOpen: (open) => set({ isCreateProjectOpen: open }),
  openCreateProjectDialog: () => set({ isCreateProjectOpen: true }),
  setProjectDeleteOpen: (open) =>
    set((state) => ({
      ...state,
      isProjectDeleteOpen: open,
      projectToDeleteId: open ? state.projectToDeleteId : null,
    })),
  openProjectDeleteDialog: (projectId) =>
    set({
      isProjectDeleteOpen: true,
      projectToDeleteId: projectId,
    }),
}));
