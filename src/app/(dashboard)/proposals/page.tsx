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

interface Proposal {
  _id: string
  projectId: string
  customerId: string
  total?: number
}

const Page = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await apiClient.get<{ items: Proposal[] }>('/proposals')

        setProposals(data.items)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load proposals'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  const filtered = proposals.filter(p => p.projectId.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box className='text-red-500'>{error}</Box>
  }

  return (
    <Box className='flex flex-col gap-4'>
      <CustomTextField
        placeholder='Search proposals'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(proposal => (
              <TableRow key={proposal._id} hover>
                <TableCell>{proposal.projectId}</TableCell>
                <TableCell>{proposal.customerId}</TableCell>
                <TableCell>{proposal.total}</TableCell>
                <TableCell align='right'>
                  <Button component={Link} href={`/proposals/${proposal._id}`} size='small'>
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

