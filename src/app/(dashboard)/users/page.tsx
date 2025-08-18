'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { apiClient } from '@/utils/apiClient'

// Local Imports
import UserDrawer from './UserDrawer'

interface User {
  _id: string
  email: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [confirmUser, setConfirmUser] = useState<User | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        const data = await apiClient.get<{ items: User[]; total: number }>(
          '/users',
          { params: { page: page + 1, limit } }
        )

        setUsers(data.items)
        setTotal(data.total)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load users'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page, limit])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenCreate = () => {
    setEditingUser(null)
    setDrawerOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDrawerOpen(true)
  }

  const handleSaved = (saved: User) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => (u._id === saved._id ? saved : u)))
    } else {
      setUsers(prev => [saved, ...prev])
      setTotal(prev => prev + 1)
    }
  }

  const handleDelete = (user: User) => {
    setConfirmUser(user)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (!confirmUser) return

    try {
      setDeleting(true)
      await apiClient.del(`/users/${confirmUser._id}`)
      setUsers(prev => prev.filter(u => u._id !== confirmUser._id))
      setTotal(prev => prev - 1)
      setConfirmUser(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user'

      setDeleteError(message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box className='text-red-500'>{error}</Box>
  }

  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex items-center justify-between'>
        <Typography>Total: {total}</Typography>
        <Button variant='contained' onClick={handleOpenCreate}>
          New User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length ? (
              users.map(user => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align='right'>
                    <Button size='small' variant='text' onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button
                      size='small'
                      color='error'
                      variant='text'
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align='center'>
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <UserDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingUser(null)
        }}
        user={editingUser}
        onSaved={handleSaved}
      />
      <Dialog open={!!confirmUser} onClose={() => setConfirmUser(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {confirmUser?.email}?
          </DialogContentText>
          {deleteError && <Typography color='error'>{deleteError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmUser(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button color='error' onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

