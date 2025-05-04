import { useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import AddUser from './pages/users/AddUser';
import Syllabus from './pages/syllabus/Syllabus';
import CreateSyllabus from './pages/syllabus/CreateSyllabus';
import Batches from './pages/batches/Batches';
import BatchOverview from './pages/batches/BatchOverview';
import CreateBatch from './pages/batches/CreateBatch';
import ClassSchedule from './pages/batches/ClassSchedule';
import Students from './pages/students/Students';
import AddStudent from './pages/students/AddStudent';
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
            { path: '/users/add', element: <AddUser /> },
            { path: '/syllabus', element: <Syllabus /> },
            { path: '/syllabus/create', element: <CreateSyllabus /> },
            { path: '/batches', element: <Batches /> },
            { path: '/batches/:batchId', element: <BatchOverview /> }, // <-- THIS LINE CHANGED
            { path: '/batches/create', element: <CreateBatch /> },
            { path: '/batches/schedule', element: <ClassSchedule /> },
            { path: '/students', element: <Students /> },
            { path: '/students/add', element: <AddStudent /> },
            { path: '/reports', element: <Reports /> },
          ],
        },
      ],
    },
  ]);

  return routes;
}

export default App;