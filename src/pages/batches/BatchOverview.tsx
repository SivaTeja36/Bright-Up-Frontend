import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSnackbar } from 'notistack';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { deleteClassSchedule, getBatchById, getClassSchedulesByBatch } from '../../api/batch';
import { deleteBatchStudent, getBatchStudents, mapStudentToBatch } from '../../api/student';
import { getAllStudents } from '../../api/student';
import { BatchResponse, ClassScheduleResponse } from '../../types/batch';
import { MappedBatchStudentResponse, StudentResponse } from '../../types/student';
import { GridColDef } from '@mui/x-data-grid';
import AnimatedCard from '../../components/AnimatedCard';
import DataTable from '../../components/DataTable';

const BatchOverview: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<BatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  // Students Tab
  const [students, setStudents] = useState<MappedBatchStudentResponse[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Class Schedule Tab
  const [schedule, setSchedule] = useState<ClassScheduleResponse[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Add to Batch Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [allStudents, setAllStudents] = useState<StudentResponse[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [amount, setAmount] = useState('');
  const [joinedAt, setJoinedAt] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveStudent = async (mapping: MappedBatchStudentResponse) => {
    if (!window.confirm(`Remove ${mapping.name} from this batch?`)) return;
    try {
      await deleteBatchStudent(mapping.id);
      enqueueSnackbar('Student removed from batch successfully!', { variant: 'success' });
      setStudentsLoading(true);
      getBatchStudents(Number(batchId))
        .then(setStudents)
        .finally(() => setStudentsLoading(false));
    } catch {
      enqueueSnackbar('Failed to remove student from batch', { variant: 'error' });
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!window.confirm('Delete this class schedule?')) return;
    try {
      await deleteClassSchedule(Number(batchId), id);
      enqueueSnackbar('Class schedule deleted successfully!', { variant: 'success' });
      setScheduleLoading(true);
      getClassSchedulesByBatch(Number(batchId))
        .then(setSchedule)
        .finally(() => setScheduleLoading(false));
    } catch {
      enqueueSnackbar('Failed to delete class schedule', { variant: 'error' });
    }
  };

  // Fetch batch details
  useEffect(() => {
    const fetchBatch = async () => {
      setLoading(true);
      try {
        const data = await getBatchById(Number(batchId));
        setBatch(data);
      } catch {
        setBatch(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [batchId]);

  // Fetch students/class schedule on tab change
  useEffect(() => {
    if (tab === 0 && batchId) {
      setStudentsLoading(true);
      getBatchStudents(Number(batchId))
        .then(setStudents)
        .finally(() => setStudentsLoading(false));
    } else if (tab === 1 && batchId) {
      setScheduleLoading(true);
      getClassSchedulesByBatch(Number(batchId))
        .then(setSchedule)
        .finally(() => setScheduleLoading(false));
    }
  }, [tab, batchId]);

  // Fetch all students when modal opens
  useEffect(() => {
    if (addModalOpen) {
      getAllStudents().then(setAllStudents);
    }
  }, [addModalOpen]);

  // Columns for students
  const studentColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 110 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 110 },
    { field: 'phone_number', headerName: 'Phone', flex: 1, minWidth: 110 },
    { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 110, align: 'right', headerAlign: 'right' },
    {
      field: 'joined_at',
      headerName: 'Joined At',
      flex: 1,
      minWidth: 110,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => console.log('Edit mapping', params.row.id)}>
            <Edit size={18} />
          </IconButton>
          <IconButton size="small" onClick={() => handleRemoveStudent(params.row)}>
            <RiDeleteBin6Line size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Columns for class schedule
  const scheduleColumns: GridColDef[] = [
    { field: 'day', headerName: 'Day', flex: 1, minWidth: 110 },
    { field: 'start_time', headerName: 'Start Time', flex: 1, minWidth: 110 },
    { field: 'end_time', headerName: 'End Time', flex: 1, minWidth: 110 },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      minWidth: 110,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      minWidth: 110,
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
      minWidth: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => console.log('Edit schedule', params.row.id)}>
            <Edit size={18} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteSchedule(params.row.id)}>
            <RiDeleteBin6Line size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Add to Batch handler
  const handleAddToBatch = async () => {
    if (!selectedStudent || !amount || !joinedAt) {
      setAddError('All fields are required.');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      await mapStudentToBatch(selectedStudent.id, {
        batch_id: Number(batchId),
        amount: Number(amount),
        joined_at: joinedAt,
      });
      setAddModalOpen(false);
      setSelectedStudent(null);
      setAmount('');
      setJoinedAt('');
      // Refresh students list
      setStudentsLoading(true);
      getBatchStudents(Number(batchId))
        .then(setStudents)
        .finally(() => setStudentsLoading(false));
    } catch (err: any) {
      setAddError(
        err?.response?.data?.detail ||
        err?.detail ||
        err?.message ||
        'Failed to add student to batch.'
      );
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <PageHeader
        title={`Batch #${batch?.id || ''} Overview`}
        subtitle={batch?.mentor ? `Mentor: ${batch.mentor}` : ''}
      />
      <AnimatedCard>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300} p={2}>
            <CircularProgress />
          </Box>
        ) : batch ? (
          <Box p={2}>
            {/* Batch Details */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={3} alignItems="flex-start">
              <Typography variant="h6">Mentor: {batch.mentor}</Typography>
              <Typography>Start: {new Date(batch.start_date).toLocaleDateString()}</Typography>
              <Typography>End: {new Date(batch.end_date).toLocaleDateString()}</Typography>
              <Chip
                label={batch.is_active ? 'Active' : 'Inactive'}
                color={batch.is_active ? 'success' : 'default'}
                size="small"
                sx={{ mt: { xs: 0, sm: 0.5 }, fontWeight: 600 }}
              />
            </Stack>

            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ mb: 2 }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Students" />
              <Tab label="Class Schedule" />
              <Tab label="Syllabus" />
            </Tabs>

            {/* Tab Content */}
            <Box>
              {tab === 0 && (
                <Box>
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                      variant="contained"
                      onClick={() => setAddModalOpen(true)}
                    >
                      Add to Batch
                    </Button>
                  </Box>
                  <DataTable
                    rows={students}
                    columns={studentColumns}
                    getRowId={(row) => row.id}
                    loading={studentsLoading}
                    autoHeight
                    height="auto"
                    pageSizeOptions={[5, 10]}
                  />
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  <DataTable
                    rows={schedule}
                    columns={scheduleColumns}
                    getRowId={(row) => row.id}
                    loading={scheduleLoading}
                    autoHeight
                    height="auto"
                    pageSizeOptions={[5, 10]}
                  />
                </Box>
              )}
              {tab === 2 && (
                <Box>
                  {/* Syllabus Tab: Display syllabus from batch.syllabus */}
                  {batch.syllabus && batch.syllabus.length > 0 ? (
                    <Stack spacing={3}>
                      {batch.syllabus.map((syll, idx) => {
                        const subject = Object.keys(syll)[0];
                        const topics = syll[subject] as string[];
                        return (
                          <Box key={idx}>
                            <Typography variant="h6" mb={1}>{subject.charAt(0).toUpperCase() + subject.slice(1)}</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {topics.map((topic, i) => (
                                <Box key={i} px={2} py={1} bgcolor="#DBEAFE" color="#1E40AF" borderRadius={2} fontWeight={500}>
                                  {topic}
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography>No syllabus assigned to this batch.</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Typography color="error" p={2}>Batch not found.</Typography>
        )}
      </AnimatedCard>
      <Box mt={2}>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/batches')}>
          Back to Batches
        </Button>
      </Box>

      {/* Add to Batch Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Student to Batch</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Autocomplete
              options={allStudents}
              getOptionLabel={(option) => option.name}
              value={selectedStudent}
              onChange={(_, value) => setSelectedStudent(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Student" fullWidth />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Joined At"
              type="date"
              value={joinedAt}
              onChange={(e) => setJoinedAt(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            {addError && (
              <Typography color="error">{addError}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)} disabled={addLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToBatch}
            variant="contained"
            disabled={addLoading}
          >
            {addLoading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedPage>
  );
};

export default BatchOverview;
