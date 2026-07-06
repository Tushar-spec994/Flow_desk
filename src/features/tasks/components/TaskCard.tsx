import React from 'react';
import { Calendar, Edit3, Trash2, AlertTriangle, Check } from 'lucide-react';
import { Task } from '../../../types/task.types';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { formatDate, isOverdue } from '../../../utils/date';
import { useTasks } from '../../../context/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { toggleTaskStatus } = useTasks();
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Card hoverable className="relative overflow-hidden group">
      {/* Red vertical border for High Priority, Blue for Medium, Slate for Low */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          task.priority === 'high'
            ? 'bg-rose-550'
            : task.priority === 'medium'
            ? 'bg-amber-500'
            : 'bg-sky-400'
        }`}
      />

      <div className="flex gap-4">
        {/* Status Checkbox Button */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className={`flex-shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            task.status === 'completed'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-transparent'
          }`}
          aria-label={task.status === 'completed' ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {task.status === 'completed' && <Check className="w-4 h-4 stroke-[3px]" />}
        </button>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge type="category" value={task.category}>
              {task.category}
            </Badge>
            <Badge type="priority" value={task.priority}>
              {task.priority}
            </Badge>
            <Badge type="status" value={task.status}>
              {task.status}
            </Badge>
          </div>

          <h4
            className={`text-base font-bold text-slate-850 dark:text-slate-100 truncate ${
              task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              className={`mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 ${
                task.status === 'completed' ? 'text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Date and Action Section */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-400 dark:text-slate-455">
            {/* Due Date */}
            <div
              className={`flex items-center gap-1.5 font-medium ${
                overdue
                  ? 'text-rose-600 dark:text-rose-450 font-semibold'
                  : task.status === 'completed'
                  ? 'text-slate-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {overdue ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>{formatDate(task.dueDate)}</span>
              {overdue && <span className="text-[10px] uppercase font-bold tracking-wider">(Overdue)</span>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(task.id)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                title="Edit Task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
