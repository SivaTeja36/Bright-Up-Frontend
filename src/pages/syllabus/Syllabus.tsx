import React, { useState, useEffect } from 'react';
import {
  Box, CircularProgress, Chip, Stack, Tooltip, Dialog, DialogTitle, DialogContent, Typography, IconButton
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BookOpen, X } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllSyllabi } from '../../api/syllabus';
import { SyllabusResponse } from '../../types/syllabus';
import AnimatedCard from '../../components/AnimatedCard';

const Syllabus = () => {
  const navigate = useNavigate();
  const [syllabi, setSyllabi] = useState<SyllabusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSyllabusName, setSelectedSyllabusName] = useState<string>('');

  useEffect(() => {
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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'topics',
      headerName: 'Topics',
      width: 150,
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
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
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
              checkboxSelection
              disableRowSelectionOnClick
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
    </AnimatedPage>
  );
};

export default Syllabus;
