import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  BarChart2,
  User,
  Menu,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  title: string;
  icon: JSX.Element;
  path: string;
}

const SidebarItem = ({ title, icon, path }: SidebarItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => navigate(path)}
        sx={{
          borderRadius: 2,
          mb: 0.5,
          pl: 2,
          background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
          '&:hover': {
            background: isActive
              ? 'rgba(37, 99, 235, 0.15)'
              : 'rgba(37, 99, 235, 0.06)',
          },
        }}
      >
        <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'primary.main' : 'text.primary',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout } = useAuth();

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
    },
    {
      title: 'Users',
      icon: <Users size={20} />,
      path: '/users',
    },
    {
      title: 'Syllabus',
      icon: <BookOpen size={20} />,
      path: '/syllabus',
    },
    {
      title: 'Batches',
      icon: <Calendar size={20} />,
      path: '/batches',
    },
    {
      title: 'Students',
      icon: <User size={20} />,
      path: '/students',
    },
    {
      title: 'Reports',
      icon: <BarChart2 size={20} />,
      path: '/reports',
    },
  ];

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <IconButton
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.35)',
                color: 'white',
                mr: 2,
              }}
              disableRipple
            >
              <BookOpen size={24} />
            </IconButton>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Brightup
            </Typography>
          </motion.div>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} edge="end">
            <Menu size={20} />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ borderColor: '#E2E8F0' }} />
      <Box sx={{ overflow: 'auto', px: 2, py: 2 }}>
        <List>
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              title={item.title}
              icon={item.icon}
              path={item.path}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ borderColor: '#E2E8F0', mb: 2 }} />
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.06)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              color: 'text.primary',
            }}
          />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              backgroundColor: 'background.paper',
              backgroundImage: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              backgroundColor: 'background.paper',
              backgroundImage: 'none',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
