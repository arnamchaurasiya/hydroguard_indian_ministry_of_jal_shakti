import { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Alert,
  Divider,
  CircularProgress,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  WaterDrop,
  Calculate,
  TrendingDown,
  Opacity,
  Shield,
  Assessment,
  Speed,
  InfoOutlined,
  CheckCircle,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';

const CanalForm = () => {
  const [canalData, setCanalData] = useState({
    qe: '1.2',
    width: '5.0',
    soilType: 'Alluvial soil',
    canalArea: '25.0',
    canalType: 'unlined',
    canalDepth: '2.5',
    canalLength: '10.0',
  });

  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCanalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      qe: parseFloat(canalData.qe) || 1.2,
      width: parseFloat(canalData.width) || 5.0,
      soil_type: canalData.soilType || 'Alluvial soil',
      canal_area: parseFloat(canalData.canalArea) || 25.0,
      canal_type: canalData.canalType || 'unlined',
      canal_depth: parseFloat(canalData.canalDepth) || 2.5,
      canal_length: parseFloat(canalData.canalLength) || 10.0,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8080/canal', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponseData(response.data);
    } catch (error) {
      console.error('Error submitting canal data:', error);
      setResponseData({ error: 'Failed to calculate canal losses. Ensure the backend telemetry service is running.' });
    } finally {
      setLoading(false);
    }
  };

  const result = responseData?.data;
  const seepageLoss = result?.seepage_loss || 0;
  const evaporationLoss = result?.evaporation_loss || 0;
  const totalLoss = result?.total_loss || (seepageLoss + evaporationLoss);

  const seepagePct = totalLoss > 0 ? Math.round((seepageLoss / totalLoss) * 100) : 0;
  const evapPct = totalLoss > 0 ? Math.round((evaporationLoss / totalLoss) * 100) : 0;

  return (
    <div className="page-wrapper">
      {/* Page Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
          <Box>
            <Chip
              icon={<WaterDrop sx={{ fontSize: '0.9rem !important' }} />}
              label="Canal Telemetry & Hydraulics"
              size="small"
              sx={{
                bgcolor: 'rgba(39, 76, 119, 0.08)',
                color: '#274C77',
                fontWeight: 600,
                mb: 1,
                fontSize: '0.72rem',
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', letterSpacing: '-0.5px' }}>
              Canal Seepage & Evaporation Loss Assessment
            </Typography>
          </Box>
          <Chip
            label="Empirical Hydrology Model"
            color="primary"
            variant="outlined"
            sx={{ borderColor: '#274C77', color: '#274C77', fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, maxWidth: 840 }}>
          Quantify conveyance water losses due to soil seepage and atmospheric evaporation along distribution canals. Compare unlined vs. concrete-lined canal performance to guide infrastructure investments.
        </Typography>
      </Paper>

      {/* Balanced 2-Column Grid on Desktop, Single Column on Mobile */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(320px, 0.85fr) minmax(420px, 1.15fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Input Parameters Form */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(27, 59, 111, 0.06)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'rgba(39, 76, 119, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#274C77',
                mr: 1.5,
              }}
            >
              <Calculate fontSize="small" />
            </Box>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F', lineHeight: 1.2 }}>
                Canal Parameters
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Enter geometric dimensions and soil characteristics
              </Typography>
            </div>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* Group 1: Canal Dimensions */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#274C77',
                    letterSpacing: '0.5px',
                    display: 'block',
                    mb: 1.5,
                  }}
                >
                  1. Geometric Dimensions
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    required
                    label="Canal Width"
                    name="width"
                    value={canalData.width}
                    onChange={handleChange}
                    type="number"
                    variant="outlined"
                    size="small"
                    helperText="Bed width in meters (m)"
                    slotProps={{ htmlInput: { step: '0.1', min: '0.1' } }}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Canal Depth"
                    name="canalDepth"
                    value={canalData.canalDepth}
                    onChange={handleChange}
                    type="number"
                    variant="outlined"
                    size="small"
                    helperText="Water depth in meters (m)"
                    slotProps={{ htmlInput: { step: '0.1', min: '0.1' } }}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Canal Length"
                    name="canalLength"
                    value={canalData.canalLength}
                    onChange={handleChange}
                    type="number"
                    variant="outlined"
                    size="small"
                    helperText="Reach length in kilometers (km)"
                    slotProps={{ htmlInput: { step: '0.1', min: '0.1' } }}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Wetted Surface Area"
                    name="canalArea"
                    value={canalData.canalArea}
                    onChange={handleChange}
                    type="number"
                    variant="outlined"
                    size="small"
                    helperText="Cross-sectional area (m²)"
                    slotProps={{ htmlInput: { step: '0.5', min: '1' } }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Group 2: Soil & Lining */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#274C77',
                    letterSpacing: '0.5px',
                    display: 'block',
                    mb: 1.5,
                  }}
                >
                  2. Soil & Lining Specifications
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="soil-type-label">Soil Classification</InputLabel>
                    <Select
                      labelId="soil-type-label"
                      name="soilType"
                      value={canalData.soilType}
                      onChange={handleChange}
                      label="Soil Classification"
                    >
                      <MenuItem value="Alluvial soil">Alluvial Soil (c = 1.4 m/day)</MenuItem>
                      <MenuItem value="Clay soil">Clay Soil (c = 0.95 m/day - Low Porosity)</MenuItem>
                      <MenuItem value="Loam soil">Loam Soil (c = 1.2 m/day - Moderate)</MenuItem>
                      <MenuItem value="Sandy soil">Sandy Soil (c = 2.1 m/day - High Seepage)</MenuItem>
                      <MenuItem value="Black cotton soil">Black Cotton Soil (c = 1.1 m/day)</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      required
                      label="Seepage Coefficient (Qe)"
                      name="qe"
                      value={canalData.qe}
                      onChange={handleChange}
                      type="number"
                      variant="outlined"
                      size="small"
                      helperText="Loss rate coeff (m³/s/Mm²)"
                      slotProps={{ htmlInput: { step: '0.05', min: '0.1' } }}
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel id="canal-type-label">Canal Lining Type</InputLabel>
                      <Select
                        labelId="canal-type-label"
                        name="canalType"
                        value={canalData.canalType}
                        onChange={handleChange}
                        label="Canal Lining Type"
                      >
                        <MenuItem value="unlined">Unlined Earthen Canal</MenuItem>
                        <MenuItem value="lined">Concrete Lined Canal</MenuItem>
                        <MenuItem value="piped">Enclosed Pipe Conveyance</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </Box>

              {/* Primary Action Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Calculate />}
                sx={{
                  bgcolor: '#1B3B6F',
                  '&:hover': { bgcolor: '#0B2545' },
                  py: 1.5,
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)',
                  mt: 1,
                }}
              >
                {loading ? 'Calculating Losses...' : 'Enter ↵ & Analyze Losses'}
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* Right Column: Analysis & Results */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(27, 59, 111, 0.06)',
            minHeight: '480px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: 'rgba(2, 132, 199, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  mr: 1.5,
                }}
              >
                <Assessment fontSize="small" />
              </Box>
              <div>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F', lineHeight: 1.2 }}>
                  Loss Analysis & Recommendations
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Breakdown of infiltration and evaporative depletion
                </Typography>
              </div>
            </Box>

            {responseData && !responseData.error && (
              <Chip
                icon={<CheckCircle sx={{ fontSize: '0.85rem !important' }} />}
                label="Analysis Ready"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {responseData?.error ? (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>
              {responseData.error}
            </Alert>
          ) : responseData ? (
            <Box>
              {/* Primary Total Water Loss Banner Card */}
              <Box
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1B3B6F 0%, #274C77 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 6px 20px rgba(27, 59, 111, 0.25)',
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                      Total Estimated Water Loss
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', my: 0.5 }}>
                      {totalLoss.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>m³</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                      Combined seepage infiltration & surface evaporation along the {canalData.canalLength} km reach.
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Chip
                      label={canalData.canalType === 'unlined' ? 'High Loss Rate' : 'Controlled Loss'}
                      sx={{
                        bgcolor: canalData.canalType === 'unlined' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Breakdown Metric Sub-Cards */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
                <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        Seepage Loss
                      </Typography>
                      <TrendingDown sx={{ color: '#D97706', fontSize: 18 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#D97706' }}>
                      {seepageLoss.toFixed(1)} m³
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="textSecondary">Share of Total</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#D97706' }}>{seepagePct}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={seepagePct} sx={{ height: 6, borderRadius: 3, bgcolor: '#FEF3C7', '& .MuiLinearProgress-bar': { bgcolor: '#D97706' } }} />
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        Evaporation Loss
                      </Typography>
                      <Opacity sx={{ color: '#0284C7', fontSize: 18 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0284C7' }}>
                      {evaporationLoss.toFixed(1)} m³
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="textSecondary">Share of Total</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#0284C7' }}>{evapPct}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={evapPct} sx={{ height: 6, borderRadius: 3, bgcolor: '#E0F2FE', '& .MuiLinearProgress-bar': { bgcolor: '#0284C7' } }} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Bar Chart Visualization */}
              <Box sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px', bgcolor: '#FAFCFE', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 1 }}>
                  Loss Proportion Comparison (m³)
                </Typography>
                <Box sx={{ height: 230, width: '100%' }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Seepage Loss', 'Evaporation', 'Total Loss'] }]}
                    series={[{ data: [seepageLoss, evaporationLoss, totalLoss], color: '#274C77' }]}
                    height={220}
                  />
                </Box>
              </Box>

              {/* Engineering Insights & Policy Recommendations */}
              <Alert
                severity={canalData.canalType === 'unlined' ? 'warning' : 'success'}
                icon={canalData.canalType === 'unlined' ? <InfoOutlined /> : <Shield />}
                sx={{ borderRadius: '12px', border: '1px solid', borderColor: canalData.canalType === 'unlined' ? '#FDE68A' : '#BBF7D0' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Infrastructure Efficiency Insight:
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {canalData.canalType === 'unlined'
                    ? `This reach is currently UNLINED in ${canalData.soilType}. Converting to concrete lining can prevent up to ${(seepageLoss * 0.65).toFixed(1)} m³ of water loss per cycle, recovering significant volume for command area farmers.`
                    : `This canal utilizes lining technology. Continuing periodic joint-seal maintenance will keep seepage mitigation above 85% efficiency.`}
                </Typography>
              </Alert>
            </Box>
          ) : (
            /* Rich Empty State */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: { xs: 4, md: 7 },
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  bgcolor: 'rgba(39, 76, 119, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#274C77',
                  mb: 2,
                }}
              >
                <WaterDrop sx={{ fontSize: 36 }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 1 }}>
                Awaiting Canal Parameters
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 440, mb: 3 }}>
                Enter your canal dimensions, soil type, and lining status on the left, then click <strong>"Enter ↵ & Analyze Losses"</strong> to generate the hydrological loss breakdown.
              </Typography>

              {/* What will be calculated previews */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5, width: '100%', maxWidth: 500 }}>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <TrendingDown sx={{ color: '#D97706', fontSize: 20, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#1B3B6F' }}>
                    Seepage
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Soil permeability
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <Opacity sx={{ color: '#0284C7', fontSize: 20, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#1B3B6F' }}>
                    Evaporation
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Surface loss
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <Speed sx={{ color: '#10B981', fontSize: 20, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#1B3B6F' }}>
                    Efficiency
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Lining impact
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default CanalForm;
