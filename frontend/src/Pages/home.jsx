import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  AccountBalance,
  WaterDrop,
  ChevronRight,
  ShowChart,
  Agriculture,
  Compare,
  ArrowForward,
  Speed,
  Shield,
  Assessment,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Headerimage from '../assets/headerimage.jpg';
import './home.css';

export default function BasicPageContainer() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* Top Welcome Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Chip
            label="MINISTRY OF JAL SHAKTI • HYDROGUARD PLATFORM"
            size="small"
            sx={{
              bgcolor: 'rgba(39, 76, 119, 0.08)',
              color: '#274C77',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.5px',
              mb: 1.5,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1B3B6F',
              letterSpacing: '-0.5px',
              mb: 1,
            }}
          >
            Intelligent Dam Monitoring & Water Resource Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 860 }}>
            HydroGuard empowers water authorities, dam engineers, and agricultural departments with real-time reservoir storage telemetry, command area crop water requirement calculations, and distribution canal loss mitigation.
          </Typography>
        </Box>

        {/* Hero Image Banner with Subtle Dark Gradient Overlay */}
        <div className="home-hero-card">
          <img src={Headerimage} alt="HydroGuard Dam Banner" className="home-hero-img" />
          <div className="home-hero-overlay">
            <Chip
              label="Real-Time Telemetry Active"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.25)',
                color: '#A7F3D0',
                fontWeight: 700,
                width: 'fit-content',
                mb: 1,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5, letterSpacing: '-0.3px' }}>
              Precision Hydro-Spatial Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 650, display: { xs: 'none', sm: 'block' } }}>
              Protecting critical water infrastructure and ensuring sustainable agricultural irrigation through automated satellite-based telemetry.
            </Typography>
          </div>
        </div>

        {/* Section: Process Flow Pathways */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 0.5, letterSpacing: '-0.3px' }}>
            Choose Operational Pathway
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Select a pathway below to launch the interactive telemetry or hydraulic calculation engine.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
            alignItems: 'stretch',
          }}
        >
          {/* Pathway Card 1: See Dams & Reservoir */}
          <div
            className="pathway-card"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: 'rgba(39, 76, 119, 0.1)',
                    color: '#274C77',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AccountBalance fontSize="medium" />
                </Box>
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F', lineHeight: 1.2 }}>
                    See Dams & Reservoir
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#274C77', fontWeight: 600 }}>
                    Track 1: Dam Telemetry & Command Area Crops
                  </Typography>
                </div>
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, flexGrow: 1 }}>
                Explore the interactive India reservoir map, monitor live water cover and storage capacity, delineate command area polygons, and balance crop water needs.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip icon={<ShowChart sx={{ fontSize: '0.85rem !important' }} />} label="Live Graphs" size="small" variant="outlined" />
                <Chip icon={<Agriculture sx={{ fontSize: '0.85rem !important' }} />} label="Command Area" size="small" variant="outlined" />
                <Chip icon={<Compare sx={{ fontSize: '0.85rem !important' }} />} label="Water Need vs Capacity" size="small" variant="outlined" />
              </Box>

              <Button
                component={Link}
                to="/"
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  bgcolor: '#1B3B6F',
                  '&:hover': { bgcolor: '#0B2545' },
                  borderRadius: '10px',
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none',
                  mt: 'auto',
                }}
              >
                Go to Dams & Reservoirs
              </Button>
            </Box>
          </div>

          {/* Pathway Card 2: Canal Loss */}
          <div
            className="pathway-card"
            onClick={() => navigate('/canal')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/canal')}
          >
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: 'rgba(2, 132, 199, 0.1)',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <WaterDrop fontSize="medium" />
                </Box>
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F', lineHeight: 1.2 }}>
                    Canal Loss Assessment
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 600 }}>
                    Track 2: Seepage & Evaporation Loss Engine
                  </Typography>
                </div>
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, flexGrow: 1 }}>
                Calculate water volume lost during canal transit by inputting reach geometry, soil permeability ($Q_e$), and lining status. Generate mitigation recommendations.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip icon={<Speed sx={{ fontSize: '0.85rem !important' }} />} label="Seepage Loss" size="small" variant="outlined" />
                <Chip icon={<Assessment sx={{ fontSize: '0.85rem !important' }} />} label="Atmospheric Evaporation" size="small" variant="outlined" />
                <Chip icon={<Shield sx={{ fontSize: '0.85rem !important' }} />} label="Lining Upgrades" size="small" variant="outlined" />
              </Box>

              <Button
                component={Link}
                to="/canal"
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  bgcolor: '#0284C7',
                  '&:hover': { bgcolor: '#0369A1' },
                  borderRadius: '10px',
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none',
                  mt: 'auto',
                }}
              >
                Analyze Canal Loss
              </Button>
            </Box>
          </div>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Section: Process Flow Architecture */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 0.5, letterSpacing: '-0.3px' }}>
            HydroGuard Process Architecture
          </Typography>
          <Typography variant="body2" color="textSecondary">
            End-to-end data pipeline from satellite ingestion to on-ground water allocation.
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: '14px',
            bgcolor: '#F8FAFC',
            borderColor: '#E2E8F0',
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr auto 1.3fr auto 1fr' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Step 1 */}
            <div className="process-step-box">
              <Chip label="Step 1" size="small" sx={{ bgcolor: 'rgba(39, 76, 119, 0.1)', color: '#274C77', fontWeight: 700, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 0.5 }}>
                1. Pathway Selection
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Select between Dam Reservoir telemetry or Canal hydraulics depending on target analysis.
              </Typography>
            </div>

            {/* Arrow 1 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <ChevronRight color="action" />
            </Box>

            {/* Step 2 */}
            <div className="process-step-box">
              <Chip label="Step 2" size="small" sx={{ bgcolor: 'rgba(39, 76, 119, 0.1)', color: '#274C77', fontWeight: 700, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 0.5 }}>
                2. Live Telemetry & Hydraulics
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block">
                • <strong>Track 1</strong>: Inspect reservoir volume, delineate command area, select crops.
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block">
                • <strong>Track 2</strong>: Compute soil seepage rate and evaporation loss along canal reach.
              </Typography>
            </div>

            {/* Arrow 2 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <ChevronRight color="action" />
            </Box>

            {/* Step 3 */}
            <div className="process-step-box">
              <Chip label="Step 3" size="small" sx={{ bgcolor: 'rgba(39, 76, 119, 0.1)', color: '#274C77', fontWeight: 700, mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 0.5 }}>
                3. Water Balancing & Policy
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Compare aggregate crop demand against live reservoir storage capacity to prevent deficits and mitigate conveyance waste.
              </Typography>
            </div>
          </Box>
        </Paper>

        {/* Section: Platform Capabilities */}
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 1, letterSpacing: '-0.3px' }}>
          Mission-Critical Water Infrastructure Governance
        </Typography>
        <Typography paragraph color="textSecondary" sx={{ mb: 3 }}>
          Developed to modernize India's water security, HydroGuard integrates Google Earth Engine satellite telemetry, hydrological regression models, and precision command-area crop water calculators. By reducing losses and optimizing seasonal discharge schedules, the platform supports sustainable irrigation and climate resilience.
        </Typography>
      </Paper>
    </div>
  );
}
