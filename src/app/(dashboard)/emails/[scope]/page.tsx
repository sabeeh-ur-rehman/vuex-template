'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

interface EmailLog {
  id: number
  to: string
  subject: string
  date: string
}

const emailData: Record<string, EmailLog[]> = {
  project: [
    { id: 1, to: 'client@example.com', subject: 'Project Update', date: '2024-06-01' }
  ],
  proposal: [
    { id: 2, to: 'client@example.com', subject: 'Proposal Sent', date: '2024-06-05' }
  ],
  variation: [
    { id: 3, to: 'client@example.com', subject: 'Variation Details', date: '2024-06-10' }
  ]
}

const Page = ({ params }: { params: { scope: string } }) => {
  const emails = emailData[params.scope] || []

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
            {emails.map(email => (
              <TableRow key={email.id}>
                <TableCell>{email.to}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{email.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Page

