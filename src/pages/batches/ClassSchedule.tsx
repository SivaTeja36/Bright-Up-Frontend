import { Box } from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';

const ClassSchedule = () => {
  return (
    <AnimatedPage>
      <PageHeader
        title="Class Schedule"
        subtitle="Manage batch class schedules"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches', to: '/batches' },
          { label: 'Class Schedule' }
        ]}
      />
      <Box>
        {/* Class schedule implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default ClassSchedule;