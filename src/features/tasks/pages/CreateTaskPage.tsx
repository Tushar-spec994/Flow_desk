import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useToast } from '../../../context/ToastContext';
import { TaskForm } from '../components/TaskForm';
import { Button } from '../../../components/ui/Button';

export const CreateTaskPage: React.FC = () => {
  const { addTask } = useTasks();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = (data: any) => {
    addTask(data);
    showToast('Task created successfully!', 'success');
    navigate('/tasks'); // navigate to all tasks list
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/tasks')}
          className="!p-2 border border-slate-205 dark:border-slate-805 bg-white dark:bg-slate-900 rounded-xl"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </Button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100">
            Create a New Task
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-455">
            Add task details to plan your schedule.
          </p>
        </div>
      </div>

      <TaskForm
        onSubmit={handleFormSubmit}
        onCancel={() => navigate('/tasks')}
        submitButtonLabel="Create Task"
      />
    </motion.div>
  );
};
