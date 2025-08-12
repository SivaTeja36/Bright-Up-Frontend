import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  createBatchStudentPayment,
  getBatchStudentPayments,
  updateBatchStudentPayment,
  BatchStudentPaymentRequest,
  GetBatchStudentPayment,
} from '../api/batch';

interface StudentPaymentsDialogProps {
  open: boolean;
  onClose: () => void;
  batchId: number;
  batchStudentId: number;
  studentName: string;
}

const StudentPaymentsDialog: React.FC<StudentPaymentsDialogProps> = ({
  open,
  onClose,
  batchId,
  batchStudentId,
  studentName,
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
