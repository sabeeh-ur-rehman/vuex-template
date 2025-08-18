'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import CustomTextField from '@core/components/mui/TextField'
import { apiClient } from '@/utils/apiClient'

interface Project {
  _id: string
  name: string
}

const Page = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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

    fetchProjects()
  }, [])

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box className='text-red-500'>{error}</Box>
  }

  return (
    <Box className='flex flex-col gap-4'>
      <CustomTextField
        placeholder='Search projects'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(project => (
              <TableRow key={project._id} hover>
                <TableCell>{project.name}</TableCell>
                <TableCell align='right'>
                  <Button component={Link} href={`/variations/${project._id}`} size='small'>
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Page

