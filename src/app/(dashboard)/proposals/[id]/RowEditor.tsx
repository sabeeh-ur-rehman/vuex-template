'use client'

import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'

import CustomTextField from '@core/components/mui/TextField'

interface ProposalItem {
  id: number
  name: string
  qty: number
  price: number
  optional?: boolean
  selected?: boolean
}

interface RowEditorProps {
  item: ProposalItem
  showPrices: boolean
  onChange: (item: ProposalItem) => void
}

const RowEditor = ({ item, showPrices, onChange }: RowEditorProps) => {
  const handleChange = (key: keyof ProposalItem, value: any) => {
    onChange({ ...item, [key]: value })
  }

  return (
    <TableRow>
      <TableCell>
        {item.optional && (
          <Checkbox
            checked={item.selected ?? false}
            onChange={e => handleChange('selected', e.target.checked)}
          />
        )}
      </TableCell>
      <TableCell>
        <CustomTextField value={item.name} onChange={e => handleChange('name', e.target.value)} fullWidth />
      </TableCell>
      <TableCell>
        <CustomTextField
          type='number'
          value={item.qty}
          onChange={e => handleChange('qty', Number(e.target.value))}
          sx={{ width: 80 }}
        />
      </TableCell>
      {showPrices && (
        <>
          <TableCell>
            <CustomTextField
              type='number'
              value={item.price}
              onChange={e => handleChange('price', Number(e.target.value))}
              sx={{ width: 100 }}
            />
          </TableCell>
          <TableCell>{(item.qty * item.price).toFixed(2)}</TableCell>
        </>
      )}
    </TableRow>
  )
}

export default RowEditor

