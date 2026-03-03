import { taskIntentSchema } from '~/core/task/task.schema';
import type { RunTaskActionInput, TaskActionResult } from '~/features/task/types';

export type Intent = (typeof taskIntentSchema)['enum'][keyof (typeof taskIntentSchema)['enum']];
export type TaskIntentHandler = (input: RunTaskActionInput) => Promise<TaskActionResult>;



