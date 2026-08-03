import { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Users as UsersIcon,
  Edit,
} from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { getAllUsers } from '../../api/auth';
import { User } from '../../types/auth';
import AnimatedCard from '../../components/AnimatedCard';
import AddUserDialog from '../../components/dialogs/AddUserDialog';
import DataTable from '../../components/DataTable';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 120 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        />
      ),
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          size="small"
          color={params.value ? 'success' : 'default'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => console.log('Edit user', params.id)}>
            <Edit size={18} />
          </IconButton>
          <IconButton size="small" onClick={() => console.log('Delete user', params.id)}>
            <RiDeleteBin6Line size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AnimatedPage>
      <PageHeader
        title="Users"
        subtitle="Manage system users and their roles"
        actions={[
          {
            label: 'Add User',
            onClick: () => setAddUserOpen(true),
            icon: <UsersIcon size={20} />,
          },
        ]}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users' },
        ]}
      />
      <AnimatedCard>
        <Box sx={{ p: 2 }}>
          <DataTable
            rows={users}
            columns={columns}
            loading={loading}
            error={error}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      </AnimatedCard>

      <AddUserDialog
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onCreated={fetchUsers}
      />
    </AnimatedPage>
  );
};

export default Users;
