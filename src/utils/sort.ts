import { Task, SortField, SortOrder } from '../types/task.types';

const PRIORITY_MAP: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Sorts an array of tasks based on a field and sort order.
 */
export const sortTasks = (
  tasks: Task[],
  field: SortField,
  order: SortOrder
): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    if (field === 'dueDate') {
      if (!a.dueDate && !b.dueDate) comparison = 0;
      else if (!a.dueDate) comparison = 1; // Tasks with no due date go to the bottom
      else if (!b.dueDate) comparison = -1;
      else {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    } else if (field === 'priority') {
      const pA = PRIORITY_MAP[a.priority] || 0;
      const pB = PRIORITY_MAP[b.priority] || 0;
      comparison = pB - pA; // High priority first by default
    } else if (field === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return order === 'asc' ? comparison : -comparison;
  });
};
