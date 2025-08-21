import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const drawerWidth = 240;
const collapsedWidth = 60;

function SideBar() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === 'admin');
      } catch (err) {
        console.error('Invalid token:', err);
        setIsAdmin(false);
      }
    }
  }, []);

  const menuItems = [
    { text: 'Aloitus', path: '/Home' },
    { text: 'Harjoittelu', path: '/sandboxTests' },
    { text: 'Tehtävät', path: '/questions' },
    { text: 'Tehtävät 2', path: '/exercises2' },
    { text: 'Tulokset', path: '/scores' },
    ...(isAdmin ? [
    { text: 'Luo tehtäviä', path: '/createTests' },
    { text: 'Muokkaa tehtäväsettejä', path: '/editSets' },
  ] : []),
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
                  },
                  '&.Mui-selected:hover': {
                  },
                  '&:hover': {
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