import { useState } from 'react';
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  Home,
  AccountBalance,
  WaterDrop,
  ContactMail,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import './side.css';
import logo from '../assets/logoupadated.png';

const NAV_ITEMS = [
  { path: '/home', label: 'Home (Visit HydroGuard)', icon: Home },
  { path: '/', label: 'See Dams & Reservoir', icon: AccountBalance },
  { path: '/canal', label: 'Canal Loss', icon: WaterDrop },
  { path: '/contact', label: 'Contact Us', icon: ContactMail },
];

function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  const isNavActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/dam') || location.pathname.startsWith('/cordid') || location.pathname.startsWith('/polygon');
    }
    return location.pathname.startsWith(path);
  };

  const navList = (
    <nav className="sidebar-nav">
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const active = isNavActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={handleCloseDrawer}
          >
            <IconComponent className="nav-icon" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Top Header (Screens < 1024px) */}
      <Box sx={{ display: { xs: 'flex', lg: 'none' } }} className="mobile-header">
        <Link to="/home" className="mobile-logo-wrap">
          <img src={logo} alt="HydroGuard Logo" className="mobile-logo" />
          <Typography className="mobile-title">HydroGuard</Typography>
        </Link>
        <IconButton
          color="inherit"
          aria-label="open navigation drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ color: '#1B3B6F', p: 1 }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Sliding Drawer with Backdrop */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleCloseDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            borderRight: '1px solid #E2E8F0',
          },
        }}
      >
        <div className="mobile-drawer-content">
          <div>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #F1F5F9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={logo} alt="Logo" style={{ height: 36, width: 'auto' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B3B6F' }}>
                  HydroGuard
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDrawer} size="small" sx={{ color: '#64748B' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ px: 2, pt: 1.5 }}>
              <Chip
                label="Jal Shakti Platform"
                size="small"
                sx={{
                  bgcolor: 'rgba(39, 76, 119, 0.08)',
                  color: '#274C77',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            </Box>

            {navList}
          </div>

          <div className="sidebar-footer">
            <Typography variant="caption" className="sidebar-footer-text">
              © {new Date().getFullYear()} Ministry of Jal Shakti<br />Team Chakravyuh
            </Typography>
          </div>
        </div>
      </Drawer>

      {/* Desktop Persistent Sidebar (Screens >= 1024px) */}
      <Box sx={{ display: { xs: 'none', lg: 'flex' } }} className="desktop-sidebar">
        <div>
          <div className="sidebar-header">
            <Link to="/home">
              <img src={logo} alt="HydroGuard Logo" className="sidebar-logo" />
            </Link>
            <span className="sidebar-badge">Ministry of Jal Shakti</span>
          </div>

          {navList}
        </div>

        <div className="sidebar-footer">
          <Typography variant="caption" className="sidebar-footer-text">
            © {new Date().getFullYear()} HydroGuard Telemetry<br />Made with ❤️ by Team Chakravyuh
          </Typography>
        </div>
      </Box>
    </>
  );
}

export default Sidebar;