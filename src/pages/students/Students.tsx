import { Box } from '@mui/material';
import { User } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';

const Students = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <PageHeader
        title="Students"
        subtitle="Manage student information and enrollments"
        action={{
          label: "Add Student",
          onClick: () => navigate('/students/add'),
          icon: <User size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Students' }
        ]}
      />
      <Box>
        {/* Students list implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default Students;