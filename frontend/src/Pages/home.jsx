import React from 'react';
import { Box, Paper, Grid2 as Grid, Typography, Button, Card, CardContent, Divider, Chip } from '@mui/material';
import { AccountBalance, WaterDrop, ChevronRight, ShowChart, Agriculture, Compare, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Headerimage from '../assets/headerimage.jpg';
import './home.css';

export default function BasicPageContainer() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', paddingLeft: '23vw', paddingRight: '22vw', paddingTop: '2vw', paddingBottom: '4vw', boxSizing: 'border-box', backgroundColor: '#F4F7F9' }}>
      <Paper elevation={0} sx={{ borderRadius: '16px', padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Welcome Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Chip label="HydroGuard Process Workflow" color="primary" sx={{ bgcolor: '#274C77', fontWeight: 'bold', mb: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#274C77', mb: 1 }}>
            Visit HydroGuard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Intelligent Dam Management, Command Area Water Need & Canal Loss Analytics
          </Typography>
        </Box>

        <Box sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden', maxHeight: '300px' }}>
          <img src={Headerimage} alt="HydroGuard Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>

        {/* Primary Tracks from Process Flow Diagram */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#274C77', mb: 2 }}>
          Choose Process Flow Pathway
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
          {/* Pathway 1: See Dams & Reservoir */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid #E0E7FF', background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4F8 100%)', boxShadow: '0 4px 12px rgba(39,76,119,0.08)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ bgcolor: '#274C77', color: 'white', p: 1.5, borderRadius: '10px', mr: 2 }}>
                    <AccountBalance fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                      See Dams & Reservoir
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Track 1: Dam Insights & Crop Water Needs
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Explore interactive dams map, inspect live water cover & storage volume, calculate command area, select crop types, and compare crop water requirements.
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  <Chip icon={<ShowChart />} label="Real Time Graphs" size="small" variant="outlined" />
                  <Chip icon={<Agriculture />} label="Command Area & Crops" size="small" variant="outlined" />
                  <Chip icon={<Compare />} label="Water Need & Compare" size="small" variant="outlined" />
                </Box>

                <Button component={Link} to="/" variant="contained" endIcon={<ArrowForward />} sx={{ bgcolor: '#274C77', '&:hover': { bgcolor: '#1D3859' }, borderRadius: '8px', py: 1, mt: 'auto' }}>
                  Go to Dams & Reservoirs
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Pathway 2: Canal Loss */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid #E0E7FF', background: 'linear-gradient(135deg, #FFFFFF 0%, #EBF4FB 100%)', boxShadow: '0 4px 12px rgba(39,76,119,0.08)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ bgcolor: '#274C77', color: 'white', p: 1.5, borderRadius: '10px', mr: 2 }}>
                    <WaterDrop fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                      Canal Loss
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Track 2: Seepage & Evaporation Analysis
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Input canal dimensions, soil parameters, seepage coefficient ($Q_e$), and lining type to calculate seepage loss, evaporation loss, and canal efficiency.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  <Chip label="Enter Parameters" size="small" variant="outlined" />
                  <Chip label="Seepage Loss" size="small" variant="outlined" />
                  <Chip label="Analyze Losses" size="small" variant="outlined" />
                </Box>

                <Button component={Link} to="/canal" variant="contained" endIcon={<ArrowForward />} sx={{ bgcolor: '#274C77', '&:hover': { bgcolor: '#1D3859' }, borderRadius: '8px', py: 1, mt: 'auto' }}>
                  Analyze Canal Loss
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Process Flow Diagram Visualization Card */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#274C77', mb: 2 }}>
          Process Flow Architecture
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px', bgcolor: '#FAFCFE', mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Step 1 */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #CBD5E1', borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#274C77' }}>1. Visit HydroGuard</Typography>
                <Typography variant="caption" color="textSecondary">Select pathway (Dams or Canals)</Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 1 }} sx={{ textAlign: 'center' }}>
              <ChevronRight color="action" />
            </Grid>

            {/* Step 2 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2, border: '1px solid #CBD5E1', borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#274C77', mb: 1 }}>2. Track Pathways</Typography>
                <Typography variant="caption" display="block">• <strong>See Dams & Reservoir</strong> → Click Dam → Real Time Graphs & Command Area</Typography>
                <Typography variant="caption" display="block">• <strong>Canal Loss</strong> → Enter Parameters → Analyze Losses</Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 1 }} sx={{ textAlign: 'center' }}>
              <ChevronRight color="action" />
            </Grid>

            {/* Step 3 */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #CBD5E1', borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#274C77' }}>3. Decision & Compare</Typography>
                <Typography variant="caption" color="textSecondary">Crop Water Need vs Dam Capacity & Loss Mitigation</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Section: Platform Overview */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#274C77', mb: 2 }}>
          Transforming Dam and Reservoir Management
        </Typography>
        <Typography paragraph color="textSecondary">
          HydroGuard is a cutting-edge platform designed to ensure the safety, efficiency, and sustainability of dams and reservoirs. With aging infrastructure facing climate change and shifting agricultural practices, HydroGuard delivers advanced analytical tools for real-time monitoring and water resource optimization.
        </Typography>

      </Paper>
    </Box>
  );
}

