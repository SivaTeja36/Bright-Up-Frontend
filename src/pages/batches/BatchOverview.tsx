// src/pages/BatchOverview.tsx

import { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Button, Stack, CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { getBatchById, getClassSchedulesByBatch } from '../../api/batch';
import { getBatchStudents } from '../../api/student';
import { getAllSyllabi } from '../../api/syllabus';
import { BatchResponse, ClassScheduleResponse } from '../../types/batch';
import { MappedBatchStudentResponse } from '../../types/student';
import { SyllabusResponse } from '../../types/syllabus';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AnimatedCard from '../../components/AnimatedCard';

const BatchOverview = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<BatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  // Tab data
  const [students, setStudents] = useState<MappedBatchStudentResponse[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [schedule, setSchedule] = useState<ClassScheduleResponse[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [syllabus, setSyllabus] = useState<SyllabusResponse | null>(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);

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
    } else if (tab === 2 && batch) {
      setSyllabusLoading(true);
      getAllSyllabi()
        .then((syllabi) => {
          // Adjust this logic if your batch has a syllabus id
          const found = syllabi.find((s) => batch.syllabus?.[0]?.id === s.id);
          setSyllabus(found || null);
        })
        .finally(() => setSyllabusLoading(false));
    }
    // eslint-disable-next-line
  }, [tab, batchId, batch]);

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
                      onClick={() => alert('Show add student to batch modal!')}
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
                  {syllabusLoading ? (
                    <CircularProgress />
                  ) : syllabus ? (
                    <Box>
                      <Typography variant="h6">{syllabus.name}</Typography>
                      <Box mt={2}>
                        <Typography variant="subtitle1">Topics:</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                          {syllabus.topics.map((topic, idx) => (
                            <Box key={idx} px={2} py={1} bgcolor="#374151" color="#fff" borderRadius={2}>
                              {topic}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
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
    </AnimatedPage>
  );
};

export default BatchOverview;
