import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';
import type { RunTaskActionInput } from '../../../types';

function extractMentionTokens(text: string | null | undefined): string[] {
  if (!text) return [];
  const atTokens = (text.match(/@([a-zA-Z0-9._%+-]+)/g) ?? []).map((token) =>
    token.slice(1).toLowerCase(),
  );
  return [...new Set(atTokens)];
}

async function resolveMentionedUserIds(tokens: string[]): Promise<string[]> {
  if (tokens.length === 0) return [];
  const tokenSet = new Set(tokens.map((token) => token.toLowerCase()));

  const rows = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .all();

  return rows
    .filter((row) => {
      const email = row.email.toLowerCase();
      const localPart = email.split('@')[0] ?? '';
      return tokenSet.has(email) || tokenSet.has(localPart);
    })
    .map((row) => row.id);
}

export async function createMentionActivities(input: {
  taskId: string;
  actorUserId: string;
  source: 'comment' | 'description';
  text: string | null | undefined;
  skipNotificationForUserId?: string;
  writer: Pick<RunTaskActionInput['taskRepository'], 'createActivity'>;
}) {
  const mentionTokens = extractMentionTokens(input.text);
  const mentionedUserIds = await resolveMentionedUserIds(mentionTokens);
  const usersToNotify = input.skipNotificationForUserId
    ? mentionedUserIds.filter((userId) => userId !== input.skipNotificationForUserId)
    : mentionedUserIds;

  await Promise.all(
    usersToNotify.map((targetUserId) =>
      input.writer.createActivity({
        taskId: input.taskId,
        actorUserId: input.actorUserId,
        action: 'updated',
        metadata: {
          kind: 'mention',
          source: input.source,
          targetUserId,
        },
      }),
    ),
  );
}
