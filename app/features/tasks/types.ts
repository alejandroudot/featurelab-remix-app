export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
	id: string;
	title: string;
	description?: string | null;
	status: TaskStatus;
	priority: TaskPriority;
};

export type TaskActionData = 
| { 
	success: false; 
	fieldErrors?: Record<string, string[]> 
	} 
| undefined;


