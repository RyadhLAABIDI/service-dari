import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Typography, Grid, Box, FormControl, Select as MUISelect, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom'; // Importer Link depuis react-router-dom

// Style spécifique du template pour les cartes, les boutons, les textes, etc.
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



// Appliquer un fond dégradé
const BackgroundBox = styled(Box)({
  background: 'linear-gradient(135deg, #007bff, #00c6ff)', 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '50px',
  borderRadius: '15px',
});

const BookingP = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const providerId = localStorage.getItem('providerId');

  useEffect(() => {
    if (providerId) {
      axios
        .get('http://localhost:9001/service/getServiceByProviderId', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          const serviceOptions = response.data.map((service) => ({
            value: service._id,
            label: service.title,
          }));
          setServices([{ value: 'all', label: 'Tous les Réservations De toute Les Services' }, ...serviceOptions]);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des services:', error);
        });
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) {
      setIsLoading(true);
      setBookings([]);

      let requestUrl = '';
      if (!selectedService || selectedService.value === 'all') {
        requestUrl = `http://localhost:9001/booking/getBookingsByProviderId/${providerId}`;
      } else {
        requestUrl = `http://localhost:9001/booking/getBookingsByServiceId/${selectedService.value}`;
      }

      axios
        .get(requestUrl)
        .then((response) => {
          setBookings(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des réservations:', error);
          setIsLoading(false);
        });
    }
  }, [selectedService, providerId]);

  const handleStatusChange = (bookingId, status) => {
    axios
      .put(`http://localhost:9001/booking/updateBookingStatus/${bookingId}`, { status })
      .then(() => {
        alert('Statut de la réservation mis à jour avec succès');
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      });
  };

  return (
    <BackgroundBox>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#ffffff', 
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Your Bookings
      </Typography>
  
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <Select
          value={selectedService}
          onChange={(option) => setSelectedService(option)}
          options={services}
          placeholder="Choisir un service"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: '8px', 
              padding: '5px',
              minHeight: '45px', 
              fontSize: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              border: '1px solid #007bff', 
            }),
            menu: (base) => ({
              ...base,
              borderRadius: '8px',
              zIndex: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0, 123, 255, 0.4)',
              },
            }),
          }}
        />
      </FormControl>
  
      {isLoading ? (
        <Typography align="center" sx={{ color: '#ffffff' }}>Chargement des réservations...</Typography>
      ) : bookings.length > 0 ? (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <StyledCard>
                {booking.service?.avatar && (
                  <ServiceImage
                    src={`http://localhost:9001/images/service/${booking.service.avatar}`}
                    alt={booking.service.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service : {booking.service?.title || 'Service non disponible'}
                  </Typography>
                  <Typography>
                    Client :{' '}
                    <Link to={`/provider/user/${booking.client._id}/profile`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                      {booking.client?.userName || 'Client non disponible'}
                    </Link>
                  </Typography>
                  <Typography>Date : {new Date(booking.date).toLocaleDateString()}</Typography>
                  <Typography>Créneau : {booking.timeSlot}</Typography>
                  <Typography>Status : {booking.status}</Typography>
                  <Typography>Commentaires : {booking.comments || 'Aucun commentaire'}</Typography>
  
                  <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <MUISelect
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    >
                      <MenuItem value="Pending">En attente</MenuItem>
                      <MenuItem value="Confirmed">Confirmé</MenuItem>
                      <MenuItem value="Cancelled">Annulé</MenuItem>
                      <MenuItem value="Completed">Complété</MenuItem>
                    </MUISelect>
  
                    
                  </FormControl>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" sx={{ marginTop: '20px', color: '#ffffff' }}>
          {selectedService?.value === 'all'
            ? 'Aucune réservation trouvée pour ce fournisseur.'
            : 'Aucune réservation trouvée pour ce service.'}
        </Typography>
      )}
    </BackgroundBox>
  );
  
};

export default BookingP;
