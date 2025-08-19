'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

interface InviteForm {
  name: string
  email: string
  role: 'admin' | 'rep' | 'user'
}

export default function UsersPage() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { register, handleSubmit, reset } = useForm<InviteForm>({ defaultValues: { role: 'rep' } })

  const onSubmit = async (data: InviteForm) => {
    const res = await fetch('/api/admin/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      setMessage('Invitation sent')
      reset({ role: 'rep' })
      setOpen(false)
    } else {
      setMessage('Failed to invite user')
    }
  }

  return (
    <div className='p-4'>
      <Button variant='contained' onClick={() => setOpen(true)}>Invite User</Button>
      {message && <p>{message}</p>}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Invite User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='flex flex-col gap-4'>
            <TextField label='Name' {...register('name', { required: true })} />
            <TextField label='Email' type='email' {...register('email', { required: true })} />
            <TextField select label='Role' {...register('role', { required: true })}>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='rep'>Rep</MenuItem>
              <MenuItem value='user'>User</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type='submit' variant='contained'>Send Invite</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
