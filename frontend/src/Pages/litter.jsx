import { useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import './litter.css';
import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { Videocam, CameraAlt } from '@mui/icons-material';

const Litter = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();
  }, []);

  const captureFrame = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      try {
        const response = await axios.post(`${API_BASE_URL}/detect`, { image: imageData }, {
          responseType: 'blob',
        });

        const videoBlob = new Blob([response.data], { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(videoBlob);

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = videoURL;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error sending image to backend or fetching video:', error);
      }
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
          maxWidth: '800px',
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Chip
          icon={<Videocam sx={{ fontSize: '0.85rem !important' }} />}
          label="Computer Vision Module"
          size="small"
          sx={{ bgcolor: 'rgba(39, 76, 119, 0.08)', color: '#274C77', fontWeight: 700, mb: 1.5 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 1 }}>
          Water Surface Litter & Debris Detection
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Analyze optical camera feed to detect floating waste and sediment accumulation along canal channels.
        </Typography>

        <Box sx={{ position: 'relative', width: '100%', maxWidth: '640px', mx: 'auto', mb: 3 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              borderRadius: '14px',
              backgroundColor: '#0F172A',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
              display: 'block',
            }}
          />
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<CameraAlt />}
          onClick={captureFrame}
          sx={{
            bgcolor: '#1B3B6F',
            '&:hover': { bgcolor: '#0B2545' },
            px: 4,
            py: 1.4,
            borderRadius: '10px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)',
          }}
        >
          Capture and Detect Debris
        </Button>
      </Paper>
    </div>
  );
};

export default Litter;
