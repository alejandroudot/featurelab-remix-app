import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/ui/primitives/dialog';
import { notificationsQueryOptions } from '~/features/notifications/client/query';

function getLatestTimestamp(items: Array<{ createdAt: string | Date }>) {
  return items.reduce((latest, item) => {
    const next = new Date(item.createdAt).getTime();
    return Number.isFinite(next) && next > latest ? next : latest;
  }, 0);
}

export function HeaderNotifications({ userId }: { userId: string }) {
  const isClient = typeof window !== 'undefined';
  
	const { data, isLoading } = useQuery({
    ...notificationsQueryOptions(userId),
    enabled: isClient && userId.length > 0,
  });
	
  const [open, setOpen] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState(0);
  const currentUserId = data?.currentUserId ?? userId;
  const notifications = data?.notifications ?? [];

  const latestNotificationAt = getLatestTimestamp(notifications);
  const hasUnseen = notifications.length > 0 && latestNotificationAt > lastSeenAt;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(`fl_tasks_notifications_seen:${currentUserId}`);
    const parsed = stored ? Number(stored) : 0;
    setLastSeenAt(Number.isFinite(parsed) ? parsed : 0);
  }, [currentUserId]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) return;
    if (!latestNotificationAt) return;
    setLastSeenAt(latestNotificationAt);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        `fl_tasks_notifications_seen:${currentUserId}`,
        String(latestNotificationAt),
      );
    }
  }

  return (
    <>
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded border p-2"
        aria-label="Abrir notificaciones"
        onClick={() => handleOpenChange(true)}
      >
        <Bell className="size-4" />
        {hasUnseen ? (
          <span className="absolute -right-1 -top-1 inline-flex size-2 rounded-full bg-red-500" />
        ) : null}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[70vh] overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>Notificaciones</DialogTitle>
            <DialogDescription>Actividad reciente de tareas.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto px-6 py-4 [scrollbar-gutter:stable]">
            {isLoading ? (
              <p className="text-sm opacity-70">Cargando notificaciones...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm opacity-70">No hay notificaciones nuevas.</p>
            ) : (
              notifications.map((item) => (
                <article key={item.id} className="rounded border p-2 text-sm">
                  <div>{item.message}</div>
                  <div className="text-xs opacity-70">
                    {new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
                  </div>
                </article>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
