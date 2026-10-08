import { Box } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const heroImages = [
  '/images/slider1.jpg',
  '/images/slider2.jpg',
  '/images/slider3.jpg',
  '/images/slider4.jpg',
];

const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 250,
  rtl: true,
  pauseOnHover: false,
  pauseOnFocus: false,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function HeroImageSlider() {
  return (
    <Box
      className="hero-slider"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        '&, & .slick-list, & .slick-track, & .hero-slide': { height: '100%' },
        '& .slick-dots': { bottom: 24, zIndex: 3 },
        '& .slick-dots li button:before': { color: 'white', fontSize: 12, opacity: 0.65 },
        '& .slick-dots li.slick-active button:before': { opacity: 1 },
      }}
    >
      <Slider {...sliderSettings}>
        {heroImages.map((image, index) => (
          <Box className="hero-slide" key={image}>
            <Box
              component="img"
              src={image}
              alt={`Sri Vrinda's Catering food ${index + 1}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
