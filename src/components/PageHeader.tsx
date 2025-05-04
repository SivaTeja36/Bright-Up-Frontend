import { Typography, Box, Button, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  breadcrumbs?: BreadcrumbItem[];
}

const PageHeader = ({ title, subtitle, action, breadcrumbs }: PageHeaderProps) => {
  return (
    <Box mb={4}>
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
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {action && (
          <Button
            variant="contained"
            color="primary"
            onClick={action.onClick}
            startIcon={action.icon}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;