import { useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import AddUser from './pages/users/AddUser';
import UserDetails from './pages/users/UserDetails'
import UpdateUser from './pages/users/UpdateUser'; // <-- Import UpdateUser here
import Syllabus from './pages/syllabus/Syllabus';
import CreateSyllabus from './pages/syllabus/CreateSyllabus';
import UpdateSyllabus from './pages/syllabus/UpdateSyllabus'
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
            { path: '/users/details/:id', element: <UserDetails /> },
            { path: '/users/update/:id', element: <UpdateUser /> }, 
            { path: '/syllabus', element: <Syllabus /> },
            { path: '/syllabus/create', element: <CreateSyllabus /> },
            { path: '/syllabus/update/:id', element: <UpdateSyllabus /> }, 
            { path: '/batches', element: <Batches /> },
            { path: '/batches/:batchId', element: <BatchOverview /> },
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
