import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardProps } from '@mui/material';

interface AnimatedCardProps extends CardProps {
  children: ReactNode;
  delay?: number;
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const AnimatedCard = ({ children, delay = 0, ...props }: AnimatedCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};

export default AnimatedCard;