import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Tooltip,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Bell, Sun, Moon, Menu as MenuIcon, User, SquarePen, LogOut, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserInfo } from '../../api/auth';
import { UserInfoResponse } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { HEADER_HEIGHT } from '../../layouts/layoutConstants';
import BrightupLogo from '../BrightupLogo';

interface NavbarProps {
  onMenuClick: () => void;
}

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  syllabus: 'Syllabus',
  batches: 'Batches',
  students: 'Students',
  reports: 'Reports',
};

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [{ label: 'Dashboard' }];

  const crumbs: BreadcrumbItem[] = [];
  const main = segments[0];
  const mainLabel = BREADCRUMB_LABELS[main];

  if (main && main !== 'dashboard') {
    crumbs.push({ label: 'Dashboard', to: '/dashboard' });
  }
  if (mainLabel) {
    if (segments.length === 1) {
      crumbs.push({ label: mainLabel });
    } else {
      crumbs.push({ label: mainLabel, to: `/${main}` });
      crumbs.push({ label: main === 'batches' ? `Batch #${segments[1]}` : `${mainLabel} #${segments[1]}` });
    }
  }
  return crumbs;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUserInfo(true);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoadingUserInfo(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleEditProfile = () => {
    handleProfileMenuClose();
    console.log('Edit Profile clicked');
  };

  const avatarGradient = `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.secondary.main} 100%)`;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - 280px)` },
        ml: { md: '280px' },
        backgroundColor: isDark
          ? 'rgba(11, 18, 32, 0.72)'
          : 'rgba(255, 255, 255, 0.72)',
        color: 'text.primary',
        backgroundImage: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <Toolbar sx={{ minHeight: HEADER_HEIGHT }}>
        {isMobile && (
          <>
            <IconButton color="inherit" edge="start" sx={{ mr: 0.5 }} onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
              <BrightupLogo
                iconHeight={32}
                textHeight={24}
                gap={1.25}
                color={isDark ? 'white' : 'dark'}
                sx={{ mr: 1 }}
              />
          </>
        )}

        {!isMobile && breadcrumbs.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mr: 2 }}>
            <Breadcrumbs
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  color: 'text.secondary',
                },
              }}
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.primary"
                    fontWeight={600}
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {item.label}
                  </Typography>
                ) : (
                  <Link
                    key={index}
                    component={RouterLink}
                    to={item.to || '#'}
                    variant="body2"
                    color="text.secondary"
                    underline="hover"
                    sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Theme toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton color="inherit" onClick={toggleMode}>
                <AnimatePresenceIcon isDark={isDark} />
              </IconButton>
            </Tooltip>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotificationMenuOpen}>
              <Badge
                badgeContent={3}
                sx={{
                  '& .MuiBadge-badge': {
                    background: avatarGradient,
                    color: '#FFFFFF',
                  },
                }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>
          </motion.div>

          {/* Avatar + Name + Role Section */}
          <Box
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              py: 0.5,
              px: 1.2,
              minWidth: { md: 190 },
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0px 2px 8px rgba(15, 23, 42, ${isDark ? 0.3 : 0.06})`,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, mr: 1 }} size="small">
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ width: 32, height: 32, background: avatarGradient }}>
                    <User size={16} />
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 9,
                      height: 9,
                      bgcolor: '#10B981',
                      borderRadius: '50%',
                      border: `2px solid ${theme.palette.background.paper}`,
                    }}
                  />
                </Box>
              </IconButton>
            </motion.div>

            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {loadingUserInfo ? 'Loading...' : userInfo?.name || 'Sophia Johnson'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textTransform: 'capitalize',
                      fontWeight: 500,
                    }}
                  >
                    {loadingUserInfo ? '' : userInfo?.role || 'CEO'}
                  </Typography>
                </Box>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Edit Profile">
                    <IconButton size="small" sx={{ p: 0.5 }} onClick={handleEditProfile} color="inherit">
                      <SquarePen size={16} />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </Box>
            )}
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 240,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0px 12px 40px rgba(15, 23, 42, ${isDark ? 0.5 : 0.12})`,
              overflow: 'hidden',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, background: avatarGradient }}>
            <Typography variant="body2" fontWeight={700} color="#FFFFFF">
              {userInfo?.name || 'Sophia Johnson'}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.85)">
              {userInfo?.email || userInfo?.role || 'admin@brightup.com'}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: theme.palette.divider }} />
          <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1 }}>
            <UserRound size={18} style={{ marginRight: 12, color: theme.palette.primary.main }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleEditProfile} sx={{ py: 1 }}>
            <SquarePen size={18} style={{ marginRight: 12, color: theme.palette.primary.main }} />
            Edit Profile
          </MenuItem>
          <Divider sx={{ borderColor: theme.palette.divider }} />
          <MenuItem onClick={handleLogout} sx={{ py: 1, color: '#BE123C' }}>
            <LogOut size={18} style={{ marginRight: 12 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 340,
              maxHeight: 420,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0px 12px 40px rgba(15, 23, 42, ${isDark ? 0.5 : 0.12})`,
              overflow: 'hidden',
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Typography variant="body2" fontWeight={700}>
              Notifications
            </Typography>
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  background: avatarGradient,
                  color: '#FFFFFF',
                },
              }}
            />
          </Box>
          <Divider sx={{ borderColor: theme.palette.divider }} />
          <MenuItem onClick={handleNotificationMenuClose} sx={{ py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                New student joined
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A new student has been added to Batch #123
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose} sx={{ py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Syllabus updated
              </Typography>
              <Typography variant="caption" color="text.secondary">
                React Fundamentals syllabus has been updated
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose} sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Class rescheduled
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Android Development class moved to Friday
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const AnimatePresenceIcon = ({ isDark }: { isDark: boolean }) => {
  return (
    <motion.div
      key={isDark ? 'dark' : 'light'}
      initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex' }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </motion.div>
  );
};

export default Navbar;
