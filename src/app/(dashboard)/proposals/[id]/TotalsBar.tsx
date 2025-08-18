'use client'

import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import CustomTextField from '@core/components/mui/TextField'

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

interface TotalsBarProps {
  sections: ProposalSection[]
  showPrices: boolean
  onShowPricesChange: (value: boolean) => void
  adjustment: number
  onAdjustmentChange: (value: number) => void
  subtotal?: number
  total?: number
}

const TotalsBar = ({
  sections,
  showPrices,
  onShowPricesChange,
  adjustment,
  onAdjustmentChange,
  subtotal,
  total,
}: TotalsBarProps) => {
  const calculatedSubtotal = sections.reduce((sum, section) => {
    return (
      sum +
      section.items.reduce((s, item) => {
        if (item.optional && !item.selected) return s

        return s + item.qty * item.price
      }, 0)
    )
  }, 0)

  const displaySubtotal = subtotal ?? calculatedSubtotal
  const displayTotal = total ?? displaySubtotal + adjustment

  return (
    <Box className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end'>
      <FormControlLabel
        control={<Switch checked={showPrices} onChange={e => onShowPricesChange(e.target.checked)} />}
        label='Show Prices'
      />
      {showPrices && (
        <>
          <Box className='flex items-center gap-2'>
            <span>Adjustment</span>
            <CustomTextField
              type='number'
              value={adjustment}
              onChange={e => onAdjustmentChange(Number(e.target.value))}
              sx={{ width: 120 }}
            />
          </Box>
          <Box className='text-right'>
            <div>Subtotal: {displaySubtotal.toFixed(2)}</div>
            <div>Total: {displayTotal.toFixed(2)}</div>
          </Box>
        </>
      )}
    </Box>
  )
}

export default TotalsBar

