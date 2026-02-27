import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/ui/primitives/dialog';

type HeaderNotification = {
  id: string;
  message: string;
  createdAt: string | Date;
};

type NotificationsApiResponse = {
  currentUserId?: string;
  notifications?: HeaderNotification[];
};

function isNotificationsApiResponse(value: unknown): value is NotificationsApiResponse {
  if (!value || typeof value !== 'object') return false;
  return 'notifications' in value;
}

function getLatestTimestamp(items: HeaderNotification[]) {
  return items.reduce((latest, item) => {
    const next = new Date(item.createdAt).getTime();
    return Number.isFinite(next) && next > latest ? next : latest;
  }, 0);
}

export function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('anonymous');
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [lastSeenAt, setLastSeenAt] = useState(0);

  const latestNotificationAt = getLatestTimestamp(notifications);
  const hasUnseen = notifications.length > 0 && latestNotificationAt > lastSeenAt;

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      try {
        const response = await fetch('/api/notifications', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) return;
        const payload = (await response.json()) as unknown;
        if (!isNotificationsApiResponse(payload)) return;

        if (cancelled) return;
        setCurrentUserId(payload.currentUserId ?? 'anonymous');
        setNotifications(payload.notifications ?? []);
      } catch {
        // No bloquea UI del header si falla el endpoint.
      }
    }

    void loadNotifications();
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(`fl_tasks_notifications_seen:${currentUserId}`);
    const parsed = stored ? Number(stored) : 0;
    setLastSeenAt(Number.isFinite(parsed) ? parsed : 0);
  }, [currentUserId, latestNotificationAt]);

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
            {notifications.length === 0 ? (
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
