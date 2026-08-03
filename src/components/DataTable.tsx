import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

type HeightValue =
  | number
  | string
  | {
      xs?: number | string;
      sm?: number | string;
      md?: number | string;
      lg?: number | string;
      xl?: number | string;
    };

export interface DataTableProps extends Omit<DataGridProps, 'loading'> {
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  height?: HeightValue;
}

const DataTable = ({
  loading,
  error,
  emptyMessage = 'No data available.',
  height = { xs: 420, md: 600 },
  slots,
  slotProps,
  ...gridProps
}: DataTableProps) => {
  return (
    <Box sx={{ width: '100%', height }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <DataGrid
          {...gridProps}
          slots={{
            noRowsOverlay: () => (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="text.secondary">{emptyMessage}</Typography>
              </Box>
            ),
            ...slots,
          }}
          slotProps={slotProps}
        />
      )}
    </Box>
  );
};

export default DataTable;
