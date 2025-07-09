'use client';
import React from 'react';
import {
  AppBar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import Grid from '@mui/material/Grid2';
import styles from './styles.module.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItem = [
    {
      id: '1',
      name: 'Dashboard',
    },
    ,
    {
      id: '2',
      name: 'Projects',
    },
    {
      id: '3',
      name: 'Issues',
    },
    {
      id: '4',
      name: 'Reports',
    },
  ];
  const menuIcon = [
    {
      id: '1',
      name: <SearchIcon />,
    },
    ,
    {
      id: '2',
      name: <NotificationsIcon />,
    },
    {
      id: '3',
      name: <SettingsIcon />,
    },
    {
      id: '4',
      onClick: handleMenuOpen,
      name: (
        <Avatar
          alt="Z"
          src="/user-avatar.jpg"
          style={{ width: 32, height: 32 }}
        />
      ),
    },
  ];

  return (
    <AppBar className={styles.AppBar}>
      <Grid container className={styles.containGrid}>
        <Grid className={styles.grid} container spacing={3}>
          <Grid className={styles.grid}>
            <IconButton color="inherit">
              <AutoFixHigh />
            </IconButton>
          </Grid>

          {menuItem.map((item,index) => (
            <Typography key={index} variant="body1" style={{ cursor: 'pointer' }}>
              {item.name}
            </Typography>
          ))}
        </Grid>

        <Grid className={styles.grid} container spacing={3}>
          {menuIcon.map((icon,index) => (
            <IconButton  key={index} onClick={icon?.onClick} color="inherit">
              {icon.name}
            </IconButton>
          ))}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Header;
