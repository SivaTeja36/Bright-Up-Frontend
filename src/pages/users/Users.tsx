import { useState, useEffect } from 'react';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Users as UsersIcon, Edit, Delete } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../api/auth';
import { User } from '../../types/auth';
import AnimatedCard from '../../components/AnimatedCard';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 80 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 200,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString();
      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value ? 'green' : 'orange',
            fontWeight: 'bold',
          }}
        >
          {params.value ? 'Active' : 'Inactive'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => console.log('Edit user', params.id)}>
            <Edit size={20} />
          </IconButton>
          <IconButton onClick={() => console.log('Delete user', params.id)}>
            <Delete size={20} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Users"
        subtitle="Manage system users and their roles"
        action={{
          label: "Add User",
          onClick: () => navigate('/users/add'),
          icon: <UsersIcon size={20} />
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users' }
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
              rows={users}
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

export default Users;