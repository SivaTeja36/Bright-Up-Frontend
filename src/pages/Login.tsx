import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!password.match(/[A-Z]/)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!password.match(/[a-z]/)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!password.match(/\d/)) {
      setPasswordError('Password must contain at least one digit');
      return false;
    }
    if (!password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }
    if (password.includes(' ')) {
      setPasswordError('Password should not contain spaces');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;

    try {
      setLoading(true);
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'An error occurred during login';

      if (errorMessage === 'Incorrect password' || errorMessage === 'INCORRECT_PASSWORD') {
        setError('Incorrect password. Please check your password and try again.');
      } else if (errorMessage === 'User not found' || errorMessage === 'USER_NOT_FOUND') {
        setError('User not found. Please check your email address.');
      } else {
        setError(errorMessage);
      }

      setShowToast(true);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'gradient.main',
          backgroundImage: 'linear-gradient(135deg, #0A1929 0%, #311B92 100%)',
          backgroundSize: 'cover',
          p: 2,
        }}
      >
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            maxWidth: 450,
            width: '100%',
            px: 4,
            py: 5,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00BFFF 0%, #8A2BE2 100%)',
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={32} color="white" />
              </Box>
            </motion.div>

            <Typography
              variant="h4"
              component={motion.h1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Welcome to Brightup
            </Typography>

            <Typography
              variant="body1"
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              color="text.secondary"
              align="center"
            >
              Enter your credentials to access your account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(90deg, #00BFFF 0%, #8A2BE2 100%)',
                  borderRadius: 2,
                  p: '2px',
                }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'background.paper',
                      opacity: 0.9,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Card>
      </Box>

      {/* Toast Notification moved OUTSIDE the Card */}
      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="error"
          sx={{
            width: '350px',
            backgroundColor: '#d32f2f',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              '& .MuiIconButton-root': {
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </AnimatedPage>
  );
};

export default Login;
