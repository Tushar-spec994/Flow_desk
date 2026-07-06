export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'work' | 'personal' | 'study' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  searchQuery: string;
}

export type SortField = 'dueDate' | 'priority' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface TaskSort {
  field: SortField;
  order: SortOrder;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  highPriority: number;
  overdue: number;
}
