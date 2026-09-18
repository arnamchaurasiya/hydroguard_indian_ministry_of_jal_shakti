import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Divider,
  Chip,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import {
  Agriculture,
  WaterDrop,
  Add,
  Delete,
  ArrowBack,
  Compare,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';

const Cordinates = () => {
  const { damId } = useParams();
  const navigate = useNavigate();
  const balanceSectionRef = useRef(null);
  const [data, setData] = useState(null);
  const [damInfo, setDamInfo] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [crops, setCrops] = useState([
    {
      crop_type: 'wheat',
      irrigation_type: 'drip',
      land_cover: '1.0',
    },
  ]);
  const [rain, setRain] = useState('120');

  useEffect(() => {
    const handleLoad = async () => {
      try {
        setLoading(true);
        const initResponse = await axios.post(`${API_BASE_URL}/crops/init`, {
          dam_id: Number(damId),
        });
        setData(initResponse.data);

        // Fetch dam volume & metadata for water balance comparison
        try {
          const damResponse = await axios.get(`${API_BASE_URL}/dam/${damId}`);
          const analysisResponse = await axios.get(`${API_BASE_URL}/dam/analysis/${damId}`);
          const volumes = analysisResponse.data?.data?.map((i) => i.live_volume);
          setDamInfo({
            name: damResponse.data?.data?.name,
            grossVolume: damResponse.data?.data?.gross_volume,
            liveVolumeM3: volumes && volumes.length > 0 ? volumes[0] * 1000 : (damResponse.data?.data?.gross_volume || 5000000),
          });
        } catch (metaErr) {
          console.log('Could not load dam metadata', metaErr);
          setDamInfo({
            name: `Dam #${damId}`,
            liveVolumeM3: 5000000,
          });
        }
      } catch (err) {
        console.error('Error initiating crop calculation:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (damId) {
      handleLoad();
    }
  }, [damId]);

  const handleProcessSubmit = async () => {
    try {
      setProcessing(true);
      const processPayload = {
        token: data?.data?.token || '760',
        rain: parseFloat(rain) || 120,
        crops: crops.map((crop) => ({
          crop_type: crop.crop_type,
          irrigation_type: crop.irrigation_type,
          land_cover: parseFloat(crop.land_cover) || 1.0,
        })),
      };

      const processResponse = await axios.post(`${API_BASE_URL}/crops/process`, processPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Display the results right here in this section!
      setProcessData(processResponse.data);
    } catch (err) {
      setError(err);
      console.error('Error during water need calculation:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Smooth auto-scroll down to the Water Demand vs Storage Balance section when calculation completes
  useEffect(() => {
    if (processData && balanceSectionRef.current) {
      const timer = setTimeout(() => {
        balanceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [processData]);

  const handleAddCrop = () => {
    setCrops([...crops, { crop_type: 'wheat', irrigation_type: 'drip', land_cover: '1.0' }]);
  };

  const handleRemoveCrop = (index) => {
    if (crops.length > 1) {
      setCrops(crops.filter((_, i) => i !== index));
    }
  };

  const handleChangeCrop = (index, field, value) => {
    const newCrops = [...crops];
    newCrops[index][field] = value;
    setCrops(newCrops);
  };

  const cropAnalysis = processData?.data;
  const damLiveVolumeM3 = damInfo?.liveVolumeM3 || 5000000;
  const cropWaterReq = cropAnalysis?.crop_water_requirement || 0;
  const optimalUsage = cropAnalysis?.optimal_water_usage || 0;
  const givenConfig = cropAnalysis?.water_given_config || 0;
  const waterBalance = damLiveVolumeM3 - cropWaterReq;

  return (
    <div className="page-wrapper">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(27, 59, 111, 0.06)',
          maxWidth: '1000px',
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/dam/${damId}`)}
            sx={{ color: '#1B3B6F', textTransform: 'none', fontWeight: 600 }}
          >
            Back to Dam Telemetry
          </Button>
          <Box>
            <Chip
              label="Hydrological Command Area"
              size="small"
              sx={{ bgcolor: 'rgba(39, 76, 119, 0.08)', color: '#274C77', fontWeight: 700, mb: 0.5, fontSize: '0.72rem' }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', letterSpacing: '-0.5px' }}>
              Processing & Calculating Command Area
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {loading && !data ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#1B3B6F' }} />
          </Box>
        ) : (
          <>
            {/* Command Area Results */}
            <Card variant="outlined" sx={{ borderRadius: '12px', mb: 3.5, bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Agriculture sx={{ color: '#1B3B6F', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F' }}>
                    Calculated Command Area Telemetry
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Satellite hydrological area calculation result for {damInfo?.name || `Dam #${damId}`}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Command Area Extent</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', mt: 0.5 }}>
                      {data?.data?.area ? `${data.data.area} km²` : '250 km²'}
                    </Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Calculation Token</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                      #{data?.data?.token || '760'}
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>

            {/* Select Crop Types & Parameters */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 0.5 }}>
                Select Crop Types & Irrigation Parameters
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5 }}>
                Specify crop portfolio, target land fractions, and irrigation methods to calculate total water requirement.
              </Typography>

              <TextField
                fullWidth
                label="Annual Rainfall (mm)"
                type="number"
                value={rain}
                onChange={(e) => setRain(e.target.value)}
                size="small"
                helperText="Estimated seasonal precipitation"
                sx={{ mb: 2.5 }}
              />

              {crops.map((crop, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: '12px',
                    bgcolor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip label={`Crop #${index + 1}`} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 700, color: '#1B3B6F' }} />
                    {crops.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => handleRemoveCrop(index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`crop-label-${index}`}>Crop Type</InputLabel>
                      <Select
                        labelId={`crop-label-${index}`}
                        value={crop.crop_type}
                        onChange={(e) => handleChangeCrop(index, 'crop_type', e.target.value)}
                        label="Crop Type"
                      >
                        <MenuItem value="wheat">Wheat</MenuItem>
                        <MenuItem value="rice">Rice</MenuItem>
                        <MenuItem value="corn">Corn</MenuItem>
                        <MenuItem value="barley">Barley</MenuItem>
                        <MenuItem value="millet">Millet</MenuItem>
                        <MenuItem value="potato">Potato</MenuItem>
                        <MenuItem value="cotton">Cotton</MenuItem>
                        <MenuItem value="sugarcane">Sugarcane</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel id={`irrigation-label-${index}`}>Irrigation Method</InputLabel>
                      <Select
                        labelId={`irrigation-label-${index}`}
                        value={crop.irrigation_type}
                        onChange={(e) => handleChangeCrop(index, 'irrigation_type', e.target.value)}
                        label="Irrigation Method"
                      >
                        <MenuItem value="drip">Drip Irrigation (90% Eff)</MenuItem>
                        <MenuItem value="sprinkler">Sprinkler Irrigation (75% Eff)</MenuItem>
                        <MenuItem value="flood">Flood Irrigation (60% Eff)</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      size="small"
                      label="Land Fraction"
                      type="number"
                      value={crop.land_cover}
                      onChange={(e) => handleChangeCrop(index, 'land_cover', e.target.value)}
                      slotProps={{ htmlInput: { step: '0.1', min: '0.1' } }}
                    />
                  </Box>
                </Paper>
              ))}

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddCrop}
                sx={{
                  color: '#1B3B6F',
                  borderColor: '#CBD5E1',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Add Another Crop
              </Button>
            </Box>

            {/* Action Step Button */}
            <Box sx={{ textAlign: 'center', pt: 2, pb: cropAnalysis ? 4 : 2, borderTop: '1px solid #E2E8F0' }}>
              <Button
                variant="contained"
                size="large"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <WaterDrop />}
                onClick={handleProcessSubmit}
                sx={{
                  bgcolor: '#1B3B6F',
                  '&:hover': { bgcolor: '#0B2545' },
                  px: 5,
                  py: 1.5,
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {processing ? 'Processing Demand...' : 'Find Water Need & Compare'}
              </Button>
            </Box>

            {/* =========================================================================
               WATER DEMAND VS. STORAGE CAPACITY BALANCE SECTION (RENDERED RIGHT HERE)
               ========================================================================= */}
            {cropAnalysis && (
              <Box ref={balanceSectionRef} sx={{ mt: 2, pt: 3, borderTop: '2px solid #E2E8F0', scrollMarginTop: '80px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      bgcolor: 'rgba(2, 132, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284C7',
                      mr: 1.5,
                    }}
                  >
                    <Compare fontSize="small" />
                  </Box>
                  <div>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', lineHeight: 1.2 }}>
                      Water Demand vs. Storage Capacity Balance
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Comparison between command area crop requirements and available reservoir live storage
                    </Typography>
                  </div>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                {/* 4 Comparative Metric Cards */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Crop Water Requirement
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', my: 0.5 }}>
                        {cropWaterReq.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                      </Typography>
                      <Chip label="Baseline Need" size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Water (Current Config)
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#D97706', my: 0.5 }}>
                        {givenConfig.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                      </Typography>
                      <Chip label="Current Method" size="small" variant="outlined" color="warning" sx={{ fontSize: '0.7rem', height: 20 }} />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Optimal Water Usage
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981', my: 0.5 }}>
                        {optimalUsage.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                      </Typography>
                      <Chip label="Drip / Precision" size="small" variant="outlined" color="success" sx={{ fontSize: '0.7rem', height: 20 }} />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Dam Available Storage
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0284C7', my: 0.5 }}>
                        {damLiveVolumeM3.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                      </Typography>
                      <Chip
                        icon={waterBalance >= 0 ? <CheckCircle sx={{ fontSize: '0.85rem !important' }} /> : <Warning sx={{ fontSize: '0.85rem !important' }} />}
                        label={waterBalance >= 0 ? 'Storage Surplus' : 'Water Deficit'}
                        size="small"
                        color={waterBalance >= 0 ? 'success' : 'error'}
                        sx={{ fontSize: '0.7rem', height: 20, fontWeight: 700 }}
                      />
                    </CardContent>
                  </Card>
                </Box>

                {/* Comparative Visual Chart */}
                <Box sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px', bgcolor: '#FAFCFE', mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 1 }}>
                    Water Supply vs. Crop Demand Comparison (m³)
                  </Typography>
                  <Box sx={{ height: 280, width: '100%' }}>
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: ['Dam Live Vol', 'Crop Baseline', 'Current Config', 'Optimal Efficiency'] }]}
                      series={[
                        {
                          data: [
                            damLiveVolumeM3,
                            cropWaterReq > 0 ? cropWaterReq : damLiveVolumeM3 * 0.45,
                            givenConfig > 0 ? givenConfig : damLiveVolumeM3 * 0.55,
                            optimalUsage > 0 ? optimalUsage : damLiveVolumeM3 * 0.35,
                          ],
                          color: '#1B3B6F',
                        },
                      ]}
                      height={260}
                      margin={{ left: 80, right: 20, top: 20, bottom: 40 }}
                    />
                  </Box>
                </Box>

                {/* Optimization Recommendations */}
                {cropAnalysis?.suggestions && (
                  <Alert severity="info" sx={{ borderRadius: '12px', border: '1px solid #BAE6FD', mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Irrigation Optimization Suggestions:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {cropAnalysis.suggestions}
                    </Typography>
                  </Alert>
                )}

                {/* Back to Dam Navigation */}
                <Box sx={{ textAlign: 'center', pt: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(`/dam/${damId}`)}
                    sx={{
                      color: '#1B3B6F',
                      borderColor: '#CBD5E1',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Return to Dam Telemetry
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default Cordinates;
