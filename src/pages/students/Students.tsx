import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  School,
  MapPin,
  Calendar,
  X,
  UserCircle,
  Edit,
} from 'lucide-react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSnackbar } from 'notistack';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { deleteStudent, getAllStudents } from '../../api/student';
import { StudentResponse } from '../../types/student';
import AnimatedCard from '../../components/AnimatedCard';
import AddStudentDialog from '../../components/dialogs/AddStudentDialog';
import DataTable from '../../components/DataTable';
import { GridColDef } from '@mui/x-data-grid';

const Students: React.FC = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete student "${name}"?`)) return;
    try {
      await deleteStudent(id);
      enqueueSnackbar('Student deleted successfully!', { variant: 'success' });
      fetchStudents();
    } catch {
      enqueueSnackbar('Failed to delete student', { variant: 'error' });
    }
  };

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 120,
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
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) =>
        new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, width: '100%' }}>
          <Mail size={16} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params.value}</span>
        </Stack>
      ),
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      flex: 1,
      minWidth: 120,
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
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.value ? (
          <Chip label="Active" color="success" size="small" sx={{ fontWeight: 600 }} />
        ) : (
          <Chip label="Inactive" color="default" size="small" sx={{ fontWeight: 600 }} />
        ),
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
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit student', params.row.id);
            }}
          >
            <Edit size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id, params.row.name);
            }}
          >
            <RiDeleteBin6Line size={18} />
          </IconButton>
        </Box>
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
        actions={[
          {
            label: "Add Student",
            onClick: () => setAddStudentOpen(true),
            icon: <User size={20} />,
          },
        ]}
      />
      <AnimatedCard>
        <Box sx={{ p: 2 }}>
          <DataTable
            rows={students}
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
            onRowClick={handleRowClick}
            sx={{ cursor: 'pointer' }}
          />
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
            <Box sx={{ p: 0 }}>
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

      <AddStudentDialog
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onCreated={fetchStudents}
      />
    </AnimatedPage>
  );
};

export default Students;
