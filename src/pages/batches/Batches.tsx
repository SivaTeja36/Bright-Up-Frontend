import { Box } from '@mui/material';
import { Calendar } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';

const Batches = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <PageHeader
        title="Batches"
        subtitle="Manage student batches and schedules"
        action={{
          label: "Create Batch",
          onClick: () => navigate('/batches/create'),
          icon: <Calendar size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches' }
        ]}
      />
      <Box>
        {/* Batches list implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default Batches;