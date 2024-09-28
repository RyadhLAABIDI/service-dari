import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import axios from 'axios';
import WOW from 'wowjs';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    availability: false,
    location: '',
    avatar: null,
  });
  const carouselRef = useRef(null);

  const serviceCardStyle = {
    background: 'linear-gradient(135deg, #a2d9ff 0%, #007bbd 100%)',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    padding: '16px',
  };

  const StyledButton = styled(Button)({
    background: 'linear-gradient(135deg, #1D976C, #93F9B9)',
    borderRadius: '50px',
    padding: '8px 16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
  });

  const modernFormStyle = {
    background: 'linear-gradient(135deg, #000000, #1e3c72, #2a5298)',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
    marginTop: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    transform: 'translateZ(0)',
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9001/service/getServiceByProviderId', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const $carousel = $(carouselRef.current);
      $carousel.owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        autoplay: !isPaused,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        items: 3,
      });

      return () => {
        $carousel.trigger('destroy.owl.carousel');
      };
    }
  }, [services, isPaused]);

  useEffect(() => {
    new WOW.WOW().init();
  }, []);

  const togglePausePlay = () => {
    const $carousel = $(carouselRef.current);
    if (isPaused) {
      $carousel.trigger('play.owl.autoplay', [2000]);
    } else {
      const visibleItems = $carousel.find('.owl-item.active').index();
      $carousel.trigger('stop.owl.autoplay');
      $carousel.trigger('to.owl.carousel', [visibleItems, 200, true]);
    }
    setIsPaused(!isPaused);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleUpdateClick = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      availability: service.availability,
      location: service.location,
      avatar: service.avatar,
    });
    setShowUpdateDialog(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('availability', formData.availability);
      formDataToSend.append('location', formData.location);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const response = await axios.put(`http://localhost:9001/service/updateService/${selectedService._id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === selectedService._id
              ? { ...service, ...formData, avatar: response.data.avatar || service.avatar }
              : service
          )
        );
        setShowUpdateDialog(false);
        setSelectedService(null);
      } else {
        console.error('Erreur lors de la mise à jour du service:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service:', error.message);
    }
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:9001/service/deleteService/${selectedService._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== selectedService._id)
        );
        setShowDeleteDialog(false);
        setSelectedService(null);

        // Réinitialiser le carrousel après la suppression
        const $carousel = $(carouselRef.current);
        $carousel.trigger('destroy.owl.carousel'); // Détruire le carrousel existant
        $carousel.owlCarousel({
          loop: true,
          margin: 10,
          nav: false,
          dots: true,
          autoplay: !isPaused,
          autoplayTimeout: 2000,
          autoplayHoverPause: true,
          items: 3,
        });
      } else {
        console.error('Erreur lors de la suppression du service:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error.message);
    }
  };

  const handleCancel = () => {
    setShowUpdateDialog(false);
    setShowDeleteDialog(false);
    setSelectedService(null);
  };

  return (
    <div className="container-fluid py-5 px-4 px-lg-0">
      <div className="row g-0">
        <div className="col-lg-3 d-none d-lg-flex">
          <div className="d-flex align-items-center justify-content-center bg-primary w-100 h-100">
            <h1 className="display-3 text-white m-0" style={{ transform: 'rotate(-90deg)' }}>15 Years Experience</h1>
          </div>
        </div>
        <div className="col-md-12 col-lg-9">
          <div className="ms-lg-5 ps-lg-5">
            <div className="text-center text-lg-start wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="text-secondary text-uppercase">Your Services</h6>
              <h1 className="mb-5">Explore Your Services</h1>
            </div>
            <div
              ref={carouselRef}
              className="owl-carousel service-carousel position-relative wow fadeInUp"
              data-wow-delay="0.1s"
            >
              {services.length > 0 ? (
                services.map(service => (
                  <div
                    key={service._id}
                    className="service-card"
                    style={serviceCardStyle}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div className="d-flex align-items-center justify-content-center border border-5 border-white mb-4" style={{ width: '100%', height: '150px' }}>
                      <img
                        src={`http://localhost:9001/images/service/${service.avatar}`}
                        alt={service.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <h4 className="mb-3">{service.title}</h4>
                    <p>{service.description}</p>
                    <p>Prix: {service.price} DT</p>
                    <p>Disponibilité: {service.availability ? "Disponible" : "Non disponible"}</p>
                    <p>Localisation: {service.location}</p>
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://localhost:9001/images/users/${service.provider.avatar}`}
                        alt={service.provider.userName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                      />
                      <span>{service.provider.userName}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <StyledButton
                        onClick={() => handleUpdateClick(service)}
                        variant="contained"
                        color="primary"
                      >
                        Mettre à jour
                      </StyledButton>
                      <StyledButton
                        onClick={() => handleDeleteClick(service)}
                        variant="contained"
                        color="secondary"
                      >
                        Supprimer
                      </StyledButton>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun service disponible pour le moment.</p>
              )}
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary custom-prev mx-2"><i className="fa fa-chevron-left"></i></button>
              <button className="btn btn-primary custom-next mx-2"><i className="fa fa-chevron-right"></i></button>
            </div>
            <div className="text-center mt-4">
              <button 
                onClick={togglePausePlay} 
                className="btn btn-secondary">
                {isPaused ? "Reprendre le glissement" : "Arrêter le glissement"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Service Dialog */}
      <Dialog
        open={showUpdateDialog}
        onClose={handleCancel}
        aria-labelledby="update-service-dialog-title"
      >
        <DialogTitle id="update-service-dialog-title">{"Mettre à jour le service"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdateSubmit} sx={modernFormStyle}>
            <Typography variant="h6" gutterBottom>
              Mettre à jour le service : {formData.title}
            </Typography>
            <TextField
              label="Titre du Service"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
              InputProps={{ style: { color: '#ffffff' } }} // White input text color
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
              InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
              InputProps={{ style: { color: '#ffffff' } }} // White input text color
            />
            <TextField
              label="Prix"
              variant="outlined"
              fullWidth
              margin="normal"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              type="number"
              InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
              InputProps={{ style: { color: '#ffffff' } }} // White input text color
            />
            <TextField
              label="Localisation"
              variant="outlined"
              fullWidth
              margin="normal"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
              InputProps={{ style: { color: '#ffffff' } }} // White input text color
            />
            <TextField
              type="file"
              fullWidth
              margin="normal"
              name="avatar"
              onChange={handleFileChange}
              InputLabelProps={{
                shrink: true,
                style: { color: '#ffcc00' }, // Yellow label color
              }}
              inputProps={{
                accept: 'image/*',
                style: { color: '#ffffff' }, // White input text color
              }}
            />
            <div className="text-center mt-4">
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  background: 'linear-gradient(135deg, #56CCF2, #2F80ED)',
                }}
              >
                Confirmer
              </StyledButton>
              <StyledButton
                type="button"
                onClick={handleCancel}
                sx={{
                  background: 'linear-gradient(135deg, #EB5757, #000000)',
                  marginLeft: '16px',
                }}
              >
                Annuler
              </StyledButton>
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation de suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer le service &quot;{selectedService?.title}&quot; ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCancel} sx={{ background: 'linear-gradient(135deg, #EB5757, #000000)' }}>
            Annuler
          </StyledButton>
          <StyledButton onClick={handleDeleteConfirm} sx={{ background: 'linear-gradient(135deg, #1D976C, #93F9B9)' }} autoFocus>
            Confirmer
          </StyledButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Services;
