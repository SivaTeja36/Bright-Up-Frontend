import { Box, Typography, Card, CardContent, IconButton, useTheme } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  increase?: string;
  onClick?: () => void;
}

const cardVariants = {
  hover: {
    scale: 1.03,
    y: -4,
    boxShadow: '0px 16px 40px rgba(37, 99, 235, 0.16)',
    transition: {
      duration: 0.3,
    },
  },
};

const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { rotate: 15, scale: 1.1, transition: { duration: 0.3 } },
};

const useCountUp = (target: number, duration = 1200) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return { ref, value };
};

const StatsCard = ({ title, value, icon, color, increase, onClick }: StatsCardProps) => {
  const theme = useTheme();
  const numeric = typeof value === 'number' ? value : parseInt(String(value), 10);
  const isNumeric = typeof value === 'number' || !isNaN(numeric);
  const { ref, value: animatedValue } = useCountUp(isNumeric ? numeric : 0);

  return (
    <motion.div whileHover="hover" variants={cardVariants}>
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${color}1F 0%, ${color}08 100%), ${theme.palette.background.paper}`
            : `linear-gradient(135deg, ${color}14 0%, ${color}05 100%), #FFFFFF`,
          borderLeft: `5px solid ${color}`,
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -40,
            right: -40,
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}1F 0%, transparent 70%)`,
          },
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" mt={1} sx={{ color: 'text.primary' }}>
                {isNumeric ? (
                  <span ref={ref}>{animatedValue.toLocaleString()}</span>
                ) : (
                  value
                )}
              </Typography>
              {increase && (
                <Typography variant="body2" sx={{ mt: 0.5, color: theme.palette.success.main, fontWeight: 600 }}>
                  {increase}
                </Typography>
              )}
            </Box>
            <motion.div variants={iconVariants} style={{ position: 'relative', zIndex: 1 }}>
              <IconButton
                sx={{
                  backgroundColor: `${color}1F`,
                  color: color,
                  '&:hover': {
                    backgroundColor: `${color}38`,
                  },
                  width: 52,
                  height: 52,
                }}
                disableRipple
              >
                {icon}
              </IconButton>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
