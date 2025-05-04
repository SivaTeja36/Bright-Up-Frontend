import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Users as UsersIcon } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <PageHeader
        title="Users"
        subtitle="Manage system users and their roles"
        action={{
          label: "Add User",
          onClick: () => navigate('/users/add'),
          icon: <UsersIcon size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users' }
        ]}
      />
      <Box>
        {/* User list implementation will go here */}
      </Box>
    </AnimatedPage>
  );
}

export default Users;