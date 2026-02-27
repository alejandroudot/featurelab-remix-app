import { taskIntentSchema } from '~/core/tasks/task.schema';
import type { RunTaskActionInput, TaskActionResult } from '../../../types';

export type Intent = (typeof taskIntentSchema)['enum'][keyof (typeof taskIntentSchema)['enum']];
export type TaskIntentHandler = (input: RunTaskActionInput) => Promise<TaskActionResult>;
