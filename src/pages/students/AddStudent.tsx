import { Box } from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';

const AddStudent = () => {
  return (
    <AnimatedPage>
      <PageHeader
        title="Add Student"
        subtitle="Add a new student"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Students', to: '/students' },
          { label: 'Add Student' }
        ]}
      />
      <Box>
        {/* Add student form implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default AddStudent;