// src/pages/Batches.tsx

import { useState, useEffect } from 'react';
import { Box, Chip, IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Calendar, Clock, Edit } from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSnackbar } from 'notistack';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { deleteBatch, getAllBatches } from '../../api/batch';
import { BatchResponse } from '../../types/batch';
import AnimatedCard from '../../components/AnimatedCard';
import CreateBatchDialog from '../../components/dialogs/CreateBatchDialog';
import ClassScheduleDialog from '../../components/dialogs/ClassScheduleDialog';
import DataTable from '../../components/DataTable';

const Batches = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createBatchOpen, setCreateBatchOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchResponse | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteBatch = async (batch: BatchResponse) => {
    if (!window.confirm(`Delete batch #${batch.id}?`)) return;
    try {
      await deleteBatch(batch.id);
      enqueueSnackbar('Batch deleted successfully!', { variant: 'success' });
      fetchBatches();
    } catch {
      enqueueSnackbar('Failed to delete batch', { variant: 'error' });
    }
  };

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

  useEffect(() => {
    fetchBatches();
  }, []);

  const columns: GridColDef[] = [
    { field: 'mentor', headerName: 'Mentor', flex: 1, minWidth: 120 },
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
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          size="small"
          color={params.value ? 'success' : 'default'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<BatchResponse>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setEditingBatch(params.row);
            }}
          >
            <Edit size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBatch(params.row);
            }}
          >
            <RiDeleteBin6Line size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Batches"
        subtitle="Manage student batches and schedules"
        actions={[
          {
            label: "Create Batch",
            onClick: () => setCreateBatchOpen(true),
            icon: <Calendar size={20} />,
          },
          {
            label: "Add Class Schedule",
            onClick: () => setScheduleOpen(true),
            icon: <Clock size={20} />,
            variant: 'outlined',
          },
        ]}
      />
      <AnimatedCard>
        <Box sx={{ p: 2 }}>
          <DataTable
            rows={batches}
            columns={columns}
            loading={loading}
            error={error}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/batches/${params.row.id}`)}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </AnimatedCard>

      <CreateBatchDialog
        open={createBatchOpen}
        onClose={() => setCreateBatchOpen(false)}
        onCreated={fetchBatches}
      />
      <CreateBatchDialog
        open={Boolean(editingBatch)}
        batch={editingBatch}
        onClose={() => setEditingBatch(null)}
        onCreated={fetchBatches}
      />
      <ClassScheduleDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </AnimatedPage>
  );
};

export default Batches;
