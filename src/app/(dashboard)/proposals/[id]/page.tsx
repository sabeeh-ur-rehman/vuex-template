'use client'

import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'

// Local Components
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

const initialSections: ProposalSection[] = [
  {
    id: 1,
    title: 'General',
    complete: false,
    items: [
      { id: 1, name: 'Item A', qty: 1, price: 100 },
      { id: 2, name: 'Item B', qty: 2, price: 50, optional: true, selected: false }
    ]
  },
  {
    id: 2,
    title: 'Extras',
    complete: false,
    items: [
      { id: 3, name: 'Item C', qty: 3, price: 75 },
      { id: 4, name: 'Item D', qty: 1, price: 200, optional: true, selected: true }
    ]
  }
]

const Page = () => {
  const [sections, setSections] = useState<ProposalSection[]>(initialSections)
  const [showPrices, setShowPrices] = useState(true)
  const [adjustment, setAdjustment] = useState(0)
  const [find, setFind] = useState('')

  const handleSectionChange = (section: ProposalSection) => {
    setSections(prev => prev.map(s => (s.id === section.id ? section : s)))
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
        onShowPricesChange={setShowPrices}
        adjustment={adjustment}
        onAdjustmentChange={setAdjustment}
      />
    </Box>
  )
}

export default Page

