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
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Payment } from '@mui/icons-material';

// Assuming you have these components in your project
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import AnimatedCard from '../../components/AnimatedCard';

import {
  getBatchById,
  getClassSchedulesByBatch,
  getBatchStudents,
  createBatchStudent,
  updateBatchStudent,
  deleteBatchStudent,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  getBatchStudentPayments,
  createBatchStudentPayment,
} from '../../api/batch';

import {
  BatchResponse,
  ClassScheduleResponse,
  Day,
  GetMappedBatchStudentResponse,
  MapUserToBatchRequest,
  UpdatedBatchStudentRequest,
  ClassScheduleRequest,
  UpdateClassScheduleRequest,
  BatchStudentPaymentRequest,
  GetBatchStudentPayment,
} from '../../types/batch';

/**
 * Dialog component for managing a student's payments.
 */
interface StudentPaymentsDialogProps {
  open: boolean;
  onClose: () => void;
  batchId: number;
  batchStudentId: number;
  studentName: string;
  onPaymentAdded: () => void;
}

const StudentPaymentsDialog: React.FC<StudentPaymentsDialogProps> = ({
  open,
  onClose,
  batchId,
  batchStudentId,
  studentName,
  onPaymentAdded,
}) => {
  const [payments, setPayments] = useState<GetBatchStudentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<BatchStudentPaymentRequest>({
    payment_date: '',
    amount_paid: 0,
    mentor_share: 0,
    referral_share: 0,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const paymentsData = await getBatchStudentPayments(batchId, batchStudentId);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPayments();
    }
  }, [open, batchId, batchStudentId]);

  const handleCreatePayment = async () => {
    if (!paymentData.payment_date || !paymentData.amount_paid) {
      setAddError('Payment date and amount are required.');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      await createBatchStudentPayment(batchId, batchStudentId, paymentData);
      setAddPaymentModalOpen(false);
      setPaymentData({
        payment_date: '',
        amount_paid: 0,
        mentor_share: 0,
        referral_share: 0,
      });
      fetchPayments(); // Refresh the payments list
      onPaymentAdded(); // Notify parent to refresh student data
    } catch (err: any) {
      setAddError(err?.response?.data?.detail || 'Failed to add payment.');
    } finally {
      setAddLoading(false);
    }
  };

  const paymentColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'payment_date',
      headerName: 'Payment Date',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: 'amount_paid', headerName: 'Amount Paid', flex: 1 },
    { field: 'mentor_share', headerName: 'Mentor Share', flex: 1 },
    { field: 'referral_share', headerName: 'Referral Share', flex: 1 },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{studentName}'s Payments</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setAddPaymentModalOpen(true)}>
              Add Payment
            </Button>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={payments}
              columns={paymentColumns}
              getRowId={(row) => row.id}
              autoHeight
              pageSizeOptions={[5, 10]}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      {/* Add Payment Modal */}
      <Dialog open={addPaymentModalOpen} onClose={() => setAddPaymentModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Payment Date"
              type="date"
              value={paymentData.payment_date}
              onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Amount Paid"
              type="number"
              value={paymentData.amount_paid}
              onChange={(e) => setPaymentData({ ...paymentData, amount_paid: Number(e.target.value) })}
              fullWidth
              required
            />
            <TextField
              label="Mentor Share"
              type="number"
              value={paymentData.mentor_share}
              onChange={(e) => setPaymentData({ ...paymentData, mentor_share: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Referral Share"
              type="number"
              value={paymentData.referral_share}
              onChange={(e) => setPaymentData({ ...paymentData, referral_share: Number(e.target.value) })}
              fullWidth
            />
            {addError && <Typography color="error">{addError}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPaymentModalOpen(false)} disabled={addLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreatePayment} variant="contained" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

const BatchOverview: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<BatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  // Students Tab
  const [students, setStudents] = useState<GetMappedBatchStudentResponse[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [deleteStudentModal, setDeleteStudentModal] = useState<number | null>(null);

  // Student Edit/Add Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<GetMappedBatchStudentResponse | null>(null);
  const [studentData, setStudentData] = useState<MapUserToBatchRequest | UpdatedBatchStudentRequest>({
    student_id: 0,
    class_fee: 0,
    mentor_fee: 0,
    referral_by: 0,
    referral_fee: 0,
    joined_at: '',
  });

  // Student Payments Modal
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [currentStudentForPayments, setCurrentStudentForPayments] = useState<GetMappedBatchStudentResponse | null>(null);

  // Class Schedule Tab
  const [schedule, setSchedule] = useState<ClassScheduleResponse[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [deleteScheduleModal, setDeleteScheduleModal] = useState<number | null>(null);

  // Class Schedule Edit/Add Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isEditSchedule, setIsEditSchedule] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<ClassScheduleResponse | null>(null);
  const [scheduleData, setScheduleData] = useState<ClassScheduleRequest | UpdateClassScheduleRequest>({
    day: Day.Monday,
    start_time: '',
    end_time: '',
  });

  // General loading/error states for modals
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // --- Data Fetching Functions ---

  const fetchBatchDetails = async () => {
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

  const fetchStudents = async () => {
    if (batchId) {
      setStudentsLoading(true);
      try {
        const data = await getBatchStudents(Number(batchId));
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setStudentsLoading(false);
      }
    }
  };

  const fetchSchedules = async () => {
    if (batchId) {
      setScheduleLoading(true);
      try {
        const data = await getClassSchedulesByBatch(Number(batchId));
        setSchedule(data);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      } finally {
        setScheduleLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  useEffect(() => {
    if (tab === 0) {
      fetchStudents();
    } else if (tab === 1) {
      fetchSchedules();
    }
  }, [tab, batchId]);

  // --- Student Handlers ---

  const handleOpenAddStudentModal = () => {
    setIsEditStudent(false);
    setCurrentStudent(null);
    setStudentData({
      student_id: 0,
      class_fee: 0,
      mentor_fee: 0,
      referral_by: 0,
      referral_fee: 0,
      joined_at: '',
    });
    setStudentModalOpen(true);
  };

  const handleOpenEditStudentModal = (student: GetMappedBatchStudentResponse) => {
    setIsEditStudent(true);
    setCurrentStudent(student);
    setStudentData({
      class_fee: student.class_fee,
      mentor_fee: student.mentor_fee,
      referral_by: student.referral_by ? Number(student.referral_by) : 0,
      referral_fee: student.referral_fee,
      joined_at: student.joined_at.split('T')[0],
    });
    setStudentModalOpen(true);
  };

  const handleSaveStudent = async () => {
    if (!studentData.class_fee || !studentData.joined_at) {
      setModalError('Class fee and joined date are required.');
      return;
    }
    if (!isEditStudent && studentData.student_id === 0) {
        setModalError('Student ID is required for a new student.');
        return;
    }

    setModalLoading(true);
    setModalError(null);
    try {
      if (isEditStudent && currentStudent) {
        await updateBatchStudent(Number(batchId), currentStudent.id, studentData as UpdatedBatchStudentRequest);
      } else {
        await createBatchStudent(Number(batchId), studentData as MapUserToBatchRequest);
      }
      setStudentModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      setModalError(err?.response?.data?.detail || 'Failed to save student.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (deleteStudentModal) {
      setModalLoading(true);
      try {
        await deleteBatchStudent(Number(batchId), deleteStudentModal);
        setDeleteStudentModal(null);
        fetchStudents();
      } catch (err: any) {
        setModalError(err?.response?.data?.detail || 'Failed to delete student.');
      } finally {
        setModalLoading(false);
      }
    }
  };

  // --- Class Schedule Handlers ---

  const handleOpenAddScheduleModal = () => {
    setIsEditSchedule(false);
    setScheduleData({ day: Day.Monday, start_time: '', end_time: '' });
    setScheduleModalOpen(true);
  };

  const handleOpenEditScheduleModal = (scheduleItem: ClassScheduleResponse) => {
    setIsEditSchedule(true);
    setCurrentSchedule(scheduleItem);
    setScheduleData({
      day: scheduleItem.day as Day,
      start_time: scheduleItem.start_time,
      end_time: scheduleItem.end_time,
    });
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!scheduleData.day || !scheduleData.start_time || !scheduleData.end_time) {
      setModalError('All schedule fields are required.');
      return;
    }

    setModalLoading(true);
    setModalError(null);
    try {
      if (isEditSchedule && currentSchedule) {
        await updateClassSchedule(Number(batchId), currentSchedule.id, scheduleData as UpdateClassScheduleRequest);
      } else {
        await createClassSchedule(Number(batchId), scheduleData as ClassScheduleRequest);
      }
      setScheduleModalOpen(false);
      fetchSchedules();
    } catch (err: any) {
      setModalError(err?.response?.data?.detail || 'Failed to save schedule.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (deleteScheduleModal) {
      setModalLoading(true);
      try {
        await deleteClassSchedule(Number(batchId), deleteScheduleModal);
        setDeleteScheduleModal(null);
        fetchSchedules();
      } catch (err: any) {
        setModalError(err?.response?.data?.detail || 'Failed to delete schedule.');
      } finally {
        setModalLoading(false);
      }
    }
  };

  // --- DataGrid Columns ---

  const studentColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'class_fee', headerName: 'Class Fee', flex: 1 },
    { field: 'paid_fee', headerName: 'Paid Fee', flex: 1 },
    { field: 'student_pending_fee', headerName: 'Pending Fee', flex: 1 },
    {
      field: 'joined_at',
      headerName: 'Joined At',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="info"
            size="small"
            onClick={() => {
              setCurrentStudentForPayments(params.row as GetMappedBatchStudentResponse);
              setPaymentsModalOpen(true);
            }}
          >
            <Payment />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenEditStudentModal(params.row as GetMappedBatchStudentResponse)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => setDeleteStudentModal(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const scheduleColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'day', headerName: 'Day', flex: 1 },
    { field: 'start_time', headerName: 'Start Time', flex: 1 },
    { field: 'end_time', headerName: 'End Time', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenEditScheduleModal(params.row as ClassScheduleResponse)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => setDeleteScheduleModal(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title={`Batch #${batch?.id || ''} Overview`}
        subtitle={batch?.mentor ? `Mentor: ${batch.mentor}` : ''}
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
              <Typography variant="h6">Mentor: {batch.mentor}</Typography>
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
                    <Button variant="contained" onClick={handleOpenAddStudentModal}>
                      Add Student
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
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button variant="contained" onClick={handleOpenAddScheduleModal}>
                      Add Schedule
                    </Button>
                  </Box>
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
                      {batch.syllabus.map((syll: any, idx: number) => {
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

      {/* Add/Edit Student Modal */}
      <Dialog open={studentModalOpen} onClose={() => setStudentModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditStudent ? 'Edit Student Details' : 'Add Student to Batch'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {!isEditStudent && (
                <TextField
                  label="Student ID"
                  type="number"
                  value={studentData.student_id === 0 ? '' : studentData.student_id}
                  onChange={(e) => setStudentData({ ...studentData, student_id: Number(e.target.value) })}
                  fullWidth
                  required
                />
            )}
            <TextField
              label="Class Fee"
              type="number"
              value={studentData.class_fee}
              onChange={(e) => setStudentData({ ...studentData, class_fee: Number(e.target.value) })}
              fullWidth
              required
            />
            <TextField
              label="Mentor Fee"
              type="number"
              value={studentData.mentor_fee}
              onChange={(e) => setStudentData({ ...studentData, mentor_fee: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Referral By (ID)"
              type="number"
              value={studentData.referral_by === 0 ? '' : studentData.referral_by}
              onChange={(e) => setStudentData({ ...studentData, referral_by: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Referral Fee"
              type="number"
              value={studentData.referral_fee}
              onChange={(e) => setStudentData({ ...studentData, referral_fee: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Joined At"
              type="date"
              value={studentData.joined_at}
              onChange={(e) => setStudentData({ ...studentData, joined_at: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            {modalError && (
              <Typography color="error">{modalError}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentModalOpen(false)} disabled={modalLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveStudent}
            variant="contained"
            disabled={modalLoading || (!isEditStudent && studentData.student_id === 0)}
          >
            {modalLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Class Schedule Modal */}
      <Dialog open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditSchedule ? 'Edit Class Schedule' : 'Add Class Schedule'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="Day of the Week"
              value={scheduleData.day}
              onChange={(e) => setScheduleData({ ...scheduleData, day: e.target.value as Day })}
              fullWidth
              required
            >
              {Object.values(Day).map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Time"
              type="time"
              value={scheduleData.start_time}
              onChange={(e) => setScheduleData({ ...scheduleData, start_time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="End Time"
              type="time"
              value={scheduleData.end_time}
              onChange={(e) => setScheduleData({ ...scheduleData, end_time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            {modalError && (
              <Typography color="error">{modalError}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleModalOpen(false)} disabled={modalLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveSchedule}
            variant="contained"
            disabled={modalLoading}
          >
            {modalLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modals */}
      <Dialog open={deleteStudentModal !== null} onClose={() => setDeleteStudentModal(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this student from the batch?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteStudentModal(null)} disabled={modalLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteStudent} color="error" variant="contained" disabled={modalLoading}>
            {modalLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteScheduleModal !== null} onClose={() => setDeleteScheduleModal(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this class schedule?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteScheduleModal(null)} disabled={modalLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSchedule} color="error" variant="contained" disabled={modalLoading}>
            {modalLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Payments Modal */}
      {paymentsModalOpen && currentStudentForPayments && (
        <StudentPaymentsDialog
          open={paymentsModalOpen}
          onClose={() => {
            setPaymentsModalOpen(false);
            setCurrentStudentForPayments(null);
          }}
          batchId={Number(batchId)}
          batchStudentId={currentStudentForPayments.id}
          studentName={currentStudentForPayments.name}
          onPaymentAdded={fetchStudents}
        />
      )}
    </AnimatedPage>
  );
};

export default BatchOverview;