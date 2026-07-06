/**
 * Formats a YYYY-MM-DD date string to a human-readable format.
 * Returns relative descriptions like 'Today', 'Tomorrow', or 'Yesterday' if appropriate.
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No due date';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Checks if a task is overdue (due date is in the past and status is not completed).
 */
export const isOverdue = (dueDate?: string, status?: string): boolean => {
  if (!dueDate || status === 'completed') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dueDate);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() < today.getTime();
};

/**
 * Gets days remaining until the due date.
 */
export const getDaysRemaining = (dueDate?: string): number => {
  if (!dueDate) return Infinity;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dueDate);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
