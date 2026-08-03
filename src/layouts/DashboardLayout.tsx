import { useState } from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';

const DashboardLayout = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - 280px)` },
          background: isDark
            ? 'linear-gradient(180deg, #0E1728 0%, #0B1220 45%, #101B31 100%)'
            : 'linear-gradient(180deg, #F6F9FE 0%, #F0F5FD 40%, #EAF3FB 100%)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <Navbar onMenuClick={handleSidebarToggle} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 4 }, maxWidth: '100%', overflowX: 'hidden' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
