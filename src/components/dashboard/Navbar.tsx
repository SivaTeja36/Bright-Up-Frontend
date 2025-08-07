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
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { Bell, Moon, Menu as MenuIcon, User, SquarePen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserInfo } from '../../api/auth';
import { UserInfoResponse } from '../../types/auth';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { logout } = (() => {
    try {
      return { logout: () => { console.log("Logout called") } };
    } catch {
      return { logout: () => console.log("Logout fallback") };
    }
  })();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUserInfo(true);
        setFetchError(null);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (error) {
        setFetchError('Failed to load user info.');
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
    console.log('Edit Profile clicked');
    // You can route to a profile edit page or open a modal here
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - 280px)` },
        ml: { md: '280px' },
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={3} color="error">
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
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              py: 0.5,
              px: 1.2,
              minWidth: 180,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, mr: 1 }} size="small">
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <User size={16} />
                  </Avatar>
                  {/* Green dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 8,
                      height: 8,
                      bgcolor: 'green',
                      borderRadius: '50%',
                      border: '2px solid white',
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
                    fontWeight={600}
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {loadingUserInfo ? 'Loading...' : userInfo?.name || 'Sophia Johnson'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize' }}
                  >
                    {loadingUserInfo ? '' : userInfo?.role || 'CEO'}
                  </Typography>
                </Box>

                {/* Edit button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Tooltip title="Edit Profile">
                  <IconButton
                    size="small"
                    sx={{ p: 0.5 }}
                    onClick={handleEditProfile}
                    color="inherit"
                  >
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
              backgroundImage: theme.palette.gradient?.dark || undefined,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
              width: 320,
              maxHeight: 400,
              backgroundImage: theme.palette.gradient?.dark || undefined,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                New student joined
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A new student has been added to Batch #123
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Syllabus updated
              </Typography>
              <Typography variant="caption" color="text.secondary">
                React Fundamentals syllabus has been updated
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
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

export default Navbar;
