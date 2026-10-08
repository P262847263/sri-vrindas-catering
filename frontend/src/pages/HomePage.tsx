// Footer is provided globally by App.tsx
import { Box, Button, Container, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useCart } from '../context/CartContext';
import React from 'react';
import HeroImageSlider from '../components/HeroImageSlider';

export default function HomePage() {
    const { setCartOpen } = useCart();
    const location = useLocation();

    React.useEffect(() => {
        // If redirected back after login with pending order, open cart and prefill
        const params = new URLSearchParams(location.search);
        const openCartParam = params.get('openCart');
        const pending = sessionStorage.getItem('pendingOrder');
        if (openCartParam === '1' || pending) {
            setCartOpen(true);
            // leave pendingOrder for CartSidebar to read, but we can also remove it here if desired
            // sessionStorage.removeItem('pendingOrder');
        }
    }, [location.search, setCartOpen]);
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
            <Box sx={{ flex: 1 }}>
                {/* Hero Section with Background Image */}
                <Box
                    sx={{
                        position: "relative",
                        overflow: 'hidden',
                        color: "white",
                        height: { xs: '80vh', md: '100vh' },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        zIndex: 1,
                    }}
                >
                    <HeroImageSlider />
                    {/* Gradient Overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: 'linear-gradient(120deg, rgba(0,0,0,0.55) 60%, rgba(255,183,77,0.25) 100%)',
                            zIndex: 1,
                            pointerEvents: 'none',
                        }}
                    />
                    {/* Hero Content */}
                    <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, pointerEvents: 'none' }}>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: "bold",
                                textShadow: "2px 2px 16px rgba(0,0,0,0.7)",
                                letterSpacing: 2,
                                mb: 2,
                            }}
                        >
                            Welcome to Sri Vrinda's Catering
                        </Typography>
                        <Typography
                            variant="h5"
                            paragraph
                            sx={{ mb: 3, textShadow: "1px 1px 8px rgba(0,0,0,0.6)", fontWeight: 400 }}
                        >
                            Fresh, Hygienic Vegetarian Food & Prasadam Seva
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mb: 3, color: '#ffe082', fontWeight: 500, textShadow: '1px 1px 8px #000' }}>
                            Serving devotion and taste for every occasion.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/menu"
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{
                                mt: 2,
                                px: 5,
                                py: 1.7,
                                pointerEvents: 'auto',
                                fontSize: "1.2rem",
                                borderRadius: "30px",
                                boxShadow: "0px 6px 24px rgba(255,183,77,0.25)",
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #ffb347 60%, #fff 100%)',
                                color: '#222',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #fff 0%, #ffb347 100%)',
                                    color: '#000',
                                },
                            }}
                        >
                            Book Now
                        </Button>
                    </Container>
                </Box>
                
                {/* Services Section */}
                <Container maxWidth="lg" sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        textAlign="center"
                        gutterBottom
                        sx={{ fontWeight: "bold", letterSpacing: 1, color: 'primary.main' }}
                    >
                        Our Services
                    </Typography>
                    <Box sx={{ width: 70, height: 5, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', borderRadius: 3, mx: 'auto', mb: 4 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                            gap: 5,
                            mt: 6,
                            justifyContent: 'center',
                        }}
                    >
                        {[
                            {
                                title: "Party Catering",
                                description: "Professional catering services for all your events.",
                                image: "/images/catering.jpg",
                                icon: '🍽️',
                                link: '/party-menu',
                            },
                            {
                                title: "Cloud Kitchen",
                                description: "Fresh food delivered to your doorstep.",
                                image: "/images/cloud-kitchan.jpg",
                                icon: '🏠',
                                link: '/cloud-kitchen',
                            },
                            {
                                title: "Regular Function Catering",
                                description: "Sacred food offerings for spiritual occasions.",
                                image: "/images/prasadamseva.jpg",
                                icon: '🙏',
                                link: '/regular-menu',
                            },
                        ].map((service) => (
                            <Card
                                key={service.title}
                                sx={{
                                    textAlign: "center",
                                    borderRadius: 4,
                                    boxShadow: "0px 8px 32px rgba(255,183,77,0.10)",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    "&:hover": { transform: "translateY(-12px) scale(1.03)", boxShadow: '0px 16px 40px rgba(255,183,77,0.18)' },
                                    background: 'rgba(255,255,255,0.97)',
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ fontSize: 38, mt: 2 }}>{service.icon}</Box>
                                {
                                    service.link ? (
                                        <RouterLink to={service.link} style={{ display: 'block', textDecoration: 'none' }}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={service.image}
                                                alt={service.title}
                                                sx={{ borderRadius: 3, width: '90%', mx: 'auto', my: 1, objectFit: 'cover', boxShadow: 2 }}
                                            />
                                        </RouterLink>
                                    ) : (
                                        <CardMedia
                                                component="img"
                                                height="200"
                                                image={service.image}
                                                alt={service.title}
                                                sx={{ borderRadius: 3, width: '90%', mx: 'auto', my: 1, objectFit: 'cover', boxShadow: 2 }}
                                            />
                                    )
                                }
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{ fontWeight: "bold", color: 'primary.main' }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                                        {service.description}
                                    </Typography>
                                    {/* removed explicit 'View Menu' button — image above is clickable when service.link exists */}
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
                {/* Highlights Section */}
                <Container maxWidth="lg" sx={{ py: 10, textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: 'primary.main', letterSpacing: 1 }}
                    >
                        Why Choose Us?
                    </Typography>
                    <Box sx={{ width: 60, height: 5, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', borderRadius: 3, mx: 'auto', mb: 3 }} />
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8, maxWidth: "700px", mx: "auto", fontSize: 20, mb: 2 }}
                    >
                        <span style={{ fontWeight: 600, color: '#ffb347' }}>✔️ Full-service catering</span> for events of all sizes.<br />
                        <span style={{ fontWeight: 600, color: '#ff6961' }}>✔️ Cloud kitchen</span> with fresh meals delivered to your doorstep.<br />
                        <span style={{ fontWeight: 600, color: '#77dd77' }}>✔️ Special prasadam</span> preparations for temples and religious events.
                    </Typography>
                </Container>
            </Box>
            {/* Footer is now global in App.tsx */}
        </Box>
    );
}
