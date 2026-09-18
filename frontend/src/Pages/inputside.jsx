import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Send,
  CheckCircleOutline,
  PersonOutline,
  EmailOutlined,
  PhoneOutlined,
  TopicOutlined,
} from '@mui/icons-material';

const inquiryTypes = [
  'Dam Management & Reservoir Tracking',
  'Canal Seepage & Evaporation Loss',
  'Command Area & Crop Water Need',
  'Hydrological Data Integration',
  'General Inquiry & Collaboration',
];

const InputSide = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Dam Management & Reservoir Tracking',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setSnackbarOpen(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'Dam Management & Reservoir Tracking',
        message: '',
      });
    }, 600);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 3, sm: 4.5 },
        bgcolor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box>
        {/* Form Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B3B6F', mb: 0.5, letterSpacing: '-0.3px' }}>
            Send Us a Message
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Fill in the details below and our technical coordinators will respond promptly.
          </Typography>
        </Box>

        {submitted && (
          <Alert
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="success"
            onClose={() => setSubmitted(false)}
            sx={{ mb: 3, borderRadius: '10px' }}
          >
            Thank you! Your message has been sent successfully to the HydroGuard team.
          </Alert>
        )}

        {/* Input Fields Grid */}
        <Stack spacing={2.5}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {/* Full Name */}
            <TextField
              fullWidth
              required
              id="contact-full-name"
              label="Full Name"
              name="fullName"
              placeholder="e.g. Arnam Chaurasiya"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <PersonOutline sx={{ color: '#274C77', mr: 1, opacity: 0.7 }} />
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#FAFBFD',
                  '&:hover fieldset': { borderColor: '#6096BA' },
                  '&.Mui-focused fieldset': { borderColor: '#1B3B6F' },
                },
              }}
            />

            {/* Email Address */}
            <TextField
              fullWidth
              required
              id="contact-email"
              type="email"
              label="Email Address"
              name="email"
              placeholder="e.g. name@domain.com"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <EmailOutlined sx={{ color: '#274C77', mr: 1, opacity: 0.7 }} />
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#FAFBFD',
                  '&:hover fieldset': { borderColor: '#6096BA' },
                  '&.Mui-focused fieldset': { borderColor: '#1B3B6F' },
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {/* Phone Number */}
            <TextField
              fullWidth
              id="contact-phone"
              type="tel"
              label="Phone Number"
              name="phone"
              placeholder="+91 9501503324"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <PhoneOutlined sx={{ color: '#274C77', mr: 1, opacity: 0.7 }} />
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#FAFBFD',
                  '&:hover fieldset': { borderColor: '#6096BA' },
                  '&.Mui-focused fieldset': { borderColor: '#1B3B6F' },
                },
              }}
            />

            {/* Inquiry Category */}
            <TextField
              fullWidth
              select
              id="contact-inquiry-type"
              label="Topic / Inquiry Area"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              variant="outlined"
              size="medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <TopicOutlined sx={{ color: '#274C77', mr: 1, opacity: 0.7 }} />
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#FAFBFD',
                  '&:hover fieldset': { borderColor: '#6096BA' },
                  '&.Mui-focused fieldset': { borderColor: '#1B3B6F' },
                },
              }}
            >
              {inquiryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Message Area */}
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            id="contact-message"
            label="Your Message"
            name="message"
            placeholder="How can we assist you with dam data, irrigation analytics, or sensor monitoring?"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#FAFBFD',
                '&:hover fieldset': { borderColor: '#6096BA' },
                '&.Mui-focused fieldset': { borderColor: '#1B3B6F' },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Submit Action */}
      <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send />}
          sx={{
            bgcolor: '#1B3B6F',
            color: '#FFFFFF',
            px: 4,
            py: 1.4,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 4px 14px rgba(27, 59, 111, 0.25)',
            '&:hover': {
              bgcolor: '#0B2545',
              boxShadow: '0 6px 18px rgba(27, 59, 111, 0.35)',
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </Box>

      {/* Snackbar Toast */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', borderRadius: '10px' }}>
          Message sent! We will get back to you shortly.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InputSide;
