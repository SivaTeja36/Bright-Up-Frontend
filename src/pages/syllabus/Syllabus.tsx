import React, { useState, useEffect } from 'react';
import {
  Box, Chip, Stack, Tooltip, Dialog, DialogTitle, DialogContent, Typography, IconButton
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { BookOpen, Edit, X } from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSnackbar } from 'notistack';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { deleteSyllabus, getAllSyllabi } from '../../api/syllabus';
import { SyllabusResponse } from '../../types/syllabus';
import AnimatedCard from '../../components/AnimatedCard';
import CreateSyllabusDialog from '../../components/dialogs/CreateSyllabusDialog';
import DataTable from '../../components/DataTable';

const Syllabus = () => {
  const [syllabi, setSyllabi] = useState<SyllabusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSyllabusName, setSelectedSyllabusName] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete syllabus "${name}"?`)) return;
    try {
      await deleteSyllabus(id);
      enqueueSnackbar('Syllabus deleted successfully!', { variant: 'success' });
      fetchSyllabi();
    } catch {
      enqueueSnackbar('Failed to delete syllabus', { variant: 'error' });
    }
  };

  const fetchSyllabi = async () => {
    try {
      setLoading(true);
      const data = await getAllSyllabi();
      setSyllabi(data);
    } catch (err) {
      setError('Failed to fetch syllabi');
      console.error('Error fetching syllabi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const handleOpenTopics = (topics: string[], name: string) => {
    setSelectedTopics(topics);
    setSelectedSyllabusName(name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTopics([]);
    setSelectedSyllabusName('');
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
    {
      field: 'topics',
      headerName: 'Topics',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const topics: string[] = params.value;
        const name: string = params.row.name;
        return (
          <Chip
            label={`${topics.length} topic${topics.length !== 1 ? 's' : ''}`}
            color="primary"
            clickable
            onClick={() => handleOpenTopics(topics, name)}
            sx={{ fontWeight: 600 }}
          />
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 130,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => console.log('Edit syllabus', params.row.id)}>
            <Edit size={18} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id, params.row.name)}>
            <RiDeleteBin6Line size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Syllabus"
        subtitle="Manage course syllabi and topics"
        actions={[
          {
            label: "Create Syllabus",
            onClick: () => setCreateOpen(true),
            icon: <BookOpen size={20} />,
          },
        ]}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Syllabus' }
        ]}
      />
      <AnimatedCard>
        <Box sx={{ p: 2 }}>
          <DataTable
            rows={syllabi}
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
          />
        </Box>
      </AnimatedCard>

      {/* Topics Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Topics for "{selectedSyllabusName}"</span>
          <IconButton onClick={handleClose} size="small">
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTopics.length === 0 ? (
            <Typography>No topics found.</Typography>
          ) : (
            <Stack spacing={1}>
              {selectedTopics.map((topic, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    fontWeight: 500,
                  }}
                >
                  {topic}
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <CreateSyllabusDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchSyllabi}
      />
    </AnimatedPage>
  );
};

export default Syllabus;
