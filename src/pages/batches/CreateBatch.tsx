import { Box } from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';

const CreateBatch = () => {
  return (
    <AnimatedPage>
      <PageHeader
        title="Create Batch"
        subtitle="Create a new student batch"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches', to: '/batches' },
          { label: 'Create Batch' }
        ]}
      />
      <Box>
        {/* Create batch form implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default CreateBatch;