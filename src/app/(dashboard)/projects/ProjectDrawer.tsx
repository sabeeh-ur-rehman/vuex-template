'use client'

import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Custom Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TabList from '@core/components/mui/TabList'

interface ProjectDrawerProps {
  open: boolean
  onClose: () => void
}

const ProjectDrawer = ({ open, onClose }: ProjectDrawerProps) => {
  const [tab, setTab] = useState('steps')
  const [name, setName] = useState('')
  const [steps, setSteps] = useState<string[]>([''])

  const handleStepChange = (index: number, value: string) => {
    setSteps(prev => prev.map((step, i) => (i === index ? value : step)))
  }

  const addStep = () => {
    setSteps(prev => [...prev, ''])
  }

  const handleSave = () => {
    onClose()
  }

  return (
    <Drawer anchor='right' open={open} onClose={onClose} keepMounted>
      <Box className='flex flex-col gap-4 p-6 is-[400px]'>
        <Typography variant='h6'>New Project</Typography>
        <CustomTextField
          fullWidth
          label='Project Name'
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <TabContext value={tab}>
          <TabList onChange={(e, value) => setTab(value)} aria-label='project tabs'>
            <Tab value='steps' label='Steps' />
            <Tab value='preview' label='Reminder Preview' />
          </TabList>
          <TabPanel value='steps'>
            <Grid container spacing={2}>
              {steps.map((step, index) => (
                <Grid item xs={12} key={index}>
                  <CustomTextField
                    fullWidth
                    label={`Step ${index + 1}`}
                    value={step}
                    onChange={e => handleStepChange(index, e.target.value)}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button size='small' variant='outlined' onClick={addStep}>
                  Add Step
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value='preview'>
            <Typography variant='body2'>Reminder preview:</Typography>
            <ul className='list-disc ms-4'>
              {steps.filter(step => step).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </TabPanel>
        </TabContext>

        <Box className='flex justify-end gap-2 mt-4'>
          <Button variant='tonal' color='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' disabled={!name} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ProjectDrawer

