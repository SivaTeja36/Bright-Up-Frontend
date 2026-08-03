import { useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import Syllabus from './pages/syllabus/Syllabus';
import Batches from './pages/batches/Batches';
import BatchOverview from './pages/batches/BatchOverview';
import Students from './pages/students/Students';
import Reports from './pages/Reports';

function App() {
  const { isAuthenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/', element: <Dashboard /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/users', element: <Users /> },
            { path: '/syllabus', element: <Syllabus /> },
            { path: '/batches', element: <Batches /> },
            { path: '/batches/:batchId', element: <BatchOverview /> },
            { path: '/students', element: <Students /> },
            { path: '/reports', element: <Reports /> },
          ],
        },
      ],
    },
  ]);

  return routes;
}

export default App;