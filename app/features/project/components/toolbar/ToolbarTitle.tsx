import { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';
import type { Project } from '~/core/project/project.types';
import { useUpdateProjectMutation } from '~/features/project/client/mutation';
import { isSuccessfulMutation } from '~/lib/query/mutation-result';
import { ProjectName } from './components/ProjectName';
import { ProjectDescription } from './components/ProjectDescription';
import { ProjectImageUpdate } from './components/ProjectImageUpdate';
import { ProjectImage } from './components/ProjectImage';

export function ToolbarTitle({ project }: { project: Project }) {
  const revalidator = useRevalidator();
  const { mutateAsync: updateProject, isPending } = useUpdateProjectMutation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [nameDraft, setNameDraft] = useState(project.name);
  const [descriptionDraft, setDescriptionDraft] = useState(project.description ?? '');

  useEffect(() => {
    setNameDraft(project.name);
    setDescriptionDraft(project.description ?? '');
    setIsEditingName(false);
    setIsEditingDescription(false);
  }, [project.id, project.name, project.description]);

  async function commitNameDraft() {
    const nextName = nameDraft.trim();
    if (!nextName || nextName === project.name) {
      setNameDraft(project.name);
      setIsEditingName(false);
      return;
    }
    const result = await updateProject({
      id: project.id,
      name: nextName,
    });
    if (!isSuccessfulMutation(result)) {
      toast.error('No se pudo actualizar el nombre del proyecto.');
      return;
    }
    setIsEditingName(false);
    toast.success('Nombre actualizado.');
    revalidator.revalidate();
  }

  async function commitDescriptionDraft() {
    const nextDescription = descriptionDraft.trim();
    const currentDescription = project.description ?? '';
    if (nextDescription === currentDescription) {
      setIsEditingDescription(false);
      return;
    }

    const result = await updateProject({
      id: project.id,
      description: nextDescription || null,
    });
    if (!isSuccessfulMutation(result)) {
      toast.error('No se pudo actualizar la descripcion del proyecto.');
      return;
    }

    setIsEditingDescription(false);
    toast.success('Descripcion actualizada.');
    revalidator.revalidate();
  }

  function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      toast.error('No se selecciono ninguna imagen.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!imageUrl) {
        toast.error('No se pudo leer la imagen seleccionada.');
        return;
      }

      const result = await updateProject({
        id: project.id,
        imageUrl,
      });
      if (!isSuccessfulMutation(result)) {
        toast.error('No se pudo actualizar la imagen del proyecto.');
        return;
      }
      toast.success('Imagen actualizada.');
      revalidator.revalidate();
    };
    reader.onerror = () => {
      toast.error('Error al leer el archivo de imagen.');
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = '';
  }

  async function handleRemoveImage() {
    const result = await updateProject({
      id: project.id,
      imageUrl: null,
    });
    if (!isSuccessfulMutation(result)) {
      toast.error('No se pudo quitar la imagen del proyecto.');
      return;
    }
    toast.success('Imagen eliminada.');
    revalidator.revalidate();
  }

  return (
    <div className="space-y-1.5">
      <p className="text-sm text-muted-foreground">Projects / {project.name}</p>

      <div className="flex items-start gap-3">
        <ProjectImage projectName={project.name} imageUrl={project.imageUrl} />
        <div className="min-w-0 flex-1 space-y-1">
          <ProjectName
            isEditing={isEditingName}
            draft={nameDraft}
            projectName={project.name}
            onStartEdit={() => setIsEditingName(true)}
            onDraftChange={setNameDraft}
            onCommit={() => void commitNameDraft()}
            onCancel={() => {
              setNameDraft(project.name);
              setIsEditingName(false);
            }}
          />
        </div>
        <ProjectImageUpdate
          disabled={isPending}
          hasImage={Boolean(project.imageUrl)}
          onSelectImage={handleImageSelection}
          onRemoveImage={() => void handleRemoveImage()}
        />
      </div>

      <ProjectDescription
        isEditing={isEditingDescription}
        draft={descriptionDraft}
        currentDescription={project.description}
        onStartEdit={() => setIsEditingDescription(true)}
        onDraftChange={setDescriptionDraft}
        onCommit={() => void commitDescriptionDraft()}
        onCancel={() => {
          setDescriptionDraft(project.description ?? '');
          setIsEditingDescription(false);
        }}
      />
    </div>
  );
}
