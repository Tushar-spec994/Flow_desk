import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, Plus, Trash, AlertCircle } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useToast } from '../../../context/ToastContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { TaskFilters, TaskSort, SortField, TaskStatus, TaskPriority, TaskCategory } from '../../../types/task.types';
import { sortTasks } from '../../../utils/sort';
import { TaskCard } from '../components/TaskCard';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';

export const TasksPage: React.FC = () => {
  const { tasks, deleteTask } = useTasks();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Search and Filter State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    searchQuery: '',
  });

  const [sort, setSort] = useState<TaskSort>({
    field: 'dueDate',
    order: 'asc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // Categories and values list for dropdowns
  const categories: TaskCategory[] = ['work', 'personal', 'study', 'shopping', 'health', 'other'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'completed'];

  // Memoized Filtered and Sorted Tasks
  const processedTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      // Search matches title
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
        (task.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false);
      
      // Status matches filter
      const matchesStatus = filters.status === 'all' || task.status === filters.status;

      // Priority matches filter
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

      // Category matches filter
      const matchesCategory = filters.category === 'all' || task.category === filters.category;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    // Sort tasks
    return sortTasks(result, sort.field, sort.order);
  }, [tasks, debouncedSearch, filters, sort]);

  const toggleSortOrder = () => {
    setSort((prev) => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort((prev) => ({
      ...prev,
      field: e.target.value as SortField,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
      searchQuery: '',
    });
    setSearch('');
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl border ${
              showFilters ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </Button>

          <Button
            onClick={() => navigate('/tasks/create')}
            className="flex items-center gap-1.5 py-2 px-4 shadow-sm rounded-xl font-bold"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Filter and Sorting Options (Expandable) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="p-5 border border-slate-100 dark:border-slate-805/70 bg-slate-50/30 dark:bg-slate-900/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as TaskStatus | 'all' }))}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as TaskPriority | 'all' }))}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    {priorities.map((p) => (
                      <option key={p} value={p} className="capitalize">{p}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as TaskCategory | 'all' }))}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Sorting Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-405">Sort By</label>
                  <div className="flex gap-2">
                    <select
                      value={sort.field}
                      onChange={handleSortFieldChange}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none"
                    >
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority</option>
                      <option value="createdAt">Date Created</option>
                    </select>
                    <Button
                      variant="outline"
                      onClick={toggleSortOrder}
                      className="!px-2.5 !py-1.5 border border-slate-205 dark:border-slate-805 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50"
                      title={sort.order === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                    >
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reset Filters Link */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5"
                >
                  <Trash className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Grid / Content */}
      {processedTasks.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {processedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: 'spring', duration: 0.35 }}
              >
                <TaskCard
                  task={task}
                  onEdit={(id) => navigate(`/tasks/edit/${id}`)}
                  onDelete={handleDeleteRequest}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-905 rounded-3xl p-6 shadow-xs">
          <AlertCircle className="w-10 h-10 text-slate-400 mb-4" />
          <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
            No matching tasks found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-405 mt-1 max-w-sm">
            Try adjusting your search criteria, clearing your filters, or create a brand new task to get started!
          </p>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={resetFilters} className="rounded-xl text-xs py-2 px-3.5">
              Clear Filters
            </Button>
            <Button onClick={() => navigate('/tasks/create')} className="rounded-xl text-xs py-2 px-3.5 font-bold">
              Create a Task
            </Button>
          </div>
        </div>
      )}

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
