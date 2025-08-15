'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import RowEditor from './RowEditor'

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

interface SectionCardProps {
  section: ProposalSection
  showPrices: boolean
  find: string
  onChange: (section: ProposalSection) => void
}

const SectionCard = ({ section, showPrices, find, onChange }: SectionCardProps) => {
  const handleItemChange = (item: ProposalItem) => {
    const items = section.items.map(i => (i.id === item.id ? item : i))

    onChange({ ...section, items })
  }

  const filtered = section.items.filter(item => item.name.toLowerCase().includes(find.toLowerCase()))

  return (
    <Card>
      <CardHeader
        title={section.title}
        action={
          <FormControlLabel
            control={<Switch checked={section.complete} onChange={e => onChange({ ...section, complete: e.target.checked })} />}
            label='Complete'
          />
        }
      />
      <CardContent>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell width={80}>Qty</TableCell>
              {showPrices && (
                <>
                  <TableCell width={100}>Price</TableCell>
                  <TableCell width={100}>Total</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(item => (
              <RowEditor key={item.id} item={item} showPrices={showPrices} onChange={handleItemChange} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default SectionCard

