import React from 'react';
import { Box, Typography, Stack, IconButton, Chip } from '@mui/material';
import {
  PhoneInTalk,
  Email,
  LocationOn,
  AccessTime,
  LinkedIn,
  Instagram,
  GitHub,
  WaterDrop,
} from '@mui/icons-material';

const DetailsBar = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #1B3B6F 0%, #0B2545 100%)',
        color: '#FFFFFF',
        p: { xs: 3, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', lg: '560px' },
      }}
    >
      {/* Subtle decorative background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(96, 150, 186, 0.12)',
          filter: 'blur(25px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Section */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Chip
          icon={<WaterDrop sx={{ fontSize: '0.85rem !important', color: '#A3CEF1 !important' }} />}
          label="Direct Helplines"
          size="small"
          sx={{
            bgcolor: 'rgba(163, 206, 241, 0.15)',
            color: '#A3CEF1',
            fontWeight: 600,
            mb: 2,
            border: '1px solid rgba(163, 206, 241, 0.2)',
            fontSize: '0.72rem',
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.3px', color: '#FFFFFF' }}>
          Contact Information
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
          Reach out for operational dam telemetry feeds, command-area GIS calibration, or academic research collaboration.
        </Typography>
      </Box>

      {/* Contact Channels */}
      <Stack spacing={2} sx={{ my: 3.5, position: 'relative', zIndex: 1 }}>
        {/* Phone */}
        <Box
          component="a"
          href="tel:+919501503324"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
            p: 1.2,
            borderRadius: '10px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              transform: 'translateX(3px)',
            },
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              bgcolor: 'rgba(163, 206, 241, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A3CEF1',
              flexShrink: 0,
            }}
          >
            <PhoneInTalk fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.68rem' }}>
              Telephone Support
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF', wordBreak: 'break-word' }}>
              +91 9501503324
            </Typography>
          </Box>
        </Box>

        {/* Email */}
        <Box
          component="a"
          href="mailto:arnamchaurasiya@gmail.com"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
            p: 1.2,
            borderRadius: '10px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              transform: 'translateX(3px)',
            },
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              bgcolor: 'rgba(163, 206, 241, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A3CEF1',
              flexShrink: 0,
            }}
          >
            <Email fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.68rem' }}>
              Technical Email
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF', wordBreak: 'break-all' }}>
              arnamchaurasiya@gmail.com
            </Typography>
          </Box>
        </Box>

        {/* Location */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.2,
            borderRadius: '10px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              bgcolor: 'rgba(163, 206, 241, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A3CEF1',
              flexShrink: 0,
            }}
          >
            <LocationOn fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.68rem' }}>
              Headquarters
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
              Ministry of Jal Shakti / TIET, Patiala
            </Typography>
          </Box>
        </Box>

        {/* Hours */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.2,
            borderRadius: '10px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              bgcolor: 'rgba(163, 206, 241, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A3CEF1',
              flexShrink: 0,
            }}
          >
            <AccessTime fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.68rem' }}>
              Monitoring Hours
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
              Mon - Sat: 9:00 AM - 6:00 PM IST
            </Typography>
          </Box>
        </Box>
      </Stack>

      {/* Social / Direct Links Footer */}
      <Box sx={{ position: 'relative', zIndex: 1, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', mb: 1, fontWeight: 500 }}>
          Team Chakravyuh Repository & Socials:
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <IconButton
            component="a"
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: '#FFFFFF',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: '#0077B5', transform: 'translateY(-2px)' },
              transition: 'all 0.2s',
            }}
          >
            <LinkedIn fontSize="small" />
          </IconButton>
          <IconButton
            component="a"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: '#FFFFFF',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: '#333333', transform: 'translateY(-2px)' },
              transition: 'all 0.2s',
            }}
          >
            <GitHub fontSize="small" />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: '#FFFFFF',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: '#E1306C', transform: 'translateY(-2px)' },
              transition: 'all 0.2s',
            }}
          >
            <Instagram fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default DetailsBar;
