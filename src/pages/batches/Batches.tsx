// src/pages/Batches.tsx

import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Calendar } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllBatches } from '../../api/batch';
import { BatchResponse } from '../../types/batch';
import AnimatedCard from '../../components/AnimatedCard';

const Batches = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await getAllBatches();
        setBatches(data);
      } catch (err) {
        setError('Failed to fetch batches');
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 70 },
    { field: 'mentor_name', headerName: 'Mentor', flex: 1, minWidth: 120 },
    {
      field: 'start_date',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1.2,
      minWidth: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Batches"
        subtitle="Manage student batches and schedules"
        action={{
          label: "Create Batch",
          onClick: () => navigate('/batches/create'),
          icon: <Calendar size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches' }
        ]}
      />
      <AnimatedCard>
        <Box sx={{ height: 600, width: '100%' }}>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              {error}
            </Box>
          )}
          {!loading && !error && (
            <DataGrid
              rows={batches}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              onRowClick={(params) => navigate(`/batches/${params.row.id}`)}
              sx={{
                cursor: 'pointer',
                '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
              }}
            />
          )}
        </Box>
      </AnimatedCard>
    </AnimatedPage>
  );
};

export default Batches;
