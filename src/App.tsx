import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { TasksPage } from './features/tasks/pages/TasksPage';
import { CreateTaskPage } from './features/tasks/pages/CreateTaskPage';
import { EditTaskPage } from './features/tasks/pages/EditTaskPage';
import { SettingsPage } from './features/settings/pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Endpoint */}
                <Route path="/login" element={<LoginPage />} />

                {/* Secure Guards Shell */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="tasks" element={<TasksPage />} />
                    <Route path="tasks/create" element={<CreateTaskPage />} />
                    <Route path="tasks/edit/:id" element={<EditTaskPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
