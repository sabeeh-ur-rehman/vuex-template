'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import CustomTextField from '@core/components/mui/TextField'
import { apiClient } from '@/utils/apiClient'

import SectionCard from './SectionCard'
import TotalsBar from './TotalsBar'

interface ProposalItem {
  id: number
  name: string
  qty: number
  price: number
  optional?: boolean
  selected?: boolean
}

interface ProposalSection {
  id: number
  title: string
  complete: boolean
  items: ProposalItem[]
}

interface ProposalData {
  sections?: ProposalSection[]
  showPrices?: boolean
  adjustment?: number
  subtotal?: number
  total?: number
}

const Page = () => {
  const { id } = useParams<{ id: string }>()

  const [sections, setSections] = useState<ProposalSection[]>([])
  const [showPrices, setShowPrices] = useState(true)
  const [adjustment, setAdjustment] = useState(0)
  const [find, setFind] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [snackError, setSnackError] = useState(false)
  const [totals, setTotals] = useState<{ subtotal: number; total: number } | null>(null)

  const fetchProposal = useCallback(async () => {
    try {
      setLoading(true)

      const data = await apiClient.get<ProposalData>(`/proposals/${id}`)

      setSections(data.sections ?? [])
      setShowPrices(data.showPrices ?? true)
      setAdjustment(data.adjustment ?? 0)

      if (data.subtotal !== undefined || data.total !== undefined) {
        setTotals({ subtotal: data.subtotal ?? 0, total: data.total ?? 0 })
      }

      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load proposal'

      setError(message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) fetchProposal()
  }, [id, fetchProposal])

  const saveProposal = async (payload: Partial<ProposalData>) => {
    try {
      const updated = await apiClient.put<ProposalData>(`/proposals/${id}`, payload)

      setSections(updated.sections ?? sections)
      setShowPrices(updated.showPrices ?? showPrices)
      setAdjustment(updated.adjustment ?? adjustment)

      if (updated.subtotal !== undefined || updated.total !== undefined) {
        setTotals({ subtotal: updated.subtotal ?? 0, total: updated.total ?? 0 })
      }

      setSnackError(false)
      setMessage('Saved')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save'

      setSnackError(true)
      setMessage(msg)
    }
  }

  const handleSectionChange = (section: ProposalSection) => {
    const updatedSections = sections.map(s => (s.id === section.id ? section : s))

    setSections(updatedSections)

    saveProposal({ sections: updatedSections })
  }

  const handleShowPricesChange = (value: boolean) => {
    setShowPrices(value)

    saveProposal({ showPrices: value })
  }

  const handleAdjustmentChange = (value: number) => {
    setAdjustment(value)

    saveProposal({ adjustment: value })
  }

  if (loading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box className='text-red-500'>{error}</Box>
  }

  return (
    <Box className='flex flex-col gap-4'>
      <CustomTextField
        placeholder='Find'
        value={find}
        onChange={e => setFind(e.target.value)}
        fullWidth
      />
      {sections.map(section => (
        <SectionCard
          key={section.id}
          section={section}
          showPrices={showPrices}
          find={find}
          onChange={handleSectionChange}
        />
      ))}
      <TotalsBar
        sections={sections}
        showPrices={showPrices}
        onShowPricesChange={handleShowPricesChange}
        adjustment={adjustment}
        onAdjustmentChange={handleAdjustmentChange}
        subtotal={totals?.subtotal}
        total={totals?.total}
      />
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage(null)} severity={snackError ? 'error' : 'success'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Page

