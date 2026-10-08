// Footer is provided globally by App.tsx

import { Container, Typography, ImageList, ImageListItem, Box, Divider, Fade } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { galleryApi } from '../services/api';

interface GalleryImage {
  _id: string;
  url: string;
  caption: string;
}

// ✅ Local images stored inside public/images/
const localImages: GalleryImage[] = [
  { _id: '1', url: '/images/wedding.jpg', caption: 'Wedding Catering' },
  { _id: '2', url: '/images/buffet.jpg', caption: 'Buffet Setup' },
  { _id: '3', url: '/images/starters.jpg', caption: 'Delicious Starters' },
  { _id: '4', url: '/images/sweets.jpg', caption: 'Traditional Sweets' },
  { _id: '5', url: '/images/corp.jpg', caption: 'Corporate Event' },
  { _id: '6', url: '/images/food2.jpg', caption: 'Outdoor Catering' },
  { _id: '7', url: '/images/food3.jpg', caption: 'Outdoor Catering' },
  { _id: '8', url: '/images/food4.jpg', caption: 'Outdoor Catering' },
  { _id: '9', url: '/images/food5.jpg', caption: 'Outdoor Catering' },
  { _id: '10', url: '/images/food6.jpg', caption: 'Outdoor Catering' },
  { _id: '11', url: '/images/food7.jpg', caption: 'Outdoor Catering' },
  { _id: '12', url: '/images/food8.jpg', caption: 'Outdoor Catering' },
  { _id: '11', url: '/images/food9.jpg', caption: 'Outdoor Catering' },
 { _id: '11', url: '/images/food7.jpg', caption: 'Outdoor Catering' },

];


function GalleryPage() {
  // Load gallery images from server, fall back to local images if API fails
  const { data: images = localImages, isLoading } = useQuery<GalleryImage[], Error>({
    queryKey: ['gallery'],
    queryFn: async () => {
      const res = await galleryApi.getAll();
      return (res.data as GalleryImage[]) || localImages;
    },
    // keep local images while fetching
    initialData: localImages,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
      <Box sx={{ flex: 1 }}>
        {/* Decorative floating icons */}
        <Box sx={{ position: 'absolute', top: 30, left: 40, fontSize: 60, opacity: 0.10, zIndex: 0 }}>📸</Box>
        <Box sx={{ position: 'absolute', top: 120, right: 60, fontSize: 70, opacity: 0.10, zIndex: 0 }}>🍽️</Box>
        <Box sx={{ position: 'absolute', bottom: 60, left: 80, fontSize: 70, opacity: 0.10, zIndex: 0 }}>🎉</Box>
        {/* Hero Section */}
        <Fade in timeout={1200}>
          <Box>
            <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', mt: 6, mb: 5, borderRadius: 6, boxShadow: 8, position: 'relative', overflow: 'hidden', backgroundImage: "url('/images/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: { xs: 180, md: 280 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Overlay for better text contrast */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.45)', zIndex: 1 }} />
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, textShadow: '2px 2px 12px rgba(0,0,0,0.7)', zIndex: 2, fontSize: { xs: 36, md: 60 }, letterSpacing: 2 }}>
                Gallery
              </Typography>
            </Box>
          </Box>
        </Fade>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" color="text.secondary" textAlign="center" paragraph>
            A glimpse of our delicious creations and successful events
          </Typography>
          <Divider sx={{ width: 120, height: 5, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', borderRadius: 3, mx: 'auto', mb: 4 }} />
          <ImageList
            sx={{
              width: '100%',
              mt: 2,
              mb: 6,
              // Responsive columns
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            }}
            variant="masonry"
            cols={3}
            gap={14}
          >
            {images.map((item) => (
              <ImageListItem key={item._id} sx={{
                borderRadius: 4,
                boxShadow: '0px 8px 32px rgba(255,183,77,0.10)',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: '0px 16px 40px rgba(255,183,77,0.18)',
                  zIndex: 2,
                },
                position: 'relative',
              }}>
                <img
                  src={item.url}
                  alt={item.caption}
                  loading="lazy"
                  style={{ borderRadius: 12, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.98)' }}
                />
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.45)', color: 'white', py: 1, px: 2, fontWeight: 600, fontSize: 18, letterSpacing: 1, textAlign: 'center', opacity: 0.92, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                  {item.caption}
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
          {/* Floating actions handled globally by FloatingActions component in App.tsx */}
        </Container>
      </Box>
  {/* Footer is now global in App.tsx */}
    </Box>
  );
}

export default GalleryPage;
