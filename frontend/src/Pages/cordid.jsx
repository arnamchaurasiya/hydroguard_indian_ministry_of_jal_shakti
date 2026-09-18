import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Divider, Chip, IconButton } from '@mui/material';
import { Agriculture, WaterDrop, Search, Add, Delete, ArrowBack } from '@mui/icons-material';

const Cordinates = () => {
  const { damId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([{
    crop_type: 'wheat',
    irrigation_type: 'drip',
    land_cover: '1.0'
  }]);
  const [rain, setRain] = useState('120');

  useEffect(() => {
    const handleLoad = async () => {
      try {
        setLoading(true);
        const initResponse = await axios.post('http://127.0.0.1:8080/crops/init', {
          dam_id: Number(damId)
        });
        setData(initResponse.data);
      } catch (err) {
        console.error("Error initiating crop calculation:", err);
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
      setLoading(true);
      const processPayload = {
        token: data?.data?.token || '760',
        rain: parseFloat(rain) || 120,
        crops: crops.map(crop => ({
          crop_type: crop.crop_type,
          irrigation_type: crop.irrigation_type,
          land_cover: parseFloat(crop.land_cover) || 1.0,
        }))
      };

      const processResponse = await axios.post('http://127.0.0.1:8080/crops/process', processPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setProcessData(processResponse.data);
      // Navigate to dam page with calculation results for step "Compare"
      navigate(`/dam/${damId}`, { state: { processData: processResponse.data } });

    } catch (err) {
      setError(err);
      console.error('Error during water need calculation:', err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', paddingLeft: '23vw', paddingRight: '22vw', paddingTop: '2vw', paddingBottom: '4vw', boxSizing: 'border-box', bgcolor: '#F4F7F9' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', maxWidth: '900px', mx: 'auto' }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(`/dam/${damId}`)} sx={{ mr: 2, color: '#274C77' }}>
            Back to Dam
          </Button>
          <Box>
            <Chip label="Process Flow Step 3B & 4" color="primary" size="small" sx={{ bgcolor: '#274C77', fontWeight: 'bold', mb: 0.5 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#274C77' }}>
              Processing & Calculating Command Area
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {loading && !data ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#274C77' }} />
          </Box>
        ) : (
          <>
            {/* Command Area Results */}
            <Card variant="outlined" sx={{ borderRadius: '12px', mb: 4, bgcolor: '#FAFCFE', borderColor: '#CBD5E1' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Agriculture sx={{ color: '#274C77', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                    Calculated Command Area
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Satellite hydrological area calculation result for Dam #{damId}
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', minWidth: '180px' }}>
                    <Typography variant="caption" color="textSecondary">Command Area</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                      {data?.data?.area ? `${data.data.area} km²` : '250 km²'}
                    </Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: '#FFFFFF', minWidth: '180px' }}>
                    <Typography variant="caption" color="textSecondary">Calculation Token</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#274C77' }}>
                      #{data?.data?.token || '760'}
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>

            {/* Step: Select Crop Type */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#274C77', mb: 1 }}>
                Select Crop Type & Irrigation Parameters
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Specify crops, land coverage, and irrigation methods to calculate total water requirement.
              </Typography>

              <TextField
                fullWidth
                label="Annual Rainfall (mm)"
                type="number"
                value={rain}
                onChange={(e) => setRain(e.target.value)}
                sx={{ mb: 3 }}
              />

              {crops.map((crop, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: '12px', bgcolor: '#FFFFFF', position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip label={`Crop #${index + 1}`} size="small" sx={{ bgcolor: '#E2E8F0', fontWeight: 'bold' }} />
                    {crops.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => handleRemoveCrop(index)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    <FormControl fullWidth>
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

                    <FormControl fullWidth>
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
                      label="Land Cover Portion"
                      type="number"
                      value={crop.land_cover}
                      onChange={(e) => handleChangeCrop(index, 'land_cover', e.target.value)}
                    />
                  </Box>
                </Paper>
              ))}

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddCrop}
                sx={{ mb: 3, color: '#274C77', borderColor: '#274C77' }}
              >
                Add Another Crop
              </Button>
            </Box>

            {/* Action Step: Find Water Need */}
            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #E2E8F0' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<WaterDrop />}
                onClick={handleProcessSubmit}
                sx={{ bgcolor: '#274C77', '&:hover': { bgcolor: '#1D3859' }, px: 5, py: 1.5, borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Find Water Need & Compare
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Cordinates;

