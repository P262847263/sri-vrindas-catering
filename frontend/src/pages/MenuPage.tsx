// Footer is provided globally by App.tsx

import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Fade } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


const categories = [
  {
    name: 'Upvas Special',
    image: '/images/fasting.jpg', // Make sure this image exists or update the path
  link: '/upvas-menu',
    color: '#6ec6ff',
  icon: '🕉️',
    description: 'Fasting-friendly, sattvic dishes for Ekadashi, festivals, and special upvas days.'
  },
  {
    name: 'Regular Menu',
    image: '/images/regular.png',
    link: '/regular-menu',
    color: '#ffb347',
    icon: '🍽️',
    description: 'A classic selection of North & South Indian vegetarian dishes for all occasions.'
  },
  {
    name: 'Party Menu',
    image: '/images/party.png',
    link: '/party-menu',
    color: '#ff6961',
    icon: '🎉',
    description: 'Perfect for celebrations: starters, mains, desserts, and more for your guests.'
  },
  {
    name: 'Cloud  Kitchen',
    image: '/images/cloudkitchen.jpg',
    link: '/cloud-kitchen',
    color: '#ff6961',
    icon: '🎉',
    description: 'Ready to eat? Order now.'
  },
];

export default function MenuPage() {
  // search removed — always show categories

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
      <Box sx={{ flex: 1 }}>
        {/* Decorative floating icons */}
        <Box sx={{ position: 'absolute', top: 30, left: 40, fontSize: 60, opacity: 0.13, zIndex: 0 }}>
          🍽️
        </Box>
        <Box sx={{ position: 'absolute', top: 120, right: 60, fontSize: 70, opacity: 0.10, zIndex: 0 }}>
          🎉
        </Box>
        <Box sx={{ position: 'absolute', bottom: 60, left: 80, fontSize: 70, opacity: 0.10, zIndex: 0 }}>
          🎂
        </Box>
        <Container maxWidth="md" sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1200}>
            <Typography variant="h2" component="h1" fontWeight={800} color="primary.main" gutterBottom sx={{ letterSpacing: 2 }}>
              Explore Our Menus
            </Typography>
          </Fade>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            Choose the perfect menu for your occasion
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic', fontWeight: 400 }}>
            From traditional feasts to festive celebrations, we have something for everyone.
          </Typography>
          <Box sx={{ width: 80, height: 6, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', borderRadius: 3, mx: 'auto', mb: 2 }} />
        </Container>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6 }, flexWrap: 'wrap' }}>
            {categories.map((category, idx) => (
                <Fade in timeout={900 + idx * 300} key={category.name}>
                  <Card
                    sx={{
                      maxWidth: 360,
                      minWidth: 270,
                      textAlign: 'center',
                      borderRadius: 7,
                      boxShadow: 8,
                      background: `linear-gradient(120deg, #fff 60%, ${category.color}22 100%)`,
                      transition: 'transform 0.25s, box-shadow 0.25s',
                      '&:hover': {
                        transform: 'scale(1.055) translateY(-10px)',
                        boxShadow: 16,
                      },
                      p: 1,
                      mb: 4,
                    }}
                    elevation={0}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ fontSize: 38, mb: 1 }}>{category.icon}</Box>
                      <CardMedia
                        component="img"
                        image={category.image}
                        alt={category.name}
                        sx={{
                          borderRadius: '50%',
                          width: 140,
                          height: 140,
                          boxShadow: 4,
                          border: `4px solid ${category.color}`,
                          background: '#fff',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h5" fontWeight={700} color="primary" gutterBottom sx={{ letterSpacing: 1 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                        {category.description}
                      </Typography>
                      <RouterLink to={category.link} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          size="large"
                          sx={{
                            mt: 1,
                            background: `linear-gradient(90deg, ${category.color} 60%, #fff 100%)`,
                            color: '#222',
                            fontWeight: 700,
                            borderRadius: 3,
                            px: 4,
                            boxShadow: 2,
                            textTransform: 'none',
                            fontSize: 18,
                            letterSpacing: 0.5,
                            '&:hover': {
                              background: `linear-gradient(90deg, #fff 0%, ${category.color} 100%)`,
                              color: '#000',
                              boxShadow: 6,
                            },
                          }}
                        >
                          View Menu
                        </Button>
                      </RouterLink>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Box>
        </Container>
      </Box>
  {/* Footer is now global in App.tsx */}
    </Box>
  );
}
