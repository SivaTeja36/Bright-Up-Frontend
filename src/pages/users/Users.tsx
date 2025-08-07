import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Users as UsersIcon,
  Edit,
} from 'lucide-react';
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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: '#e0f7fa',
            color: '#00796b',
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            fontWeight: 500,
            fontSize: '0.875rem',
            display: 'inline-block',
            textTransform: 'capitalize',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      width: 150,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 160,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isActive = params.value;
        return (
          <Box
            sx={{
              backgroundColor: isActive ? '#c8f7c5' : '#e0e0e0',
              color: isActive ? '#2e7d32' : '#616161',
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'capitalize',
              textAlign: 'center',
              minWidth: '70px',
            }}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => console.log('Edit user', params.id)}>
            <Edit size={18} />
          </IconButton>
          <IconButton onClick={() => console.log('Delete user', params.id)}>
            <RiDeleteBin6Line size={18} />
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
          label: 'Add User',
          onClick: () => navigate('/users/add'),
          icon: <UsersIcon size={20} />,
        }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users' },
        ]}
      />
      <AnimatedCard>
        <Box sx={{ height: 600, width: '100%' }}>
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
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
              checkboxSelection={ false }
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#102a43',
                  color: '#e0e0e0',
                  fontWeight: '600',
                },
                '& .MuiDataGrid-row': {
                  borderBottom: '1px solid #e0e0e0',
                },
              }}
            />
          )}
        </Box>
      </AnimatedCard>
    </AnimatedPage>
  );
};

export default Users;
