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

interface Customer {
  _id: string
  customerName: string
  contact?: {
    email1?: string
    mobile1?: string
  }
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiClient.get<Customer[]>('/crm/customers')
        setCustomers(data)
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load customers'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filtered = customers.filter(c => {
    const term = search.toLowerCase()
    return (
      c.customerName.toLowerCase().includes(term) ||
      (c.contact?.email1 ? c.contact.email1.toLowerCase().includes(term) : false) ||
      (c.contact?.mobile1 ? c.contact.mobile1.toLowerCase().includes(term) : false)
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
        placeholder='Search customers'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(customer => (
              <TableRow key={customer._id} hover>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>{customer.contact?.email1}</TableCell>
                <TableCell>{customer.contact?.mobile1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CustomersPage

