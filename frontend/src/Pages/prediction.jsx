import { Paper, Typography, Box, TextField, Button, Chip } from '@mui/material';
import { Analytics, Send } from '@mui/icons-material';

const Prediction = () => {
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
          maxWidth: '600px',
          mx: 'auto',
        }}
      >
        <Chip
          icon={<Analytics sx={{ fontSize: '0.85rem !important' }} />}
          label="Telemetry Forecasting"
          size="small"
          sx={{ bgcolor: 'rgba(39, 76, 119, 0.08)', color: '#274C77', fontWeight: 700, mb: 1.5 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 1 }}>
          Telemetry Prediction Engine
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Input hydrological parameters to forecast seasonal water cover depletion and reservoir storage trends.
        </Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Reservoir Inflow Rate (m³/s)"
            variant="outlined"
            size="medium"
          />
          <TextField
            fullWidth
            label="Seasonal Evaporation Index"
            variant="outlined"
            size="medium"
          />
          <TextField
            fullWidth
            label="Target Irrigation Discharge (m³/day)"
            variant="outlined"
            size="medium"
          />
          <Button
            variant="contained"
            size="large"
            endIcon={<Send />}
            sx={{
              bgcolor: '#1B3B6F',
              '&:hover': { bgcolor: '#0B2545' },
              py: 1.4,
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)',
              mt: 1,
            }}
          >
            Run Prediction Model
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default Prediction;
