import React from 'react';
import {Drawer, Box, Button, Toolbar, Typography } from '@mui/material'

const drawerWidth = 240;

function SideBar (){
    return (
        <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sidebar
        </Typography>
        <Button variant="contained" fullWidth sx={{ mb: 1 }}> 
          Select 1  
        </Button>
        <Button variant="outlined" fullWidth>
          Select 2
        </Button>
      </Box>
    </Drawer>
  );
}

export default SideBar;