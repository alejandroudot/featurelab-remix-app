export type HeaderNotification = {
  id: string;
  message: string;
  createdAt: string | Date;
};

export type NotificationsApiResponse = {
  currentUserId?: string;
  notifications?: HeaderNotification[];
};

export async function fetchNotifications() {
  const response = await fetch('/api/notifications', {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    return {
      currentUserId: 'anonymous',
      notifications: [],
    } satisfies NotificationsApiResponse;
  }

  return (await response.json()) as NotificationsApiResponse;
}

