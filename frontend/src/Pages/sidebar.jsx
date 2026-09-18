import { Drawer, List, ListItemButton, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Home, AccountBalance, WaterDrop, ContactMail } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './side.css'; 
import logo from '../assets/logoupadated.png';

function Sidebar() {
  return (
    <Drawer
    anchor="left"
    open={true} // Sidebar is always open
    hideBackdrop // Disable the backdrop
    variant="persistent" 
    sx={{
      '& .MuiDrawer-paper': {
        backgroundColor: ' rgb(242, 249, 251);', 
        width: '22vw',
        height: '100vh',
        boxSizing: 'border-box',
        pointerEvents: 'auto', 
        position: 'fixed', // Prevent affecting layout flow
        overflowY: 'auto', // Enable sidebar scrolling
        zIndex: 2,
      },
    }}
  >
      <Box sx={{ width: '21vw', padding: 2 }}>
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <Divider className="drawer-divider" sx={{ my: 2 }} />

        <List className="opt" sx={{ mx: 1 }}>
          <Link to="/home" className="link">
            <ListItemButton sx={{ borderRadius: 2, my: 0.5 }}>
              <Home sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Home (Visit HydroGuard)" />
            </ListItemButton>
          </Link>
          <Link to="/" className="link">
            <ListItemButton sx={{ borderRadius: 2, my: 0.5 }}>
              <AccountBalance sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="See Dams & Reservoir" />
            </ListItemButton>
          </Link>
          <Link to="/canal" className="link">
            <ListItemButton sx={{ borderRadius: 2, my: 0.5 }}>
              <WaterDrop sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Canal Loss" />
            </ListItemButton>
          </Link>
          <Link to="/contact" className="link">
            <ListItemButton sx={{ borderRadius: 2, my: 0.5 }}>
              <ContactMail sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Contact Us" />
            </ListItemButton>
          </Link>
        </List>

        <Divider className="drawer-divider" sx={{ my: 2 }} />
        <Typography variant="caption" className="drawer-footer">
          © {new Date().getFullYear()} Made with ❤️ by Team Chakravyuh
        </Typography>
      </Box>
    </Drawer>
  );
}

export default Sidebar;