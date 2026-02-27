type TaskNotification = {
  id: string;
  taskId: string;
  taskTitle: string;
  actorEmail: string;
  message: string;
  createdAt: Date;
};

type NotificationsProps = {
  items: TaskNotification[];
};

export function Notifications({ items }: NotificationsProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-2 rounded border p-3">
      <h2 className="text-sm font-semibold">Notificaciones</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded border p-2 text-sm">
            <div>{item.message}</div>
            <div className="text-xs opacity-70">
              {new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

