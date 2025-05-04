import { Box } from '@mui/material';
import { BookOpen } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';

const Syllabus = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <PageHeader
        title="Syllabus"
        subtitle="Manage course syllabi and topics"
        action={{
          label: "Create Syllabus",
          onClick: () => navigate('/syllabus/create'),
          icon: <BookOpen size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Syllabus' }
        ]}
      />
      <Box>
        {/* Syllabus list implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default Syllabus;