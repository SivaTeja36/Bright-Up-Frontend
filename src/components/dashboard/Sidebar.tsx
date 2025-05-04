import { useState } from 'react';
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
  Collapse,
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
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  title: string;
  icon: JSX.Element;
  path: string;
  subItems?: { title: string; path: string }[];
  expanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

const SidebarItem = ({
  title,
  icon,
  path,
  subItems,
  expanded,
  onExpand,
  onCollapse,
}: SidebarItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
  const hasSubItems = subItems && subItems.length > 0;

  const handleClick = () => {
    if (hasSubItems) {
      if (expanded) {
        onCollapse?.();
      } else {
        onExpand?.();
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            pl: 2,
            background: isActive ? 'rgba(0, 191, 255, 0.15)' : 'transparent',
            '&:hover': {
              background: isActive
                ? 'rgba(0, 191, 255, 0.25)'
                : 'rgba(255, 255, 255, 0.05)',
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
          {hasSubItems && (expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
        </ListItemButton>
      </ListItem>

      {hasSubItems && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((subItem, index) => {
              const isSubItemActive = location.pathname === subItem.path;
              
              return (
                <ListItemButton
                  key={index}
                  onClick={() => navigate(subItem.path)}
                  sx={{
                    pl: 6,
                    py: 0.75,
                    borderRadius: 2,
                    mb: 0.5,
                    ml: 2,
                    background: isSubItemActive ? 'rgba(0, 191, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      background: isSubItemActive
                        ? 'rgba(0, 191, 255, 0.25)'
                        : 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemText
                    primary={subItem.title}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isSubItemActive ? 600 : 400,
                      color: isSubItemActive ? 'primary.main' : 'text.secondary',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
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
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleExpand = (itemTitle: string) => {
    setExpandedItem(itemTitle);
  };

  const handleCollapse = () => {
    setExpandedItem(null);
  };

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
      subItems: [
        { title: 'All Users', path: '/users' },
        { title: 'Add User', path: '/users/add' },
      ],
    },
    {
      title: 'Syllabus',
      icon: <BookOpen size={20} />,
      path: '/syllabus',
      subItems: [
        { title: 'All Syllabi', path: '/syllabus' },
        { title: 'Create Syllabus', path: '/syllabus/create' },
      ],
    },
    {
      title: 'Batches',
      icon: <Calendar size={20} />,
      path: '/batches',
      subItems: [
        { title: 'All Batches', path: '/batches' },
        { title: 'Create Batch', path: '/batches/create' },
        { title: 'Class Schedule', path: '/batches/schedule' },
      ],
    },
    {
      title: 'Students',
      icon: <User size={20} />,
      path: '/students',
      subItems: [
        { title: 'All Students', path: '/students' },
        { title: 'Add Student', path: '/students/add' },
      ],
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
                background: 'linear-gradient(135deg, #00BFFF 0%, #8A2BE2 100%)',
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
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <Box sx={{ overflow: 'auto', px: 2, py: 2 }}>
        <List>
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              title={item.title}
              icon={item.icon}
              path={item.path}
              subItems={item.subItems}
              expanded={expandedItem === item.title}
              onExpand={() => handleExpand(item.title)}
              onCollapse={handleCollapse}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
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