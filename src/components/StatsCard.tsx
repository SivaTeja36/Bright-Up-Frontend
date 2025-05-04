import { Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

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
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: 0.3,
    },
  },
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 15, transition: { duration: 0.3 } },
};

const StatsCard = ({ title, value, icon, color, increase, onClick }: StatsCardProps) => {
  return (
    <motion.div whileHover="hover" variants={cardVariants}>
      <Card 
        sx={{ 
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          background: `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%), ${color}22`,
          borderLeft: `4px solid ${color}`,
          transition: 'all 0.3s ease-in-out',
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" mt={1}>
                {value}
              </Typography>
              {increase && (
                <Typography variant="body2" color="success.main" mt={0.5}>
                  {increase}
                </Typography>
              )}
            </Box>
            <motion.div variants={iconVariants}>
              <IconButton 
                sx={{ 
                  backgroundColor: `${color}22`, 
                  color: color,
                  '&:hover': {
                    backgroundColor: `${color}44`,
                  }
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