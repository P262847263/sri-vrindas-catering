import { Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const quickLinks = [
  { name: 'Party Menu', link: '/party-menu' },
  { name: 'Regular Menu', link: '/regular-menu' },
  { name: 'Cloud Kitchen', link: '/cloud-kitchen' },
  { name: 'Upvas Menu', link: '/upvas-menu' },
];

const Footer = () => (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 1.5,
        px: { xs: 0.5, md: 2 },
        mt: 2,
        position: 'relative',
        borderRadius: 6,
        overflow: 'hidden',
  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.18)',
  background: `linear-gradient(90deg, rgba(255,140,0,0.85) 0%, rgba(255,193,7,0.85) 100%), url('/images/food1.jpg') center/cover no-repeat`,
  color: '#000',
  fontWeight: 500,
  fontSize: { xs: '0.85rem', md: '0.92rem' },
  backdropFilter: 'blur(2px)',
  border: '1px solid rgba(255,255,255,0.18)',
      }}
    >
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between', mb: 2, zIndex: 2, position: 'relative' }}>
      {/* About Section */}
      <Box sx={{ flex: '1 1 220px', minWidth: 220, mb: { xs: 4, md: 0 }, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.08)', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#fff', fontWeight: 900, fontSize: '1.7rem', textShadow: '0 2px 8px #222, 0 1px 0 #222' }}>About</Typography>
        <Box sx={{ borderBottom: '4px solid #fff', width: 50, mb: 2, opacity: 0.9 }} />
        <Typography variant="body2" sx={{ color: '#000' }}>
          Sri Vrinda’s Catering Service was founded with a heartfelt vision — to serve pure, fresh, and hygienic vegetarian meals infused with devotion. What started as a humble prasadam seva has now blossomed into a dedicated catering service.
        </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <a href="https://www.facebook.com/share/1FcezX16Fk/" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ background: '#FFD600', color: 'black', boxShadow: 2, width: 56, height: 56 }}>
                  <FacebookIcon fontSize="large" />
                </IconButton>
              </a>
              <a href="https://www.instagram.com/sri_vrindass_catering?igsh=MTJzZDRxMW9jcDU4MA==" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ background: '#FFD600', color: 'black', boxShadow: 2, width: 56, height: 56 }}>
                  <InstagramIcon fontSize="large" />
                </IconButton>
              </a>
              <a href="https://youtube.com/@srivrindas?si=xBFbF_lSZmqgN70j" target="_blank" rel="noopener noreferrer">
                <IconButton sx={{ background: '#FFD600', color: 'black', boxShadow: 2, width: 56, height: 56 }}>
                  <YouTubeIcon fontSize="large" />
                </IconButton>
              </a>
            </Box>
          </Box>
      </Box>
      {/* Quick Links Section */}
      <Box sx={{ flex: '1 1 220px', minWidth: 220, mb: { xs: 4, md: 0 }, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.08)', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#fff', fontWeight: 900, fontSize: '1.7rem', textShadow: '0 2px 8px #222, 0 1px 0 #222' }}>Quick Links</Typography>
        <Box sx={{ borderBottom: '4px solid #fff', width: 50, mb: 2, opacity: 0.9 }} />
        <Box>
          {quickLinks.map((item) => (
            <Typography key={item.name} variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: '#000', transition: 'color 0.2s', '&:hover': { color: '#ffd700' } }}>
              <span style={{ marginRight: 8, color: '#ffd700' }}>&rarr;</span>
              <a href={item.link} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                {item.name}
              </a>
            </Typography>
          ))}
        </Box>
      </Box>
      {/* Contact Us Section */}
      <Box sx={{ flex: '1 1 220px', minWidth: 220, mb: { xs: 4, md: 0 }, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.08)', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#fff', fontWeight: 900, fontSize: '1.7rem', textShadow: '0 2px 8px #222, 0 1px 0 #222' }}>Contact Us</Typography>
        <Box sx={{ borderBottom: '4px solid #fff', width: 50, mb: 2, opacity: 0.9 }} />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            fontSize: '1.3rem',
            color: '#fff',
            textShadow: '2px 2px 8px #222, 0 0 2px #000',
            WebkitTextStroke: '1px #222',
            letterSpacing: '1px',
            mb: 1,
            textAlign: 'center',
            display: 'block',
            background: 'rgba(0,0,0,0.08)',
            borderRadius: 2,
            px: 1,
          }}
        >
          Sri Vrinda's Catering Services
        </Typography>
        <Typography variant="body2" sx={{ color: '#000' }}>SLV Complex,9th Cross,</Typography>
        <Typography variant="body2" sx={{ color: '#000' }}>Anatha Nagar,EC  ph2</Typography>
        <Typography variant="body2" sx={{ color: '#000' }}>Munireddy Layout, HSR Layout</Typography>
        <Typography variant="body2" sx={{ color: '#000' }}>Bengaluru - 560 100,</Typography>
        <Typography variant="body2" sx={{ color: '#000' }}>Karnataka, INDIA</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 4, p: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <a href="tel:8147056141" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/images/call.png" alt="Call and WhatsApp" style={{ width: 36, height: 36, marginRight: 12, borderRadius: '50%', border: '2px solid #ffd700', background: '#fff', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            <Typography variant="body2" sx={{ color: '#222', fontWeight: 700, fontSize: '1.15rem', letterSpacing: 0.5 }}>
              Phone: 8147056141
            </Typography>
          </a>
        </Box>
      </Box>
    </Box>
    <Box sx={{ textAlign: 'center', mt: 4, color: '#000', fontSize: '1.05rem', fontWeight: 700, letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      &copy; 2026 Sri Vrindas Catering. All rights reserved.
    </Box>
  </Box>
);

export default Footer;
