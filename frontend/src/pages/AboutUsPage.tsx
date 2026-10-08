
import { Container, Typography, Box, Paper, Divider, Fade, Zoom } from "@mui/material";
// Footer is provided globally by App.tsx

function AboutUsPage() {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fffbe7 0%, #f5f7fa 100%)', position: 'relative' }}>
        <Box sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 8 }}>
            {/* Hero Banner */}
            <Fade in timeout={1200}>
              <Box
                sx={{
                  width: { xs: '95%', md: '70%' },
                  maxWidth: 700,
                  height: { xs: 160, md: 220 },
                  borderRadius: 16,
                  boxShadow: 8,
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 7,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  backgroundImage: "url('/images/abt1.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay for better text contrast */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.45)',
                    zIndex: 1,
                    borderRadius: 16,
                  }}
                />
                <Typography
                  variant="h2"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    color: '#fff',
                    zIndex: 2,
                    letterSpacing: 2,
                    textShadow: '0 2px 16px rgba(0,0,0,0.25)',
                    px: 3,
                  }}
                >
                  About Us
                </Typography>
              </Box>
            </Fade>
            {/* Story & Mission Section */}
            <Box sx={{ width: '100%', maxWidth: 1200 }}>
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 6,
                    alignItems: "center",
                    mb: 6,
                  }}
                >
                  {/* Story */}
                  <Paper elevation={4} sx={{ p: 4, borderRadius: 4, flex: 1, background: 'rgba(255,255,255,0.95)' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: 'primary.main' }}>
                      Our Story
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Sri Vrinda’s Catering Service was founded with a heartfelt vision —
                      to serve <strong>pure, fresh, and hygienic vegetarian meals</strong> infused
                      with devotion. What started as a humble prasadam seva has now
                      blossomed into a dedicated catering service.
                    </Typography>
                  </Paper>
                  <Box
                    component="img"
                      src="/images/ourr.jpg"
                    alt="Our Story"
                    sx={{ width: "100%", borderRadius: 4, boxShadow: 4, flex: 1, maxHeight: 320, objectFit: 'cover' }}
                  />
                </Box>
              </Zoom>
              <Divider sx={{ my: 5, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', height: 5, borderRadius: 2 }} />
              <Zoom in timeout={1200}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row-reverse" },
                    gap: 6,
                    alignItems: "center",
                    mb: 6,
                  }}
                >
                  {/* Mission */}
                  <Paper elevation={4} sx={{ p: 4, borderRadius: 4, flex: 1, background: 'rgba(255,255,255,0.95)' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: 'primary.main' }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      At Sri Vrinda’s, our mission is to <strong>bring people together through the joy of food</strong>. We
                      believe prasadam is not just nourishment for the body but also for the soul.
                    </Typography>
                  </Paper>
                  <Box
                    component="img"
                    src="/images/mission1.jpg"
                    alt="Our Mission"
                    sx={{ width: "100%", borderRadius: 4, boxShadow: 4, flex: 1, maxHeight: 320, objectFit: 'cover' }}
                  />
                </Box>
              </Zoom>
            </Box>
            {/* Values Section */}
            <Box sx={{ mt: 8, textAlign: "center", width: '100%', maxWidth: 1200 }}>
              <Fade in timeout={1500}>
                <Box>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main", letterSpacing: 1 }}
                  >
                    Our Core Values
                  </Typography>
                  <Box sx={{ width: 80, height: 6, background: 'linear-gradient(90deg, #ffb347 0%, #ff6961 100%)', borderRadius: 3, mx: 'auto', mb: 4 }} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 4,
                      mt: 2,
                    }}
                  >
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, flex: 1, background: 'rgba(255,255,255,0.95)' }}>
                      <Box
                        component="img"
                        src="/images/pure1.jpg"
                        alt="Purity"
                        sx={{ width: "80px", mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        🌱 Purity
                      </Typography>
                      <Typography color="text.secondary">
                        Fresh vegetarian prasadam prepared with utmost cleanliness.
                      </Typography>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, flex: 1, background: 'rgba(255,255,255,0.95)' }}>
                      <Box
                        component="img"
                        src="/images/devotion.jpg"
                        alt="Devotion"
                        sx={{ width: "80px", mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        🙏 Devotion
                      </Typography>
                      <Typography color="text.secondary">
                        Every meal is offered with love, making it prasadam for the soul.
                      </Typography>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, flex: 1, background: 'rgba(255,255,255,0.95)' }}>
                      <Box
                        component="img"
                        src="/images/community.jpg"
                        alt="Community"
                        sx={{ width: "80px", mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        👨‍👩‍👧‍👦 Community
                      </Typography>
                      <Typography color="text.secondary">
                        Spreading happiness through seva in festivals & gatherings.
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Fade>
            </Box>
          </Container>
        </Box>
  {/* Floating actions handled globally by FloatingActions component in App.tsx */}
      </Box>
  );
}

export default AboutUsPage;
