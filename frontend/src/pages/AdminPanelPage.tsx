import { Container, Typography, Box, Button, Grid, Card, CardContent, CardActions, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HeroImageSlider from '../components/HeroImageSlider';

function AdminPanelPage() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Manage Menu', desc: 'Add, edit or remove menu items.', color: 'primary.main', icon: <MenuBookIcon />, path: '/admin-menu' },
    { title: 'View Bookings', desc: 'See and manage incoming bookings.', color: 'success.main', icon: <VisibilityIcon />, path: '/admin-orders' },
    { title: 'Data Analysis', desc: 'Review bookings, revenue, and popular menu items.', color: 'info.main', icon: <AnalyticsIcon />, path: '/admin-analysis' },
  ];

  return (
    <Box sx={{ bgcolor: '#fbf7ef', minHeight: '100vh', width: '100%', py: 4 }}>
      <Box sx={{ position: 'relative', height: { xs: 240, sm: 320 }, mx: { xs: 2, sm: 4, md: 8 }, overflow: 'hidden', borderRadius: 3, boxShadow: 3 }}>
        <HeroImageSlider />
      </Box>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6, gap: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }} gutterBottom>
              Admin Panel
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Quick shortcuts to manage menu, bookings and media for the site.
            </Typography>
          </Box>
          {/* header controls removed per request */}
        </Box>

      <Grid container spacing={4} justifyContent="center">
        {cards.map((c) => (
          <Box key={c.title} sx={{ width: { xs: '100%', sm: '48%', md: '30%' }, mb: 2 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: c.color, width: 56, height: 56 }}>{c.icon}</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{c.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{c.desc}</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(c.path)}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Grid>
      </Container>
      {/* Logout button moved into the page header */}
    </Box>
  );
}

export default AdminPanelPage;
