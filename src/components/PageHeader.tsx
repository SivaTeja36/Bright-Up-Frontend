import { Typography, Box, Button, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: PageAction[];
  breadcrumbs?: BreadcrumbItem[];
}

const PageHeader = ({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) => {
  return (
    <Box mb={{ xs: 3, sm: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography key={index} color="text.primary">
                {item.label}
              </Typography>
            ) : (
              <Link
                key={index}
                component={RouterLink}
                to={item.to || '#'}
                color="inherit"
                underline="hover"
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            sx={{ fontSize: { xs: '1.375rem', sm: '1.5rem' }, lineHeight: 1.3 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions && actions.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                onClick={action.onClick}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;