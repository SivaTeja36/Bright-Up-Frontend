import React, { useState, useEffect } from 'react';
import {
  Box, CircularProgress, Chip, Stack, Dialog, DialogTitle,
  DialogContent, Typography, IconButton, Tooltip, Snackbar, Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BookOpen, X } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllSyllabi, deleteSyllabus } from '../../api/syllabus';
import { SyllabusResponse } from '../../types/syllabus';
import AnimatedCard from '../../components/AnimatedCard';
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

const Syllabus = () => {
  const navigate = useNavigate();
  const [syllabi, setSyllabi] = useState<SyllabusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSyllabusName, setSelectedSyllabusName] = useState<string>('');

  // Snackbar (only for errors)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const formatErrorMessage = (msg: string) => {
    return msg
      .replace(/_/g, ' ') // replace underscores with spaces
      .toLowerCase() // make all lowercase
      .replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSyllabus(id);
      fetchSyllabi();
    } catch (err: any) {
      let rawMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete syllabus';

      const formattedMessage = formatErrorMessage(rawMessage);
      setSnackbarMessage(formattedMessage);
      setSnackbarOpen(true);
    }
  };

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
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'topics',
      headerName: 'Topics',
      flex: 1,
      renderCell: (params) => {
        const topics: string[] = params.value;
        const name: string = params.row.name;
        return (
          <Chip
            label={`${topics.length} topic${topics.length !== 1 ? 's' : ''}`}
            color="primary"
            clickable
            onClick={() => handleOpenTopics(topics, name)}
            sx={{ fontWeight: 500 }}
          />
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1.5,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      flex: 1.5,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => navigate(`/syllabus/update/${params.row.id}`)}
              sx={{ color: '#fff' }} 
            >
              <TbEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: '#fff' }}
            >
              <MdDeleteOutline size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Syllabus"
        subtitle="Manage course syllabi and topics"
        action={{
          label: "Create Syllabus",
          onClick: () => navigate('/syllabus/create'),
          icon: <BookOpen size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Syllabus' }
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
              rows={syllabi}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
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

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AnimatedPage>
  );
};

export default Syllabus;
