'use client'

import { useState } from 'react'

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
  id: number
  name: string
  status: 'Active' | 'Archived'
}

const initialData: Project[] = [
  { id: 1, name: 'Website Redesign', status: 'Active' },
  { id: 2, name: 'Mobile App', status: 'Archived' }
]

const Page = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('All')
  const [open, setOpen] = useState(false)

  const filtered = initialData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(project => (
              <TableRow key={project.id} hover>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProjectDrawer open={open} onClose={() => setOpen(false)} />
    </Box>
  )
}

export default Page

