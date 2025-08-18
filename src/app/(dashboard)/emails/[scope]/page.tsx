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
import Pagination from '@mui/material/Pagination'

import { apiClient } from '@/utils/apiClient'

interface EmailLog {
  id?: string | number
  _id?: string
  to: string
  subject: string
  date: string
}

const Page = ({ params }: { params: { scope: string } }) => {
  const { scope } = params
  const [emails, setEmails] = useState<EmailLog[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const data = await apiClient.get<{
          items: EmailLog[]
          totalPages?: number
        }>('/emails', { params: { scope, page } })

        setEmails(data.items)
        setTotalPages(data.totalPages ?? 1)
      } catch {
        setEmails([])
        setTotalPages(1)
      }
    }

    fetchEmails()
  }, [scope, page])

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value)
  }

  return (
    <Box className='flex flex-col gap-4'>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>To</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.length > 0 ? (
              emails.map(email => (
                <TableRow key={email.id ?? email._id}>
                  <TableCell>{email.to}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{email.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  No email logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      )}
    </Box>
  )
}

export default Page

