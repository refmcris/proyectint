import { Box } from '@mui/material'
import React from 'react'
import SideBar from './sidebar'
import Charts from './charts'
import LineChartComponent from './LineChart'
import LineChartMonth from './LinechartMonth'
import Layout from '../../Common/Layout'

function DasHome() {
  return (
    <Layout>
      <LineChartMonth/>
    </Layout>


    
    

  )
}

export default DasHome