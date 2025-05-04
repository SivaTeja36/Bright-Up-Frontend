import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { getBatchById, getClassSchedulesByBatch } from '../../api/batch';
import { getBatchStudents, mapStudentToBatch } from '../../api/student';
import { getAllStudents } from '../../api/student';
import { BatchResponse, ClassScheduleResponse } from '../../types/batch';
import { MapStudentToBatchRequest, MappedBatchStudentResponse, StudentResponse } from '../../types/student';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AnimatedCard from '../../components/AnimatedCard';

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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone_number', headerName: 'Phone', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    {
      field: 'joined_at',
      headerName: 'Joined At',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  // Columns for class schedule
  const scheduleColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'day', headerName: 'Day', flex: 1 },
    { field: 'start_time', headerName: 'Start Time', flex: 1 },
    { field: 'end_time', headerName: 'End Time', flex: 1 },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
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
        subtitle={batch?.mentor_name ? `Mentor: ${batch.mentor_name}` : ''}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches', to: '/batches' },
          { label: `Batch #${batch?.id}` },
        ]}
      />
      <AnimatedCard>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : batch ? (
          <Box>
            {/* Batch Details */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={3} alignItems="center">
              <Typography variant="h6">Mentor: {batch.mentor_name}</Typography>
              <Typography>Start: {new Date(batch.start_date).toLocaleDateString()}</Typography>
              <Typography>End: {new Date(batch.end_date).toLocaleDateString()}</Typography>
              <Typography>Status: {batch.is_active ? 'Active' : 'Inactive'}</Typography>
            </Stack>

            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
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
                  {studentsLoading ? (
                    <CircularProgress />
                  ) : (
                    <DataGrid
                      rows={students}
                      columns={studentColumns}
                      getRowId={(row) => row.id}
                      autoHeight
                      pageSizeOptions={[5, 10]}
                    />
                  )}
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  {scheduleLoading ? (
                    <CircularProgress />
                  ) : (
                    <DataGrid
                      rows={schedule}
                      columns={scheduleColumns}
                      getRowId={(row) => row.id}
                      autoHeight
                      pageSizeOptions={[5, 10]}
                    />
                  )}
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
                                <Box key={i} px={2} py={1} bgcolor="#374151" color="#fff" borderRadius={2}>
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
          <Typography color="error">Batch not found.</Typography>
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
