import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { Box, Typography, Card, CardContent, Button, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl, Paper } from '@mui/material';

const Cordinates = () => {
  const { coordinates } = useParams();
  const [data, setData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState('wheat');
  const [irrigationType, setIrrigationType] = useState('drip');
  const [landCover, setLandCover] = useState('');
  const [rain, setRain] = useState(''); 

  useEffect(() => {
    const handleLoad = async () => {
      try {
        setLoading(true);
        const coordinateString = coordinates.replace(/^coordinates=/, "").replace(/&.*$/, "");
        const coordinateArray = JSON.parse(decodeURIComponent(coordinateString));

        const payload = {
          coordinates: coordinateArray.map(coord => ({
            latitude: coord[0],
            longitude: coord[1]
          }))
        };

        const initResponse = await axios.post(`${API_BASE_URL}/crops/init`, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setData(initResponse.data);
      } catch (error) {
        setError(error);
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
      setLoading(true);
      const processPayload = {
        token: data?.data?.token,
        rain: parseFloat(rain),
        crops: [
          {
            crop_type: cropType,
            irrigation_type: irrigationType,
            land_cover: parseFloat(landCover)
          }
        ]
      };

      const processResponse = await axios.post(`${API_BASE_URL}/crops/process`, processPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setProcessData(processResponse.data);
    } catch (error) {
      setError(error);
      console.error('Error during processing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="page-wrapper">
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" color="error">
            Error: {error?.response?.data?.message || error.message}
          </Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: '16px', bgcolor: '#FFFFFF', maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#1B3B6F', fontWeight: 800, mb: 3, textAlign: 'center' }}>
          Coordinate Analysis Results
        </Typography>

        {loading && !processData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#1B3B6F' }} />
          </Box>
        ) : (
          <>
            {data && (
              <Card sx={{ boxShadow: 1, borderRadius: '12px', p: 2, mb: 3, bgcolor: '#F8FAFC' }}>
                <CardContent>
                  <Typography variant="body1" sx={{ color: '#1B3B6F', fontWeight: 600 }}>
                    <strong>Area:</strong> {data.data?.area}
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
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

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="irrigation-type-label">Irrigation Type</InputLabel>
                <Select
                  labelId="irrigation-type-label"
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  label="Irrigation Type"
                >
                  <MenuItem value="drip">Drip</MenuItem>
                  <MenuItem value="flood">Flood</MenuItem>
                  <MenuItem value="sprinkler">Sprinkler</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="Land Cover"
                type="number"
                value={landCover}
                onChange={(e) => setLandCover(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                size="small"
                label="Rain (mm)"
                type="number"
                value={rain}
                onChange={(e) => setRain(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                sx={{ bgcolor: '#1B3B6F', '&:hover': { bgcolor: '#0B2545' }, borderRadius: '10px', py: 1.2, px: 3, fontWeight: 700, textTransform: 'none' }}
                onClick={handleProcessSubmit}
              >
                Submit
              </Button>
            </Box>

            {processData && (
              <Card sx={{ boxShadow: 1, borderRadius: '12px', p: 2, bgcolor: '#F8FAFC' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1B3B6F', fontWeight: 700, mb: 2 }}>
                    Results from /crops/process:
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#1B3B6F' }}>
                      <strong>Water Requirement:</strong> {processData.data?.crop_water_requirement}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1B3B6F' }}>
                      <strong>Water Configuration:</strong> {processData.data?.water_given_config}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1B3B6F' }}>
                      <strong>Optimal Water Usage:</strong> {processData.data?.optimal_water_usage}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1B3B6F' }}>
                      <strong>Suggestions:</strong> {processData.data?.suggestions}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Button
          variant="outlined"
          sx={{ mt: 3, borderRadius: '8px', color: '#1B3B6F', borderColor: '#CBD5E1', display: 'block', mx: 'auto', textTransform: 'none' }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Paper>
    </div>
  );
};

export default Cordinates;
