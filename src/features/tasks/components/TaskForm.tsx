import React from 'react';
import { useForm } from 'react-hook-form';
import { Task, TaskPriority, TaskCategory, TaskStatus } from '../../../types/task.types';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
}

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  submitButtonLabel: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitButtonLabel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'todo',
      priority: initialData?.priority || 'medium',
      category: initialData?.category || 'work',
      dueDate: initialData?.dueDate || '',
    },
  });

  const categories = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'study', label: 'Study' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const statuses = [
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <Card className="max-w-2xl mx-auto shadow-md border border-slate-100 dark:border-slate-805">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Title */}
        <Input
          label="Task Title *"
          placeholder="e.g. Design app homepage mockups"
          error={errors.title?.message}
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 100,
              message: 'Title must not exceed 100 characters',
            },
          })}
        />

        {/* Task Description */}
        <Input
          label="Description"
          placeholder="Describe the task details, checklist, or links..."
          multiline
          rows={4}
          error={errors.description?.message}
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must not exceed 500 characters',
            },
          })}
        />

        {/* Form Select Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <Select
            label="Category *"
            options={categories}
            error={errors.category?.message}
            {...register('category', { required: 'Category is required' })}
          />

          {/* Priority */}
          <Select
            label="Priority *"
            options={priorities}
            error={errors.priority?.message}
            {...register('priority', { required: 'Priority is required' })}
          />

          {/* Status */}
          <Select
            label="Status *"
            options={statuses}
            error={errors.status?.message}
            {...register('status', { required: 'Status is required' })}
          />

          {/* Due Date */}
          <Input
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl px-5 text-xs font-bold"
          >
            {isSubmitting ? 'Saving...' : submitButtonLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
};
