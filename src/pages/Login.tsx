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
  Alert,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import BrightupLogo from '../components/BrightupLogo';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { login } = useAuth();
  const [email, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to login. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const brandFeatures = [
    { icon: <TrendingUp size={18} />, label: 'Track student growth & batches' },
    { icon: <ShieldCheck size={18} />, label: 'Secure role-based access' },
    { icon: <Sparkles size={18} />, label: 'Beautiful analytics dashboards' },
  ];

  const brandGradient = theme.palette.gradient?.brand || 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 45%, #0EA5E9 100%)';

  return (
    <AnimatedPage>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Left brand panel */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: '1 1 45%',
            position: 'relative',
            overflow: 'hidden',
            flexDirection: 'column',
            p: 6,
            background: brandGradient,
            color: '#FFFFFF',
          }}
        >
          {/* Decorative shapes */}
          <Box sx={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position: 'absolute', top: '35%', right: '15%', width: 70, height: 70, transform: 'rotate(45deg)', background: 'rgba(255,255,255,0.07)' }} />
          <Box sx={{ position: 'absolute', bottom: '25%', right: '30%', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.09)' }} />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content',
                maxWidth: '100%',
                position: 'relative',
                mb: { md: 9, lg: 10 },
              }}
            >
              <BrightupLogo
                iconWidth={{ md: 56, lg: 64 }}
                textWidth={{ md: 195, lg: 220 }}
                gap={2}
                color="white"
                sx={{ filter: 'drop-shadow(0px 6px 16px rgba(0, 0, 0, 0.28))' }}
              />
            </Box>
          </motion.div>

          <Box sx={{ position: 'relative' }}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h3" fontWeight="bold" sx={{ maxWidth: 460, mb: 2 }}>
                Empower your institution to shine brighter.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 420, mb: 4 }}>
                Manage students, batches, syllabi and reports — all in one beautifully crafted
                admin portal built for modern education teams.
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {brandFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.12 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.25)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {feature.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ marginTop: 'auto' }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', position: 'relative' }}>
              © {new Date().getFullYear()} Brightup. All rights reserved.
            </Typography>
          </motion.div>
        </Box>

        {/* Right form panel */}
        <Box
          sx={{
            flex: '1 1 55%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark
              ? 'linear-gradient(180deg, #0B1220 0%, #101B31 100%)'
              : 'linear-gradient(180deg, #F6F9FE 0%, #EAF3FB 100%)',
            p: 3,
          }}
        >
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              maxWidth: 430,
              width: '100%',
              px: { xs: 3, sm: 4 },
              py: { xs: 4, sm: 5 },
              boxShadow: isDark
                ? '0px 20px 60px rgba(0, 0, 0, 0.5)'
                : '0px 20px 60px rgba(15, 23, 42, 0.12)',
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
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
              <Typography
                variant="h4"
                component={motion.h1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                Welcome back!
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

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
                  onChange={(e) => setUserName(e.target.value)}
                  sx={{ mb: 3 }}
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
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 4 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login to Brightup'}
                </Button>
              </motion.div>
            </Box>
          </Card>
        </Box>
      </Box>
    </AnimatedPage>
  );
};

export default Login;
