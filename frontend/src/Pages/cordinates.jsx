import { useState, useEffect } from 'react';
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
  Stack,
} from '@mui/material';
import { Agriculture, ArrowBack, WaterDrop, CheckCircle } from '@mui/icons-material';

const Cordinates = () => {
  const { coordinates } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cropType, setCropType] = useState('wheat');
  const [irrigationType, setIrrigationType] = useState('drip');
  const [landCover, setLandCover] = useState('1.0');
  const [rain, setRain] = useState('120');

  useEffect(() => {
    const handleLoad = async () => {
      try {
        setLoading(true);
        const coordinateString = coordinates.replace(/^coordinates=/, '').replace(/&.*$/, '');
        const coordinateArray = JSON.parse(decodeURIComponent(coordinateString));

        const payload = {
          coordinates: coordinateArray.map((coord) => ({
            latitude: coord[0],
            longitude: coord[1],
          })),
        };

        const initResponse = await axios.post(`${API_BASE_URL}/crops/init`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setData(initResponse.data);
      } catch (err) {
        console.error('Error during initial load:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates) {
      handleLoad();
    }
  }, [coordinates]);

  const handleProcessSubmit = async () => {
    try {
      setProcessing(true);
      const processPayload = {
        token: data?.data?.token || '760',
        rain: parseFloat(rain) || 120,
        crops: [
          {
            crop_type: cropType,
            irrigation_type: irrigationType,
            land_cover: parseFloat(landCover) || 1.0,
          },
        ],
      };

      const processResponse = await axios.post(`${API_BASE_URL}/crops/process`, processPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setProcessData(processResponse.data);
    } catch (err) {
      setError(err);
      console.error('Error during processing:', err);
    } finally {
      setProcessing(false);
    }
  };

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
          maxWidth: '960px',
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: '#1B3B6F', textTransform: 'none', fontWeight: 600 }}
          >
            Back to Map
          </Button>
          <Box>
            <Chip
              label="Custom Area Delineation"
              size="small"
              sx={{ bgcolor: 'rgba(39, 76, 119, 0.08)', color: '#274C77', fontWeight: 700, mb: 0.5, fontSize: '0.72rem' }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', letterSpacing: '-0.5px' }}>
              Polygon Command Area Analysis
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
            {data && (
              <Card variant="outlined" sx={{ borderRadius: '12px', mb: 3.5, bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Agriculture sx={{ color: '#1B3B6F', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B3B6F' }}>
                      Enclosed Polygon Results
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Calculated Area</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', mt: 0.5 }}>
                        {data.data?.area ? `${data.data.area} km²` : 'Custom Area'}
                      </Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Session Token</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                        #{data.data?.token || '760'}
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Crop Parameters */}
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 2 }}>
                Agricultural Crop & Irrigation Parameters
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="crop-type-label">Crop Type</InputLabel>
                  <Select
                    labelId="crop-type-label"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
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
                  <InputLabel id="irrigation-type-label">Irrigation Method</InputLabel>
                  <Select
                    labelId="irrigation-type-label"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
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
                  label="Land Coverage"
                  type="number"
                  value={landCover}
                  onChange={(e) => setLandCover(e.target.value)}
                  slotProps={{ htmlInput: { step: '0.1', min: '0.1' } }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Annual Rainfall (mm)"
                  type="number"
                  value={rain}
                  onChange={(e) => setRain(e.target.value)}
                />
              </Box>

              <Button
                variant="contained"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <WaterDrop />}
                onClick={handleProcessSubmit}
                sx={{
                  bgcolor: '#1B3B6F',
                  '&:hover': { bgcolor: '#0B2545' },
                  px: 4,
                  py: 1.3,
                  borderRadius: '10px',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {processing ? 'Processing Demand...' : 'Submit & Analyze Demand'}
              </Button>
            </Box>

            {/* Analysis Results Display */}
            {processData && (
              <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: '#F8FAFC', borderColor: '#E2E8F0', p: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1B3B6F', fontWeight: 800, mb: 2 }}>
                    Water Demand Analysis Output:
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                      <Typography variant="caption" color="textSecondary">Crop Water Requirement</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B3B6F' }}>
                        {processData.data?.crop_water_requirement} m³
                      </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                      <Typography variant="caption" color="textSecondary">Current Configuration</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#D97706' }}>
                        {processData.data?.water_given_config} m³
                      </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                      <Typography variant="caption" color="textSecondary">Optimal Water Usage</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>
                        {processData.data?.optimal_water_usage} m³
                      </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF' }}>
                      <Typography variant="caption" color="textSecondary">Optimization Suggestions</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1B3B6F' }}>
                        {processData.data?.suggestions || 'No critical errors detected.'}
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default Cordinates;
