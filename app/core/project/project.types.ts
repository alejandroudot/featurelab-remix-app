export type Project = {
  id: string;
  ownerUserId: string;
  teamId: string | null;
  name: string;
  description: string | null;
  icon: string | null;
  status: 'active' | 'archived';
  pinned: boolean;
  sidebarOrder: number;
  createdAt: number;
  updatedAt: number;
  imageUrl: string | null;
};
