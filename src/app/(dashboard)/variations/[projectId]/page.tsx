'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// Custom Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { apiClient } from '@/utils/apiClient'

interface Variation {
  _id: string
  name: string
  status: 'Draft' | 'Sent'
}

interface VariationItem {
  id?: string
  description: string
  qty: number
  price: number
}

function VariationBuilder({ variation, onClose }: { variation: Variation; onClose: () => void }) {
  const [items, setItems] = useState<VariationItem[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await apiClient.get<Variation & { items: VariationItem[] }>(`/variations/${variation._id}`)

        setItems(data.items || [])
      } catch {
        setItems([])
      }
    }

    fetchItems()
  }, [variation._id])

  const handleItemChange = (index: number, field: keyof VariationItem, value: string) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === 'qty' || field === 'price' ? Number(value) : value }
          : item
      )
    )
  }

  const handleSave = async () => {
    try {
      await apiClient.put(`/variations/${variation._id}`, { items })
      alert('Variation saved')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save variation'

      alert(message)
    }
  }

  const handleGeneratePdf = async () => {
    try {
      const { link } = await apiClient.post<{ link: string }>(`/variations/${variation._id}/pdf`)

      if (link) window.open(link, '_blank')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate PDF'

      alert(message)
    }
  }

  const handleSendEmail = async () => {
    const to = window.prompt('Recipient email')

    if (!to) return

    try {
      await apiClient.post(`/variations/${variation._id}/send-email`, { to })
      alert('Email sent')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send email'

      alert(message)
    }
  }

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0)

  return (
    <Box className='flex flex-col gap-4 mt-4'>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell>
                  <CustomTextField
                    value={item.description}
                    onChange={e => handleItemChange(index, 'description', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <CustomTextField
                    type='number'
                    value={item.qty}
                    onChange={e => handleItemChange(index, 'qty', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <CustomTextField
                    type='number'
                    value={item.price}
                    onChange={e => handleItemChange(index, 'price', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>{total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box className='flex gap-2 justify-end'>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
        <Button variant='outlined' onClick={handleGeneratePdf}>
          Generate PDF
        </Button>
        <Button variant='contained' onClick={handleSendEmail}>
          Send Email
        </Button>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Box>
  )
}

const Page = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params
  const [variations, setVariations] = useState<Variation[]>([])
  const [selected, setSelected] = useState<Variation | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const data = await apiClient.get<{ items: Variation[] }>('/variations', {
          params: { projectId },
        })

        setVariations(data.items)
      } catch {
        setVariations([])
      }
    }

    fetchVariations()
  }, [projectId])

  const filtered = variations.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Box className='flex flex-col gap-4'>
      <Box className='font-medium'>Variations for project {projectId}</Box>
      <CustomTextField
        placeholder='Search variations'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(variation => (
              <TableRow key={variation._id} hover>
                <TableCell>{variation.name}</TableCell>
                <TableCell>{variation.status}</TableCell>
                <TableCell align='right'>
                  <Button size='small' onClick={() => setSelected(variation)}>
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selected && <VariationBuilder variation={selected} onClose={() => setSelected(null)} />}
    </Box>
  )
}

export default Page
