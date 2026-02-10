export function loader() {
  return new Response('Not Found', { status: 404 });
}

export default function NotFound() {
  return (
    <main className="container mx-auto p-6 space-y-2">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="opacity-80">Ruta no encontrada.</p>
    </main>
  );
}
