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
        { 
      field: 'id', 
      headerName: 'ID', 
      width: 100,
      headerAlign: 'left',
      align: 'left',
      renderHeader: () => (
        <Box sx={{ paddingLeft: '16px' }}>ID</Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingLeft: '16px' }}>{params.value}</Box>
      ),
    },
    { field: 'name', headerName: 'Batch Name', flex: 1, minWidth: 70 },
    { field: 'mentor', headerName: 'Mentor', flex: 1, minWidth: 120 },
    {
      field: 'start_date',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    },
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    },
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1.2,
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);

        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // convert to 12-hour format

        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year} : ${hours}.${minutes} ${ampm}`;
      },
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
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#102a43',
                  color: '#e0e0e0',
                  fontWeight: '600',
                },
                '& .MuiDataGrid-row': {
                  borderBottom: '1px solid #e0e0e0',
                },
              }}
            />
          )}
        </Box>
      </AnimatedCard>
    </AnimatedPage>
  );
};

export default Batches;
