import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { localStorageService } from "../services/localStorage";
import { Task, TaskStats } from "../types/task.types";
import { isOverdue } from "../utils/date";

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  resetTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Helper to generate ISO string with offset days
const getOffsetDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
};

const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Finalize FlowDesk System Architecture",
    description:
      "Review project requirements, design database schemas (local storage schemas), and finalize folder structure design.",
    status: "completed",
    priority: "high",
    category: "work",
    dueDate: getOffsetDateString(-2),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-2",
    title: "Implement Dark/Light Mode Theme Provider",
    description:
      "Create ThemeContext, hook up Tailwind class-based selector, and test dynamic CSS variable styling.",
    status: "in-progress",
    priority: "medium",
    category: "work",
    dueDate: getOffsetDateString(0), // due today
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-3",
    title: "Study Framer Motion Orchestration",
    description:
      "Read the documentation about LayoutAnimations and AnimatePresence to build smooth drag-and-drop or list transition animations.",
    status: "todo",
    priority: "high",
    category: "study",
    dueDate: getOffsetDateString(1), // due tomorrow
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-4",
    title: "Restock fresh fruits and weekly groceries",
    description:
      "Visit local organic market to pick up vegetables, berries, eggs, and almond milk.",
    status: "todo",
    priority: "low",
    category: "shopping",
    dueDate: getOffsetDateString(3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Review medical report and log blood pressure",
    description:
      "Check cholesterol levels from annual check-up report and log entries in health dashboard.",
    status: "completed",
    priority: "medium",
    category: "health",
    dueDate: getOffsetDateString(-1), // yesterday
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-6",
    title: "Finish reading Chapter 4 of Clean Architecture",
    description:
      "Take notes on Component Cohesion and Component Coupling principles.",
    status: "todo",
    priority: "medium",
    category: "study",
    dueDate: getOffsetDateString(-3), // Overdue!
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Dynamically load tasks when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const storageKey = `FlowDesk-tasks:${currentUser.username}`;
      const userTasks = localStorageService.getItem<Task[]>(
        storageKey,
        DEFAULT_TASKS,
      );
      setTasks(userTasks);

      // If they have never logged in before, seed DEFAULT_TASKS immediately into storage
      if (window.localStorage.getItem(storageKey) === null) {
        localStorageService.setItem(storageKey, DEFAULT_TASKS);
      }
    } else {
      setTasks([]);
    }
  }, [currentUser]);

  // Automatically save tasks to user-specific localStorage whenever tasks change
  useEffect(() => {
    if (currentUser && tasks.length > 0) {
      const storageKey = `FlowDesk-tasks:${currentUser.username}`;
      localStorageService.setItem(storageKey, tasks);
    }
  }, [tasks, currentUser]);

  const stats = useMemo<TaskStats>(() => {
    const initialStats: TaskStats = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      todo: 0,
      highPriority: 0,
      overdue: 0,
    };

    tasks.forEach((task) => {
      if (task.status === "completed") initialStats.completed++;
      else if (task.status === "in-progress") initialStats.inProgress++;
      else if (task.status === "todo") initialStats.todo++;

      if (task.priority === "high") initialStats.highPriority++;

      if (isOverdue(task.dueDate, task.status)) {
        initialStats.overdue++;
      }
    });

    return initialStats;
  }, [tasks]);

  const addTask = (
    newTaskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt: now,
            }
          : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== id);
      // If list becomes empty, save it directly (since the autosave hook skips saving empty arrays to prevent blank seeding overwrites)
      if (currentUser && updated.length === 0) {
        localStorageService.setItem(
          `FlowDesk-tasks:${currentUser.username}`,
          [],
        );
      }
      return updated;
    });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        let nextStatus: "todo" | "in-progress" | "completed" = "completed";
        if (task.status === "completed") {
          nextStatus = "todo";
        }

        return {
          ...task,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const resetTasks = () => {
    setTasks(DEFAULT_TASKS);
    if (currentUser) {
      localStorageService.setItem(
        `FlowDesk-tasks:${currentUser.username}`,
        DEFAULT_TASKS,
      );
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        resetTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
