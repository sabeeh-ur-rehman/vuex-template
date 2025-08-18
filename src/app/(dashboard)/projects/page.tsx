'use client'

import { useEffect, useState } from 'react'

import { apiClient } from '@/utils/apiClient'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// Custom Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Local Component Imports
import ProjectDrawer from './ProjectDrawer'

interface Project {
  _id: string
  name: string
  status?: 'Active' | 'Archived'
}

const Page = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('All')
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<{ items: Project[] }>('/projects')
      setProjects(data.items)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await apiClient.del(`/projects/${id}`)
      setProjects(prev => prev.filter(project => project._id !== id))
    } catch (err) {
      // ignore errors for simplicity
    }
  }

  const handleToggleStatus = async (project: Project) => {
    try {
      const newStatus = project.status === 'Archived' ? 'Active' : 'Archived'
      const updated = await apiClient.put<Project>(`/projects/${project._id}`, { status: newStatus })
      setProjects(prev => prev.map(p => (p._id === project._id ? updated : p)))
    } catch (err) {
      // ignore errors for simplicity
    }
  }

  const filtered = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box className='text-red-500'>{error}</Box>
  }

  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Box className='flex gap-2'>
          <CustomTextField
            placeholder='Search projects'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <CustomTextField
            select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value='All'>All</MenuItem>
            <MenuItem value='Active'>Active</MenuItem>
            <MenuItem value='Archived'>Archived</MenuItem>
          </CustomTextField>
        </Box>
        <Button variant='contained' onClick={() => setOpen(true)}>
          New Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(project => (
              <TableRow key={project._id} hover>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  <Button
                    size='small'
                    variant='text'
                    onClick={() => handleToggleStatus(project)}
                  >
                    {project.status === 'Archived' ? 'Activate' : 'Archive'}
                  </Button>
                  <Button
                    size='small'
                    color='error'
                    variant='text'
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProjectDrawer
        open={open}
        onClose={() => setOpen(false)}
        onCreated={fetchProjects}
      />
    </Box>
  )
}

export default Page

