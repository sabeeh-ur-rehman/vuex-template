'use client'

import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

import { apiClient } from '@/utils/apiClient'

type ListItem = {
  id?: string
  _id?: string
  messageId?: string
  tenantId?: string
  // some backends might already include these
  to?: string
  subject?: string
  date?: string
}

type EmailDetail = {
  id?: string
  _id?: string
  messageId?: string
  to: string
  subject: string
  date: string
}

type ListResponse = {
  items: ListItem[]
  // any of these might exist depending on backend
  totalPages?: number
  total?: number
  page?: number
  pageSize?: number
}

const Page = ({ params }: { params: { scope: string } }) => {
  const { scope } = params

  const [rows, setRows] = useState<EmailDetail[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const computeTotalPages = (resp: ListResponse): number => {
    if (resp.totalPages && resp.totalPages > 0) return resp.totalPages
    if (resp.total && resp.pageSize) {
      return Math.max(1, Math.ceil(resp.total / resp.pageSize))
    }
    return 1
  }

  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const list = await apiClient.get<ListResponse>('/emails', {
          params: { scope, page },
          signal: ctrl.signal as any,
        })

        const items = Array.isArray(list.items) ? list.items : []
        const tPages = computeTotalPages(list)

        // If the list already includes details, map directly; otherwise hydrate.
        const needsHydration = items.some(
          it => it.to === undefined || it.subject === undefined || it.date === undefined
        )

        let hydrated: EmailDetail[] = []
        if (!needsHydration) {
          hydrated = items.map(it => ({
            id: (it.id ?? it._id ?? it.messageId) as string | undefined,
            _id: it._id,
            messageId: it.messageId ?? (it.id as string | undefined),
            to: String(it.to ?? ''),
            subject: String(it.subject ?? ''),
            date: String(it.date ?? ''),
          }))
        } else {
          // Fetch details per messageId
          const detailPromises = items.map(async it => {
            const key = (it.messageId ?? it.id ?? it._id) as string | undefined
            if (!key) {
              return {
                id: undefined,
                _id: undefined,
                messageId: undefined,
                to: '',
                subject: '',
                date: '',
              }
            }
            const detail = await apiClient.get<EmailDetail>(`/emails/${encodeURIComponent(key)}`, {
              signal: ctrl.signal as any,
            })
            return {
              id: (detail.id ?? detail._id ?? detail.messageId ?? key) as string | undefined,
              _id: detail._id,
              messageId: detail.messageId ?? key,
              to: String(detail.to ?? ''),
              subject: String(detail.subject ?? ''),
              date: String(detail.date ?? ''),
            }
          })

          hydrated = await Promise.all(detailPromises)
        }

        if (!cancelled) {
          setRows(hydrated)
          setTotalPages(tPages)
        }
      } catch (e: any) {
        if (!cancelled) {
          setRows([])
          setTotalPages(1)
          setError(e?.message || 'Failed to load emails')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      ctrl.abort()
    }
  }, [scope, page])

  const handlePageChange = (_: unknown, value: number) => setPage(value)

  const isEmpty = useMemo(() => !loading && rows.length === 0, [loading, rows])

  return (
    <Box className="flex flex-col gap-4">
      {error && <Alert severity="error">{error}</Alert>}

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={22} />
                </TableCell>
              </TableRow>
            ) : isEmpty ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No email logs found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((email) => (
                <TableRow key={email.id ?? email._id ?? email.messageId}>
                  <TableCell>{email.to}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{email.date}</TableCell>
                </TableRow>
              ))
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
