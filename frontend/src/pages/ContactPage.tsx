// Footer is provided globally by App.tsx
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Stack,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const initialState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

function ContactPage() {
  const [formData, setFormData] = useState(initialState);
  const [confirmation, setConfirmation] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 1. Send message to backend
    try {
      await import('../services/api').then(({ messageApi }) =>
        messageApi.send(formData)
      );
      setConfirmation('Your message has been sent!');
    } catch (err) {
      setConfirmation('Failed to send message. Please try again.');
      console.error('Failed to send message to backend:', err);
    }
    setOpenSnackbar(true);
    // 2. Open WhatsApp with message
    const whatsappNumber = '918147056141';
    const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    setFormData(initialState);
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
      <Box sx={{ flex: 1 }}>
        <Container
          maxWidth="lg"
          sx={{
            py: 3,
            minHeight: '100vh',
            bgcolor: '#f5f7fa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            backgroundImage: "url('/images/background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay for readability */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.7)',
              zIndex: 1,
            }}
          />
          <Box sx={{ width: '100%', zIndex: 2, position: 'relative' }}>
            <Paper elevation={4} sx={{ px: { xs: 2, md: 8 }, py: { xs: 4, md: 6 }, borderRadius: 4, mt: 4, mb: 6, bgcolor: 'white', boxShadow: 6, textAlign: 'center', maxWidth: 800, width: '100%', mx: 'auto' }}>
              <Box sx={{
                width: '100%',
                maxWidth: 1100,
                mx: 'auto',
                mt: 0,
                mb: 0,
                borderRadius: 0,
                boxShadow: 8,
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: "url('/images/background.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: { xs: 180, md: 280 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Overlay for better text contrast */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
                <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                  <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, textShadow: '2px 2px 12px rgba(0,0,0,0.7)', fontSize: { xs: 36, md: 60 }, letterSpacing: 2 }}>
                    Contact Us
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 500, textShadow: '1px 1px 8px rgba(0,0,0,0.5)', mt: 2 }}>
                    Get in touch with us for your catering needs
                  </Typography>
                </Box>
              </Box>
            </Paper>
            {/* Contact Details Section */}
            <Stack direction="row" spacing={4} sx={{ mt: 4, mb: 4, justifyContent: 'center', zIndex: 2, position: 'relative' }}>
              <Stack spacing={2} sx={{ flex: 1, minWidth: 220 }}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 3, borderRadius: 3 }}>
                  <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6">Phone</Typography>
                  <Typography>+91 8147056141</Typography>
                </Paper>
              </Stack>
              <Stack spacing={2} sx={{ flex: 1, minWidth: 220 }}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 3, borderRadius: 3 }}>
                  <EmailIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6">Email</Typography>
                  <Typography>srivrindas@mail.com</Typography>
                </Paper>
              </Stack>
              <Stack spacing={2} sx={{ flex: 1, minWidth: 220 }}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 3, borderRadius: 3 }}>
                  <LocationOnIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6">Address</Typography>
                  <Typography>
                    SLV Complex, 9th Cross, Ananth Nagar, Electronic City PH-2<br />
                    Bangalore, Karnataka<br />
                    India
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
            {/* Contact Form Section */}
            <Paper sx={{ p: 4, mt: 4, mb: 6, boxShadow: 4, borderRadius: 4, bgcolor: 'white', maxWidth: 800, width: '100%', mx: 'auto', zIndex: 2, position: 'relative' }}>
              <Typography variant="h4" gutterBottom>
                Send us a Message
              </Typography>
              <Snackbar
                open={openSnackbar && !!confirmation}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <MuiAlert
                  onClose={handleSnackbarClose}
                  severity={confirmation.includes('sent') ? 'success' : 'error'}
                  elevation={6}
                  variant="filled"
                  sx={{ fontSize: '1.1rem', fontWeight: 700 }}
                >
                  {confirmation}
                </MuiAlert>
              </Snackbar>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Stack>
                </Stack>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <StyledButton type="submit" variant="contained" size="large">
                    Send Message
                  </StyledButton>
                </Box>
              </form>
            </Paper>
          </Box>
          {/* Floating actions are provided globally by FloatingActions component */}
        </Container>
      </Box>
  {/* Footer is now global in App.tsx */}
    </Box>
  );
}

export default ContactPage;
