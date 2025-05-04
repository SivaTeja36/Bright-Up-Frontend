import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  User,
  Mail,
  Phone,
  School,
  MapPin,
  Calendar,
  X,
  UserCircle,
} from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../api/student';
import { StudentResponse } from '../../types/student';
import AnimatedCard from '../../components/AnimatedCard';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        setError('Failed to fetch students');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <User size={18} />
          <span>{params.value}</span>
        </Stack>
      ),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 0.8,
      renderCell: (params) => <span>{params.value}</span>,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1.2,
      valueFormatter: (params) =>
        new Date(params.value as string).toLocaleString(),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Mail size={16} />
          <span>{params.value}</span>
        </Stack>
      ),
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Phone size={16} />
          <span>{params.value}</span>
        </Stack>
      ),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Active" color="success" size="small" />
        ) : (
          <Chip label="Inactive" color="default" size="small" />
        ),
    },
  ];

  const handleRowClick = (params: any) => {
    setSelectedStudent(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Students"
        subtitle="Manage student information and enrollments"
        action={{
          label: "Add Student",
          onClick: () => navigate('/students/add'),
          icon: <User size={20} />,
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Students' },
        ]}
      />
      <AnimatedCard>
        <Box sx={{ height: 600, width: '100%' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              {error}
            </Box>
          ) : (
            <DataGrid
              rows={students}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              sx={{
                cursor: 'pointer',
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(0,0,0,0.03)',
                },
                '& .MuiDataGrid-cell': {
                  alignItems: 'center',
                  display: 'flex',
                },
              }}
            />
          )}
        </Box>
      </AnimatedCard>

      {/* Overview Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <User size={24} />
            <span>Student Overview</span>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <User size={22} />
                  <Typography variant="h6">{selectedStudent.name}</Typography>
                  <Chip
                    label={selectedStudent.is_active ? "Active" : "Inactive"}
                    color={selectedStudent.is_active ? "success" : "default"}
                    size="small"
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <UserCircle size={18} />
                  <Typography>{selectedStudent.gender}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Mail size={18} />
                  <Typography>{selectedStudent.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Phone size={18} />
                  <Typography>{selectedStudent.phone_number}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <School size={18} />
                  <Typography>{selectedStudent.degree} - {selectedStudent.specialization}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Calendar size={18} />
                  <Typography>Passout: {selectedStudent.passout_year}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <MapPin size={18} />
                  <Typography>{selectedStudent.city}, {selectedStudent.state}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Tooltip title="Referred By">
                    <span>🔗</span>
                  </Tooltip>
                  <Typography>{selectedStudent.refered_by || "N/A"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Tooltip title="Created At">
                    <span>🕒</span>
                  </Tooltip>
                  <Typography>{new Date(selectedStudent.created_at).toLocaleString()}</Typography>
                </Stack>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
};

export default Students;
