import { Box } from '@mui/material'
import React from 'react'
import SideBar from './sidebar'
import Charts from './charts'
import LineChartComponent from './LineChart'
import LineChartMonth from './LinechartMonth'

function DasHome() {
  return (
    <>
    <Box sx={{  display:'flex'}}>
        <SideBar/>
        <LineChartMonth/>

    </Box>
    </>
    

  )
}

export default DasHome