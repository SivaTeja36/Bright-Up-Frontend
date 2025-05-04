import { Box } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import PageHeader from '../components/PageHeader';

const Reports = () => {
  return (
    <AnimatedPage>
      <PageHeader
        title="Reports"
        subtitle="View system analytics and reports"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Reports' }
        ]}
      />
      <Box>
        {/* Reports implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default Reports;