import { Box } from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';

const AddUser = () => {
  return (
    <AnimatedPage>
      <PageHeader
        title="Add User"
        subtitle="Create a new system user"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'Add User' }
        ]}
      />
      <Box>
        {/* Add user form implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default AddUser;