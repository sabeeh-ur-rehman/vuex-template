'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import CustomTextField from '@core/components/mui/TextField'
import { apiClient } from '@/utils/apiClient'

interface Lead {
  _id: string
  projectName: string
  jobNo?: string
  status: string
}

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await apiClient.get<{ items: Lead[] }>('/projects', { params: { status: 'lead' } })
        setLeads(data.items)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load leads'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filtered = leads.filter(lead => {
    const term = search.toLowerCase()
    return (
      lead.projectName.toLowerCase().includes(term) ||
      (lead.jobNo ? lead.jobNo.toLowerCase().includes(term) : false)
    )
  })

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box className='text-red-500'>{error}</Box>
  }

  return (
    <Box className='flex flex-col gap-4'>
      <CustomTextField
        placeholder='Search leads'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job No</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(lead => (
              <TableRow key={lead._id} hover>
                <TableCell>{lead.jobNo}</TableCell>
                <TableCell>{lead.projectName}</TableCell>
                <TableCell>{lead.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default LeadsPage
