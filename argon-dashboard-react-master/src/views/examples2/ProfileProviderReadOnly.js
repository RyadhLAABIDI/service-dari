import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IconButton, Box, Typography, Avatar, Grid, CircularProgress, Button, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import ReviewComponent from './ReviewComponent';
import Modal from 'react-bootstrap/Modal'; // Assurez-vous d'importer Modal

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

const StyledButton = styled('button')({
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '10px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const BackgroundBox = styled(Box)({
  background: 'linear-gradient(135deg, #007bff, #00c6ff)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '50px',
  borderRadius: '15px',
});

const ProfileProviderReadOnly = () => {
  const { providerId } = useParams();
  const [providerData, setProviderData] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ date: '', timeSlot: '', comments: '' });
  const [success, setSuccess] = useState('');
  const [showReviews, setShowReviews] = useState(null);
  const [showModal, setShowModal] = useState(false); // Etat pour afficher le modal de réservation
  const [error, setError] = useState('');
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
    navigate('/home');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:9001/booking/addBooknig/${selectedService._id}/${selectedService.provider._id}`,
        {
          serviceId: selectedService._id,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Réservation réussie !');
      setFormData({ date: '', timeSlot: '', comments: '' });
      setSelectedService(null);
      setShowModal(false); // Fermer le modal après la réservation
      setTimeout(() => setSuccess(''), 2000); // Effacer le message après 2 secondes
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setError('Une erreur est survenue lors de la réservation.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShowReviews = (service) => {
    // Vérifie si le service sélectionné est déjà celui dont les avis sont affichés
    if (showReviews === 'view' && selectedService?._id === service._id) {
      setShowReviews(null); // Cache les avis si le même service est cliqué
      setSelectedService(null);
    } else {
      setSelectedService(service);
      setShowReviews('view'); // Affiche les avis pour le service sélectionné
    }
  };

  const handleShowModal = (service) => {
    setSelectedService(service);
    setShowModal(true); // Ouvrir le modal pour réserver
  };

  const handleCancel = () => {
    setShowModal(false); // Fermer le modal sans réserver
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

                  {/* Boutons de la carte */}
                  <Box sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                    <StyledButton onClick={() => handleShowModal(service)}>
                      Réserver
                    </StyledButton>
                    
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

      {/* Modal de réservation */}
      <Modal show={showModal} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Réserver {selectedService?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && (
            <Box sx={{
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              padding: 2,
              marginBottom: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}>
              {success}
            </Box>
          )}
          <form onSubmit={handleBookingSubmit}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Créneau horaire"
              type="time"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Commentaires"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            {error && (
              <Box sx={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                padding: 2,
                marginBottom: 2,
                borderRadius: 1,
                textAlign: 'center',
              }}>
                {error}
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="success" type="submit">
                Confirmer
              </Button>
              <Button variant="outlined" color="error" onClick={handleCancel} sx={{ ml: 2 }}>
                Annuler
              </Button>
            </Box>
          </form>
        </Modal.Body>
      </Modal>
    </BackgroundBox>
  );
};

export default ProfileProviderReadOnly;
