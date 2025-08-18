'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'

// Custom Component Imports
import CustomTextField from '@core/components/mui/TextField'

// API Client
import { apiClient } from '@/utils/apiClient'

interface User {
  _id?: string
  email: string
}

interface UserDrawerProps {
  open: boolean
  onClose: () => void
  user?: User | null
  onSaved?: (user: User) => void
}

const UserDrawer = ({ open, onClose, user, onSaved }: UserDrawerProps) => {
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setEmail(user?.email ?? '')
    setError(null)
  }, [user, open])

  const handleSave = async () => {
      try {
        setSaving(true)
        const payload = { email }
        let saved: User

        if (user && user._id) {
          saved = await apiClient.put<User>(`/users/${user._id}`, payload)
        } else {
          saved = await apiClient.post<User>('/users', payload)
        }

        onSaved?.(saved)

        onClose()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save user'

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
  <Drawer anchor='right' open={open} onClose={onClose} keepMounted>
      <Box className='flex flex-col gap-4 p-6 is-[400px]'>
        <Typography variant='h6'>{user ? 'Edit User' : 'New User'}</Typography>
        {error && <Typography color='error'>{error}</Typography>}
        <CustomTextField
          fullWidth
          label='Email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Box className='flex justify-end gap-2 mt-4'>
          <Button variant='tonal' color='secondary' onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave} disabled={!email || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default UserDrawer

