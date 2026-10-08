// Footer is provided globally by App.tsx
import { Container, Typography, Box, CardMedia, CardContent, Paper, Button } from "@mui/material";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Slider from "react-slick"; // install: npm install react-slick slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Floating actions handled globally

export default function EventsPage() {
  const navigate = useNavigate();
  // Add icons for each event type
  const eventIcons = {
    "Wedding Event": "💍",
    "Baby Shower (Seemantham)": "👶",
    "Corporate Events": "🏢",
    "Birthday Party": "🎂",
    "House Warming (Gruhapravesham)": "🏠",
    "Engagement": "💑",
    "Reception": "🎉",
    "Naming Ceremony": "🍼",
    "Get Together": "🤝",
    "Conferences & Seminars": "📚",
  } as const;

  type EventTitle = keyof typeof eventIcons;
  type EventType = {
    title: EventTitle;
    description: string;
    details: string;
    image: string;
  };
  const events: EventType[] = [
    {
      title: "Wedding Event",
      description: "Elegant catering service with customized menus to make weddings unforgettable.",
      details: "We offer complete catering packages for weddings, including multi-course meals, live counters, and beautifully presented dishes that suit both traditional and modern tastes.",
      image: "/images/marriage.jpg",
    },
    {
      title: "Baby Shower (Seemantham)",
      description: "Celebrate precious moments with curated menus for family and friends.",
      details: "Special menu selections that focus on fresh, healthy, and flavorful dishes for intimate gatherings like baby showers.",
      image: "/images/babyshower.jpg",
    },
    {
      title: "Corporate Events",
      description: "Professional catering for seminars, office parties, and team gatherings.",
      details: "Customizable catering options to suit corporate needs – from small team lunches to large conferences with hundreds of attendees.",
      image: "/images/corporate.jpg",
    },
    {
      title: "Birthday Party",
      description: "Make birthdays memorable with fun, delicious, and kids-friendly menus.",
      details: "We provide themed catering setups and versatile menu options perfect for both kids’ and adults’ birthday parties.",
      image: "/images/birthday.jpg",
    },
    {
      title: "House Warming (Gruhapravesham)",
      description: "Warm up your celebrations with delicious and beautifully arranged meals.",
      details: "Complete catering packages with traditional and modern dishes that perfectly match housewarming events.",
      image: "/images/housewarming.jpg",
    },
    {
      title: "Engagement",
      description: "Celebrate your special day with elegant food and presentations.",
      details: "From small private ceremonies to larger engagement events, we provide menus tailored to your preferences.",
      image: "/images/engagement.jpg",
    },
    {
      title: "Reception",
      description: "Grand catering service for receptions with wide menu options.",
      details: "We specialize in large-scale events, offering lavish buffets, multiple courses, and premium serving styles.",
      image: "/images/reception.jpg",
    },
    {
      title: "Naming Ceremony",
      description: "Celebrate the joy of naming your child with our catering service.",
      details: "Custom menus that bring warmth and delight to your family gathering on this special occasion.",
      image: "/images/naming.jpg",
    },
    {
      title: "Get Together",
      description: "Bring friends and family together over delicious food.",
      details: "We provide catering services for casual gatherings, reunions, and festive occasions of any size.",
      image: "/images/gathering.jpg",
    },
    {
      title: "Conferences & Seminars",
      description: "Professional catering for corporate and educational seminars.",
      details: "Efficient, hygienic, and quality catering service tailored for conferences, workshops, and training sessions.",
      image: "/images/conference.jpg",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
      <Box sx={{ flex: 1 }}>
        {/* Decorative floating icons */}
        <Box sx={{ position: 'absolute', top: 30, left: 40, fontSize: 60, opacity: 0.10, zIndex: 0 }}>🎉</Box>
        <Box sx={{ position: 'absolute', top: 120, right: 60, fontSize: 70, opacity: 0.10, zIndex: 0 }}>💍</Box>
        <Box sx={{ position: 'absolute', bottom: 60, left: 80, fontSize: 70, opacity: 0.10, zIndex: 0 }}>🎂</Box>
        <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
            {/* Hero Slider */}
            <Box sx={{ mb: 7 }}>
              <Slider {...sliderSettings}>
                {events.slice(0, 3).map((event) => (
                  <Box key={event.title} sx={{ position: "relative" }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        boxShadow: '0px 8px 32px rgba(255,183,77,0.10)',
                      }}
                    />
                    <Box sx={{ position: 'absolute', top: 30, left: 30, fontSize: 48, opacity: 0.85 }}>{eventIcons[event.title]}</Box>
                    <Typography
                      variant="h3"
                      sx={{
                        position: "absolute",
                        bottom: 30,
                        left: 30,
                        color: "white",
                        fontWeight: "bold",
                        background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)',
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: 3,
                        letterSpacing: 1,
                      }}
                    >
                      {event.title}
                    </Typography>
                  </Box>
                ))}
              </Slider>
          </Box>
        {/* Events Section */}
      {/* Beautiful hero for Services page */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          px: 2,
          background: 'linear-gradient(180deg, rgba(255,250,240,0.9), rgba(255,245,235,0.75))',
          borderRadius: 3,
          boxShadow: 3,
          mb: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 900,
            color: 'primary.main',
            letterSpacing: 1,
            lineHeight: 1.03,
            mb: 2,
            fontSize: { xs: '1.9rem', md: '2.6rem' },
            textTransform: 'none',
            textShadow: '0 6px 18px rgba(0,0,0,0.06)'
          }}
        >
          Catering Services for Your Special Events
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: 860,
            mx: 'auto',
            color: 'text.secondary',
            fontWeight: 500,
            mb: 3,
            fontSize: { xs: '1rem', md: '1.125rem' },
          }}
        >
          Fresh, wholesome vegetarian cuisine, beautiful presentation, and seamless service — crafted to turn every occasion into a warm, memorable celebration.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/menu"
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)',
              color: '#111',
              fontWeight: 800,
              px: 3,
              py: 1.25,
              borderRadius: 3,
              boxShadow: 4,
              '&:hover': { transform: 'translateY(-3px)' }
            }}
          >
            View Menus
          </Button>

         
        </Box>
      </Box>
      <Box sx={{ width: 80, height: 6, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', borderRadius: 3, mx: 'auto', mb: 4 }} />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            justifyContent: "center",
            mt: 4,
          }}
        >
          {events.map((event) => (
            <Paper
              key={event.title}
              elevation={6}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                width: "320px",
                boxShadow: '0px 8px 32px rgba(255,183,77,0.10)',
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s, box-shadow 0.3s",
                background: 'rgba(255,255,255,0.97)',
                '&:hover': { transform: "translateY(-10px) scale(1.03)", boxShadow: '0px 16px 40px rgba(255,183,77,0.18)' },
                mb: 2,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image}
                  alt={event.title}
                  sx={{ borderRadius: 0, width: '100%', objectFit: 'cover', boxShadow: 2 }}
                />
                <Box sx={{ position: 'absolute', top: 12, left: 16, fontSize: 32 }}>{eventIcons[event.title]}</Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: 'primary.main', letterSpacing: 1 }}>
                  {event.title}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ fontSize: 16 }}>
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                  {event.details}
                </Typography>
                <Box sx={{ textAlign: "center", mt: "auto" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "20px",
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: "bold",
                      background: 'linear-gradient(90deg, #ffb347 60%, #fff 100%)',
                      color: '#222',
                      fontSize: 17,
                      boxShadow: 2,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #fff 0%, #ffb347 100%)',
                        color: '#000',
                      },
                    }}
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      const waUrl = `https://wa.me/918147056141?text=${encodeURIComponent(
                        `Hello, I would like to book catering service for ${event.title}.`
                      )}`;
                      if (!token) {
                        navigate('/login');
                      } else {
                        window.open(waUrl, '_blank');
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Paper>
          ))}
        </Box>

        {/* Floating actions are provided globally by FloatingActions component */}
        </Container>
      </Box>
  {/* Footer is now global in App.tsx */}
    </Box>
  );
}
