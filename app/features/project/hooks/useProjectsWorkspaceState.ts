import { useEffect, useReducer } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, useSubmit } from 'react-router';
import type { Project } from '~/core/project/project.types';

type State = {
  projects: Project[];
  hasProjects: boolean;
  projectName: string;
  activeProject: Project | null;
  isCreateProjectOpen: boolean;
  newProjectName: string;
  newProjectImageUrl: string | null;
  isProjectDeleteOpen: boolean;
  projectToDelete: Project | null;
};

type Action =
  | { type: 'sync'; projects: Project[]; activeProjectId: string | null }
  | { type: 'setCreateOpen'; open: boolean }
  | { type: 'setProjectNameInput'; value: string }
  | { type: 'setProjectImageInput'; value: string | null }
  | { type: 'openDelete'; project: Project }
  | { type: 'setDeleteOpen'; open: boolean }
  | { type: 'created'; projects: Project[]; activeProjectId: string | null }
  | { type: 'deleted'; projects: Project[]; activeProjectId: string | null };

function deriveProjectUi(projects: Project[], activeProjectId: string | null) {
  const hasProjects = projects.length > 0;
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? null;
  const projectName = activeProject ? activeProject.name : hasProjects ? projects[0].name : 'Sin proyecto';
  return { hasProjects, activeProject, projectName };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'sync': {
      const derived = deriveProjectUi(action.projects, action.activeProjectId);
      return { ...state, projects: action.projects, ...derived };
    }
    case 'setCreateOpen':
      return { ...state, isCreateProjectOpen: action.open };
    case 'setProjectNameInput':
      return { ...state, newProjectName: action.value };
    case 'setProjectImageInput':
      return { ...state, newProjectImageUrl: action.value };
    case 'openDelete':
      return { ...state, projectToDelete: action.project, isProjectDeleteOpen: true };
    case 'setDeleteOpen':
      return { ...state, isProjectDeleteOpen: action.open };
    case 'created': {
      const derived = deriveProjectUi(action.projects, action.activeProjectId);
      return {
        ...state,
        projects: action.projects,
        ...derived,
        isCreateProjectOpen: false,
        newProjectName: '',
        newProjectImageUrl: null,
      };
    }
    case 'deleted': {
      const derived = deriveProjectUi(action.projects, action.activeProjectId);
      return {
        ...state,
        projects: action.projects,
        ...derived,
        isProjectDeleteOpen: false,
        projectToDelete: null,
      };
    }
    default:
      return state;
  }
}

const initialState: State = {
  projects: [],
  hasProjects: false,
  projectName: 'Sin proyecto',
  activeProject: null,
  isCreateProjectOpen: false,
  newProjectName: '',
  newProjectImageUrl: null,
  isProjectDeleteOpen: false,
  projectToDelete: null,
};

export function useProjectsWorkspaceState(activeProjectId: string | null, initialProjects: Project[] = []) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    projects: initialProjects,
    ...deriveProjectUi(initialProjects, activeProjectId),
  });

  useEffect(() => {
    dispatch({
      type: 'sync',
      projects: initialProjects,
      activeProjectId,
    });
  }, [initialProjects, activeProjectId]);

  function setCreateProjectOpen(open: boolean) {
    dispatch({ type: 'setCreateOpen', open });
  }

  function setNewProjectName(value: string) {
    dispatch({ type: 'setProjectNameInput', value });
  }

  function setNewProjectImageUrl(value: string | null) {
    dispatch({ type: 'setProjectImageInput', value });
  }

  function handleProjectImageChange(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setNewProjectImageUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewProjectImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = state.newProjectName.trim();
    if (!name) return;

    const formData = new FormData();
    formData.set('intent', 'project-create');
    formData.set('name', name);
    if (state.newProjectImageUrl) {
      formData.set('imageUrl', state.newProjectImageUrl);
    }

    submit(formData, { method: 'post', action: location.pathname });
    dispatch({
      type: 'setCreateOpen',
      open: false,
    });
    dispatch({ type: 'setProjectNameInput', value: '' });
    dispatch({ type: 'setProjectImageInput', value: null });
  }

  function openProjectDeleteDialog(project: Project) {
    dispatch({ type: 'openDelete', project });
  }

  function setProjectDeleteOpen(open: boolean) {
    dispatch({ type: 'setDeleteOpen', open });
  }

  function deleteSelectedProject() {
    const target = state.projectToDelete;
    if (!target) return;

    if (activeProjectId === target.id) {
      navigate('/', { replace: true });
    }

    const formData = new FormData();
    formData.set('intent', 'project-delete');
    formData.set('id', target.id);
    submit(formData, { method: 'post', action: location.pathname });
    dispatch({ type: 'setDeleteOpen', open: false });
  }

  return {
    ...state,
    setCreateProjectOpen,
    setNewProjectName,
    setNewProjectImageUrl,
    handleProjectImageChange,
    createProject,
    openProjectDeleteDialog,
    setProjectDeleteOpen,
    deleteSelectedProject,
  };
}
