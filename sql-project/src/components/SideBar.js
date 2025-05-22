import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const collapsedWidth = 60;

function SideBar() {
  const location = useLocation();
  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Questions', path: '/questions' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsedWidth,
        transition: 'width 0.3s',
        overflowX: 'hidden',
        '&:hover': {
          width: drawerWidth,
        },
        '& .MuiDrawer-paper': {
          width: collapsedWidth,
          bgcolor: '#1e1e2f',
          color: '#ffffff',
          overflowX: 'hidden',
          transition: 'width 0.3s',
          boxSizing: 'border-box',
          '&:hover': {
            width: drawerWidth,
          },
        },
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          {menuItems.map(item => (
            <Tooltip title={item.text} placement="right" key={item.text}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2.5,
                  '&.Mui-selected': {
                    bgcolor: '#333354',
                  },
                  '&.Mui-selected:hover': {
                    bgcolor: '#444467',
                  },
                  '&:hover': {
                    bgcolor: '#2c2c3e',
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '.MuiDrawer-root:hover &': {
                      opacity: 1,
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default SideBar;