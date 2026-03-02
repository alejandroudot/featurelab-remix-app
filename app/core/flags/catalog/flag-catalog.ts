import type { Environment, FeatureFlagType } from '../contracts/flags.types';

export type ProductFlagKey =
  | 'tasks-board-enabled'
  | 'tasks-comments-enabled'
  | 'tasks-mentions-enabled'
  | 'tasks-attachments-enabled'
  | 'tasks-checklist-enabled'
  | 'tasks-ai-suggestions-enabled'
  | 'billing-enabled'
  | 'slack-notifications-enabled';

type ProductFlagCatalogItem = {
  key: ProductFlagKey;
  description: string;
  type: FeatureFlagType;
  rolloutPercent: number | null;
  defaultsByEnvironment: Record<Environment, boolean>;
};

export const PRODUCT_FLAG_CATALOG: readonly ProductFlagCatalogItem[] = [
  {
    key: 'tasks-board-enabled',
    description: 'Habilita la vista board tipo Jira en Tasks.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'tasks-comments-enabled',
    description: 'Habilita comentarios dentro de cada task.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'tasks-mentions-enabled',
    description: 'Habilita menciones (@usuario) en comentarios y descripcion de tasks.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'tasks-attachments-enabled',
    description: 'Habilita adjuntos (imagenes/archivos) en comentarios y descripcion de tasks.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'tasks-checklist-enabled',
    description: 'Habilita checklist/subtareas dentro de tasks.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'tasks-ai-suggestions-enabled',
    description: 'Habilita sugerencias de IA para tasks y subtareas.',
    type: 'percentage',
    rolloutPercent: 50,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'billing-enabled',
    description: 'Habilita funcionalidades de plan y billing.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
  {
    key: 'slack-notifications-enabled',
    description: 'Habilita envio de notificaciones operativas a Slack.',
    type: 'boolean',
    rolloutPercent: null,
    defaultsByEnvironment: { development: true, production: false },
  },
] as const;
