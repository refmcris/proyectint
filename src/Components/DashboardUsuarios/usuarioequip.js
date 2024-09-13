import React from 'react'
import SideBar from '../Dashboard/sidebar'
import { NavLink } from 'react-router-dom';  
import { Box, Button, Link, Typography } from '@mui/material';


function Usuarioequip() {
  return (
    <div>
        <Box>
            <Box sx={{ backgroundColor: '#d01c35', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit' }}>
                            Uninventory
                        </Typography>
                        </NavLink>
                        
                    </Box>
                   
                </Box>
        </Box>

    </div>
  )
}

export default Usuarioequip
