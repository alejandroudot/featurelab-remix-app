export function ToolbarTitle({ projectName }: { projectName: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">Projects / {projectName}</p>
      <h1 className="text-2xl font-semibold">{projectName}</h1>
    </div>
  );
}
