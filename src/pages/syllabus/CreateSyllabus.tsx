import { Box } from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';

const CreateSyllabus = () => {
  return (
    <AnimatedPage>
      <PageHeader
        title="Create Syllabus"
        subtitle="Create a new course syllabus"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Syllabus', to: '/syllabus' },
          { label: 'Create Syllabus' }
        ]}
      />
      <Box>
        {/* Create syllabus form implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default CreateSyllabus;