import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Externos from './externos';
import Internos from './internos';
import SideBar from './sidebar';
import Layout from '../../Common/Layout';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function TabbedTable() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
        
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              marginTop: '50px',
              marginBottom: 1,
              '& .MuiTab-root': {
                color: '#333',
                fontWeight: 'bold',
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#1976d2',
              },
            }}
          >
            <Tab label="Externos" sx={{ minWidth: 120 }} />
            <Tab label="Internos" sx={{ minWidth: 120 }} />
          </Tabs>
          

          <TabPanel value={value} index={0}sx={{ p: 0, mb: 2 }}>
          
            <Externos />
          </TabPanel>
          <TabPanel value={value} index={1}sx={{ p: 0, mb: 2 }}>
            <Internos />
          </TabPanel>
        </Box>
      </Box>


    </Layout>
    
  );
}

export default TabbedTable;
