import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { User } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../api/student';
import { StudentResponse } from '../../types';
import AnimatedCard from '../../components/AnimatedCard';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'degree', headerName: 'Degree', width: 150 },
    { field: 'specialization', headerName: 'Specialization', width: 200 },
    { field: 'passout_year', headerName: 'Passout Year', width: 130 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'refered_by', headerName: 'Referred By', width: 150 },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 130,
      valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Students"
        subtitle="Manage student information and enrollments"
        action={{
          label: "Add Student",
          onClick: () => navigate('/students/add'),
          icon: <User size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Students' }
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
              rows={students}
              columns={columns}
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
    </AnimatedPage>
  );
}

export default Students;