import Map from './Pages/gui.jsx';  
import './App.css';
import { createBrowserRouter, RouterProvider, useRouteError, Link } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Header from './Pages/header.jsx';
import Home from './Pages/home.jsx';
import Int from './Pages/interface.jsx';
import Sign from './Pages/signin.jsx';
import Dam from './Pages/dam.jsx';
import Litter from './Pages/litter.jsx';
import Prediction from './Pages/prediction.jsx';
import Cords from './Pages/cordinates';
import ContactUsForm from './Pages/contact.jsx';
import Cordid from './Pages/cordid.jsx';
import Canal from './Pages/canal.jsx';
import { Box, Typography, Button } from '@mui/material';

function ErrorFallback() {
  const error = useRouteError();
  console.error("Route Error:", error);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', p: 3 }}>
      <Typography variant="h4" sx={{ color: '#274C77', mb: 2, fontWeight: 'bold' }}>
        HydroGuard
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
        An unexpected application error occurred.
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ backgroundColor: '#274C77' }}>
        Return to Dashboard
      </Button>
    </Box>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      errorElement: <ErrorFallback />,
      element: (
        <AppLayout><Map /></AppLayout>
      ),
    },
    {
      path: '/home',
      element: (
        <AppLayout><Home /></AppLayout>
      ),
    },
    {
      path: '/contact',
      element: (
        <AppLayout><ContactUsForm /></AppLayout>
      ),
    },
    {
      path: '/canal',
      element: (
        <AppLayout><Canal /></AppLayout>
      ),
    },
    {
      path: '/dam/:damId',
      element: (
        <AppLayout><Dam /></AppLayout>
      ),
    },
    {
      path: '/cordid/:damId',
      element: (
        <AppLayout><Cordid /></AppLayout>
      ),
    },
    {
      path: '/polygon/:coordinates',
      element: (
        <AppLayout><Cords /></AppLayout>
      ),
    },
    {
      path: '/litter',
      element: (
        <AppLayout><Litter /></AppLayout>
      ),
    },
    {
      path: '/prediction',
      element: (
        <AppLayout><Prediction /></AppLayout>
      ),
    },
    {
      path: '/header',
      element: <Header />
    },
    {
      path: '/interface',
      element: <Int /> 
    },
    {
      path: '/signin',
      element: <Sign />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;