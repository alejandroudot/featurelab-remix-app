import { Pin, PinOff } from 'lucide-react';
import { Link } from 'react-router';
import type { Project } from '~/core/project/project.types';

type ProjectRowProps = {
  project: Project;
  isActive: boolean;
  isBusy: boolean;
  href: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onTogglePinned: () => void;
};

export function ProjectRow({
  project,
  isActive,
  isBusy,
  href,
  onDragStart,
  onDragEnd,
  onDrop,
  onTogglePinned,
}: ProjectRowProps) {
  return (
    <div
      draggable={!isBusy}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      className={`group flex items-center gap-1 rounded-md px-1 py-0.5 transition ${
        isActive ? 'bg-accent/50 shadow-sm' : 'hover:bg-accent/40'
      }`}
    >
      <Link to={href} className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-xs">
        <span
          className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-muted"
          aria-hidden="true"
        >
          {project.imageUrl ? (
            <img src={project.imageUrl} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <span className="text-[10px] font-semibold text-muted-foreground">
              {project.name.trim().charAt(0).toUpperCase() || 'P'}
            </span>
          )}
        </span>
        <span className="truncate">{project.name}</span>
      </Link>
      <button
        type="button"
        disabled={isBusy}
        onClick={onTogglePinned}
        className="inline-flex h-6 w-6 items-center justify-center rounded border text-muted-foreground transition hover:bg-background hover:text-foreground disabled:opacity-50"
        title={project.pinned ? 'Quitar de pinned' : 'Pin project'}
        aria-label={project.pinned ? `Quitar pin a ${project.name}` : `Pin a ${project.name}`}
      >
        {project.pinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
      </button>
    </div>
  );
}

