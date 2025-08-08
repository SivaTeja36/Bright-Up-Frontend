import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Switch,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Users as UsersIcon } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser } from '../../api/auth';
import { UserDetails, UserUpdateRequest } from '../../types/auth';
import AnimatedCard from '../../components/AnimatedCard';

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

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

  const handleToggleActive = async (user: UserDetails) => {
    try {
      setUpdatingUserId(user.id);

      // Prepare user data without is_active field as per requirement
      const updateData: UserUpdateRequest = {
        name: user.name,
        gender: user.gender || '',
        role: user.role,
        phone_number: user.phone_number,
      };

      // Call update API with toggled is_active
      await updateUser(user.id, {
        ...updateData,
        is_active: !user.is_active,
      });

      // Refresh users list after update
      const refreshedUsers = await getAllUsers();
      setUsers(refreshedUsers);

    } catch (err) {
      console.error('Failed to update user status:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleNavigateUpdate = (userId: number) => {
    navigate(`/users/update/${userId}`);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100,
      headerAlign: 'left',
      align: 'left',
      renderHeader: () => (
        <Box sx={{ paddingLeft: '16px' }}>ID</Box>
      ),
      renderCell: (params) => (
        <Box sx={{ paddingLeft: '16px' }}>{params.value}</Box>
      ),
    },
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
      width: 140,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'enable_disable',
      headerName: 'Enabled',
      width: 130,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        const user = params.row as UserDetails;
        const isActive = user.is_active;
        const loading = updatingUserId === user.id;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Switch
              checked={isActive}
              onChange={() => handleToggleActive(user)}
              disabled={loading}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4caf50',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#4caf50',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#ccc',
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'navigate_update',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        const user = params.row as UserDetails;
        return (
          <IconButton
            size="small"
            aria-label="Update User"
            onClick={() => handleNavigateUpdate(user.id)}
          >
            &gt;
          </IconButton>
        );
      },
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
              checkboxSelection={false}
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