'use client'

import { useState } from 'react'

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

interface Variation {
  id: number
  name: string
  status: 'Draft' | 'Sent'
}

interface VariationItem {
  id: number
  description: string
  qty: number
  price: number
}

const initialVariations: Variation[] = [
  { id: 1, name: 'Base Variation', status: 'Draft' },
  { id: 2, name: 'Premium Variation', status: 'Sent' }
]

const initialItems: VariationItem[] = [
  { id: 1, description: 'Item A', qty: 1, price: 100 },
  { id: 2, description: 'Item B', qty: 2, price: 50 }
]

function VariationBuilder({ variation, onClose }: { variation: Variation; onClose: () => void }) {
  const [items] = useState<VariationItem[]>(initialItems)

  const handleGeneratePdf = () => {
    // Placeholder for PDF generation logic
    alert(`Generated PDF for ${variation.name}`)
  }

  const handleSendEmail = () => {
    // Placeholder for email sending logic
    alert(`Email sent for ${variation.name}`)
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
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{item.price}</TableCell>
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
  const [variations] = useState<Variation[]>(initialVariations)
  const [selected, setSelected] = useState<Variation | null>(null)
  const [search, setSearch] = useState('')

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
              <TableRow key={variation.id} hover>
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
