type ProjectImageProps = {
  projectName: string;
  imageUrl: string | null;
};

export function ProjectImage({ projectName, imageUrl }: ProjectImageProps) {
  return (
    <span className="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="size-full object-cover" loading="lazy" />
      ) : (
        <span className="text-sm font-semibold text-muted-foreground">
          {projectName.trim().charAt(0).toUpperCase() || 'P'}
        </span>
      )}
    </span>
  );
}
