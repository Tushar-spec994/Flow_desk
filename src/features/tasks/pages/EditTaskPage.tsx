import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useToast } from '../../../context/ToastContext';
import { TaskForm } from '../components/TaskForm';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks, updateTask } = useTasks();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const taskToEdit = tasks.find((t) => t.id === id);

  const handleFormSubmit = (data: any) => {
    if (id) {
      updateTask(id, data);
      showToast('Task updated successfully!', 'success');
      navigate('/tasks'); // navigate back
    }
  };

  if (!taskToEdit) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-10 text-center"
      >
        <Card className="p-8 border border-rose-100 dark:border-rose-955/20">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Task Not Found
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            The task you are trying to edit could not be found. It may have been deleted.
          </p>
          <Button onClick={() => navigate('/tasks')} className="mt-6 rounded-xl text-xs py-2 px-4">
            Return to list
          </Button>
        </Card>
      </motion.div>
    );
  }

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
            Modify Task details
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-455">
            Update properties of task: <span className="font-bold text-slate-600 dark:text-slate-300">"{taskToEdit.title}"</span>.
          </p>
        </div>
      </div>

      <TaskForm
        initialData={taskToEdit}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate('/tasks')}
        submitButtonLabel="Save Changes"
      />
    </motion.div>
  );
};
