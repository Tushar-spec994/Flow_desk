import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  CheckCircle2,
  Activity,
  Flame,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { TaskCard } from '../../tasks/components/TaskCard';

export const DashboardPage: React.FC = () => {
  const { tasks, stats, deleteTask } = useTasks();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // High priority tasks that are not completed
  const highPriorityTasks = tasks
    .filter((task) => task.priority === 'high' && task.status !== 'completed')
    .slice(0, 3);

  // Today's tasks (due today or in progress)
  const todayTasks = tasks
    .filter((task) => {
      if (task.status === 'completed') return false;
      if (!task.dueDate) return false;
      const todayStr = new Date().toISOString().split('T')[0];
      return task.dueDate === todayStr;
    })
    .slice(0, 3);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleDeleteRequest = (id: string) => {
    setDeleteTaskId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      showToast('Task deleted successfully!', 'error');
      setDeleteTaskId(null);
    }
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <ListTodo className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />,
      bg: 'bg-indigo-50/70 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-950/20',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-650 dark:text-emerald-400" />,
      bg: 'bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-950/20',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Activity className="w-5 h-5 text-amber-650 dark:text-amber-400" />,
      bg: 'bg-amber-50/70 border-amber-100 dark:bg-amber-950/20 dark:border-amber-950/20',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: <Flame className={`w-5 h-5 ${stats.overdue > 0 ? 'text-rose-600 dark:text-rose-455 animate-pulse' : 'text-slate-400'}`} />,
      bg: stats.overdue > 0
        ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-950/30'
        : 'bg-slate-50 border-slate-25 dark:bg-slate-900/40 dark:border-slate-805',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-lg dark:border dark:border-slate-850">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, Productivity Hero!
          </h2>
          <p className="text-slate-350 text-xs md:text-sm mt-1.5 font-medium max-w-md">
            You've completed {stats.completed} of your {stats.total} total tasks. Keep pushing to hit your goals!
          </p>
        </div>
        <Button
          onClick={() => navigate('/tasks/create')}
          className="bg-white hover:bg-slate-100 text-slate-950 font-bold flex items-center gap-1.5 py-2.5 shadow-md border-0 shrink-0 text-xs md:text-sm rounded-xl"
        >
          <Plus className="w-4 h-4 text-indigo-650 stroke-[3px]" />
          Create Task
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 + 0.1 }}
          >
            <Card className={`border flex flex-col justify-between h-32 p-5 ${card.bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900/60 shadow-xs border border-slate-100/10">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-slate-850 dark:text-slate-100">
                {card.value}
              </h3>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Progress Ring */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-205">
              Goal Progress
            </h3>
            <span className="text-xs font-semibold text-slate-400">Completion</span>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            {/* SVG Progress Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                {/* Foreground indicator */}
                <motion.circle
                  className="text-indigo-600 dark:text-indigo-500"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - completionRate / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              {/* Inner details */}
              <div className="absolute text-center">
                <span className="text-3xl font-black tracking-tight text-slate-850 dark:text-slate-100">
                  {completionRate}%
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Success
                </span>
              </div>
            </div>

            <div className="flex gap-1.5 items-center mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>
                {stats.completed} out of {stats.total} items completed
              </span>
            </div>
          </div>
        </Card>

        {/* Action Lists: High Priority & Today's Agenda */}
        <div className="lg:col-span-2 space-y-6">
          {/* High Priority Tasks */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Urgent Priorities
              </h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-755 dark:text-indigo-400 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {highPriorityTasks.length > 0 ? (
              <div className="space-y-3">
                {highPriorityTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(id) => navigate(`/tasks/edit/${id}`)}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-150 dark:border-slate-805 rounded-2xl">
                <p className="text-xs text-slate-450 font-medium">
                  Zero high priority tasks pending. Nice job!
                </p>
              </div>
            )}
          </Card>

          {/* Today's Agenda */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205 flex items-center gap-2">
                Today's Agenda
              </h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-755 dark:text-indigo-400 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(id) => navigate(`/tasks/edit/${id}`)}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-150 dark:border-slate-805 rounded-2xl">
                <p className="text-xs text-slate-450 font-medium">
                  No tasks due today. Have a relaxed day!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTaskId !== null}
        onClose={() => setDeleteTaskId(null)}
        title="Confirm Task Deletion"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTaskId(null)}
              className="rounded-xl px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              className="rounded-xl px-5 text-xs font-bold"
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-550 leading-relaxed">
          Are you sure you want to permanently delete this task? This action is irreversible and the task will be removed from your local database.
        </p>
      </Modal>
    </motion.div>
  );
};
