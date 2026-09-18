import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Grid2 as Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl, Chip, Alert, Divider } from '@mui/material';
import { WaterDrop, Calculate, PieChart, CheckCircle, Warning, ArrowForward } from '@mui/icons-material';
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
    setCanalData({ ...canalData, [name]: value });
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
      setResponseData({ error: 'Failed to calculate canal losses. Check backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  const result = responseData?.data;
  const seepageLoss = result?.seepage_loss || 0;
  const evaporationLoss = result?.evaporation_loss || 0;
  const totalLoss = result?.total_loss || (seepageLoss + evaporationLoss);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', paddingLeft: '23vw', paddingRight: '22vw', paddingTop: '2vw', paddingBottom: '4vw', boxSizing: 'border-box', bgcolor: '#F4F7F9' }}>
      
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <Chip label="Process Flow Track 2" color="primary" size="small" sx={{ bgcolor: '#274C77', fontWeight: 'bold', mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#274C77' }}>
          Canal Loss Assessment
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Calculate Seepage Loss, Evaporation Loss, and Total Water Loss along canal networks.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        
        {/* Step: Enter Parameters */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WaterDrop sx={{ color: '#274C77', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                Enter Parameters
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Seepage Rate / Coefficient (Qe)"
                  name="qe"
                  value={canalData.qe}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Canal Width (m)"
                  name="width"
                  value={canalData.width}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                />

                <FormControl fullWidth>
                  <InputLabel id="soil-type-label">Soil Type</InputLabel>
                  <Select
                    labelId="soil-type-label"
                    name="soilType"
                    value={canalData.soilType}
                    onChange={handleChange}
                    label="Soil Type"
                  >
                    <MenuItem value="Alluvial soil">Alluvial Soil (c=1.4)</MenuItem>
                    <MenuItem value="Clay soil">Clay Soil (c=0.95)</MenuItem>
                    <MenuItem value="Loam soil">Loam Soil (c=1.2)</MenuItem>
                    <MenuItem value="Sandy soil">Sandy Soil (c=2.1)</MenuItem>
                    <MenuItem value="Black cotton soil">Black Cotton Soil (c=1.1)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Canal Wetted Area (m²)"
                  name="canalArea"
                  value={canalData.canalArea}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                />

                <FormControl fullWidth>
                  <InputLabel id="canal-type-label">Canal Lining Type</InputLabel>
                  <Select
                    labelId="canal-type-label"
                    name="canalType"
                    value={canalData.canalType}
                    onChange={handleChange}
                    label="Canal Lining Type"
                  >
                    <MenuItem value="unlined">Unlined Earthen Canal (High Seepage)</MenuItem>
                    <MenuItem value="lined">Concrete Lined Canal (Medium Seepage)</MenuItem>
                    <MenuItem value="piped">Enclosed Pipe Conveyance (Minimal Loss)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Canal Depth (m)"
                  name="canalDepth"
                  value={canalData.canalDepth}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Canal Length (km)"
                  name="canalLength"
                  value={canalData.canalLength}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Calculate />}
                  endIcon={<ArrowForward />}
                  disabled={loading}
                  sx={{ bgcolor: '#274C77', '&:hover': { bgcolor: '#1D3859' }, py: 1.5, borderRadius: '10px', fontWeight: 'bold', mt: 1 }}
                >
                  {loading ? 'Calculating Losses...' : 'Enter ↵ & Analyze Losses'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Step: Analyze Losses */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChart sx={{ color: '#274C77', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                Analyze Losses
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {responseData?.error ? (
              <Alert severity="error">{responseData.error}</Alert>
            ) : responseData ? (
              <Box>
                {/* Metric Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#FAFCFE' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Seepage Loss</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D97706', my: 0.5 }}>
                          {seepageLoss.toFixed(1)} m³
                        </Typography>
                        <Chip label="Soil Seepage" size="small" variant="outlined" color="warning" />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#FAFCFE' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Evaporation Loss</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0284C7', my: 0.5 }}>
                          {evaporationLoss.toFixed(1)} m³
                        </Typography>
                        <Chip label="Atmospheric Loss" size="small" variant="outlined" color="info" />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#FAFCFE' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Total Water Loss</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#DC2626', my: 0.5 }}>
                          {totalLoss.toFixed(1)} m³
                        </Typography>
                        <Chip label="Combined Loss" size="small" color="error" />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Loss Breakdown Bar Chart */}
                <Box sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px', bgcolor: '#FAFCFE', mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#274C77', mb: 1 }}>
                    Canal Loss Breakdown Chart (m³)
                  </Typography>
                  <Box sx={{ height: 250, width: '100%' }}>
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: ['Seepage Loss', 'Evaporation Loss', 'Total Water Loss'] }]}
                      series={[{ data: [seepageLoss, evaporationLoss, totalLoss], color: '#274C77' }]}
                      height={240}
                    />
                  </Box>
                </Box>

                {/* Recommendations */}
                <Alert severity={canalData.canalType === 'unlined' ? 'warning' : 'success'} sx={{ borderRadius: '10px' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Canal Efficiency Insight:</Typography>
                  {canalData.canalType === 'unlined' ? (
                    'This canal is currently UNLINED. Upgrading to a concrete lined canal or piped distribution can reduce seepage losses by up to 66%, saving significant volume for agriculture.'
                  ) : (
                    'This canal utilizes lining/piping. Maintaining seal integrity ensures maximum conveyance efficiency.'
                  )}
                </Alert>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  Enter canal parameters on the left and click <strong>"Enter ↵ & Analyze Losses"</strong> to generate loss breakdown.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default CanalForm;

