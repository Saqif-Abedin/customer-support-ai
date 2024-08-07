"use client";

import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#1e1e1e', borderBottom: '2px solid black' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'left' }}>
          <span style={{ color: 'white' }}>Support</span>
          <span style={{ color: '#2979ff' }}>Bot</span>
        </Typography>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;