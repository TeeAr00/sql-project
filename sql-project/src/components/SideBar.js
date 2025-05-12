import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import { Link } from 'react-router-dom';

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
      <Box sx={{ mt: 8 }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/questions">
            <ListItemText primary="Questions" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default SideBar;