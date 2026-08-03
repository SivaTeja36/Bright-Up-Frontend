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
  useTheme,
  useMediaQuery,
  Avatar,
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
import { HEADER_HEIGHT } from '../../layouts/layoutConstants';
import BrightupLogo from '../BrightupLogo';

interface SidebarItemProps {
  title: string;
  icon: JSX.Element;
  path: string;
}

const SidebarItem = ({ title, icon, path }: SidebarItemProps) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  const activeGradient = `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 100%)`;

  return (
    <ListItem disablePadding sx={{ px: 1, mb: 0.5 }}>
      <motion.div
        style={{ width: '100%' }}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        <ListItemButton
          onClick={() => navigate(path)}
          sx={{
            borderRadius: 3,
            pl: 2,
            py: 1.1,
            background: isActive ? activeGradient : 'transparent',
            boxShadow: isActive ? `0px 6px 18px rgba(37, 99, 235, ${theme.palette.mode === 'dark' ? 0.45 : 0.35})` : 'none',
            '&:hover': {
              background: isActive
                ? activeGradient
                : theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.16)'
                  : 'rgba(37, 99, 235, 0.07)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive ? '#FFFFFF' : 'text.secondary',
              minWidth: 40,
              transition: 'color 0.2s ease',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={title}
            primaryTypographyProps={{
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#FFFFFF' : 'text.primary',
            }}
          />
        </ListItemButton>
      </motion.div>
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
  const isDark = theme.palette.mode === 'dark';

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

  const brandGradient = theme.palette.gradient?.brand || `linear-gradient(120deg, #1D4ED8 0%, #2563EB 50%, #0EA5E9 100%)`;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Brand header */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          height: HEADER_HEIGHT,
          px: 2.5,
          background: brandGradient,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: '40%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <BrightupLogo
                iconWidth={50}
                textWidth={160}
                gap={1.5}
                color="white"
              />
            </motion.div>
          </Box>
          {isMobile && (
            <IconButton onClick={onClose} edge="end" sx={{ color: '#FFFFFF' }}>
              <Menu size={20} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ overflow: 'auto', py: 2, flexGrow: 1 }}>
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            px: 3,
            mb: 1,
            color: 'text.secondary',
            fontWeight: 700,
            letterSpacing: '0.12em',
          }}
        >
          Main Menu
        </Typography>
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

      {/* Bottom section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            background: isDark
              ? 'rgba(59, 130, 246, 0.12)'
              : 'rgba(37, 99, 235, 0.06)',
            border: `1px solid rgba(37, 99, 235, ${isDark ? 0.3 : 0.15})`,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
              }}
            >
              <User size={18} />
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.primary' }}
              >
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            color: '#F43F5E',
            '&:hover': {
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#F43F5E', minWidth: 40 }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
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
              backgroundColor: theme.palette.background.paper,
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
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
              border: 'none',
              borderRight: `1px solid ${theme.palette.divider}`,
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
