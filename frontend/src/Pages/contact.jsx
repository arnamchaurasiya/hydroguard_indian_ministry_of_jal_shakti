import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import { ContactSupport, Shield } from '@mui/icons-material';
import DetailsBar from './detailsbar';
import InputSide from './inputside';

const ContactPage = () => {
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
            <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
              <Chip
                icon={<ContactSupport sx={{ fontSize: '0.9rem !important', color: '#274C77 !important' }} />}
                label="HydroGuard Helpdesk"
                size="small"
                sx={{
                  bgcolor: 'rgba(39, 76, 119, 0.08)',
                  color: '#274C77',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              />
              <Chip
                icon={<Shield sx={{ fontSize: '0.9rem !important', color: '#6096BA !important' }} />}
                label="Ministry of Jal Shakti Support"
                size="small"
                sx={{
                  bgcolor: 'rgba(96, 150, 186, 0.12)',
                  color: '#274C77',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', letterSpacing: '-0.5px' }}>
              Contact HydroGuard Technical Team
            </Typography>
          </Box>
          <Chip
            label="Response within 24 Hours"
            color="primary"
            variant="outlined"
            sx={{ borderColor: '#274C77', color: '#274C77', fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, maxWidth: 840 }}>
          Have inquiries regarding dam sensor integration, telemetry access, or command-area crop model calibrations? Connect directly with our engineering and research coordinators.
        </Typography>
      </Paper>

      {/* Unified Responsive Split Card */}
      <Paper
        elevation={0}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(27, 59, 111, 0.08)',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Left: Contact Info */}
        <DetailsBar />

        {/* Right: Contact Form */}
        <InputSide />
      </Paper>
    </div>
  );
};

export default ContactPage;
