import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IconButton, Box, Typography, Avatar, Grid, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import ReviewComponent from '../examples2/ReviewComponent';

const StyledCard = styled('div')({
  borderRadius: '15px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const CardContent = styled('div')({
  padding: '20px',
  textAlign: 'left',
});

const ServiceImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
});

const BackgroundBox = styled(Box)({
  background: 'linear-gradient(135deg, #007bff, #00c6ff)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '50px',
  borderRadius: '15px',
});

const ProfileProviderReadOnlyyy = () => {
  const { providerId } = useParams();
  const [providerData, setProviderData] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showReviews, setShowReviews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const token = localStorage.getItem('token');
        const providerResponse = await axios.get(`http://localhost:9001/user/user/${providerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProviderData(providerResponse.data);

        const servicesResponse = await axios.get(
          `http://localhost:9001/service/getServiceByProvider?providerId=${providerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setServices(servicesResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du fournisseur:', error);
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, [providerId]);

  const handleBackClick = () => {
    navigate('/homeprov');
  };

  const handleShowReviews = (service) => {
    if (showReviews === 'view' && selectedService?._id === service._id) {
      setShowReviews(null);
      setSelectedService(null);
    } else {
      setSelectedService(service);
      setShowReviews('view');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BackgroundBox>
      <IconButton onClick={handleBackClick} sx={{ color: 'white' }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Profil du fournisseur */}
      <StyledCard sx={{ marginBottom: '20px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} textAlign="center">
              <Avatar
                src={`http://localhost:9001/images/users/${providerData.avatar}`}
                alt={providerData.userName}
                sx={{ width: 150, height: 150 }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" sx={{ color: 'black', fontSize: '2rem' }}>{providerData.userName}</Typography>
              <Typography variant="body1" sx={{ color: 'black', fontSize: '1.2rem' }}>Email: {providerData.email}</Typography>
              <Typography variant="body1" sx={{ color: 'black', fontSize: '1.2rem' }}>Téléphone: {providerData.phoneNumber}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Services du fournisseur */}
      <Box mt={4}>
        <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'white' }}>Services proposés</Typography>
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} key={service._id}>
              <StyledCard
                className="service-card"
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ServiceImage
                  src={`http://localhost:9001/images/service/${service.avatar}`}
                  alt={service.title}
                />

                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.2rem' }}>{service.title}</Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem' }}>{service.description}</Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>Prix: {service.price} DT</Typography>

                  <Box sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                    <Button
                      onClick={() => handleShowReviews(service)}
                      variant="outlined"
                      color="secondary"
                      sx={{ mt: 2 }}
                    >
                      Consulter Ou Ajouter Avis
                    </Button>
                  </Box>

                  {/* Afficher les avis directement sous la carte */}
                  {showReviews === 'view' && selectedService?._id === service._id && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.2rem', mb: 2 }}>
                        Avis pour {service.title}
                      </Typography>
                      <ReviewComponent serviceId={service._id} />
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </BackgroundBox>
  );
};

export default ProfileProviderReadOnlyyy;
