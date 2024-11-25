import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import axios from 'axios';
import WOW from 'wowjs';
import ReviewComponent from './ReviewComponent'; // Importer le ReviewComponent
import { Modal } from 'react-bootstrap'; // Importer Modal pour afficher la boîte de dialogue

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // Pour stocker le service sélectionné pour les reviews
  const [showReviewModal, setShowReviewModal] = useState(false); // Pour gérer l'affichage de la boîte de dialogue des reviews
  const [showBookingModal, setShowBookingModal] = useState(false); // Pour gérer l'affichage de la boîte de dialogue de réservation
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    comments: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  const serviceCardStyle = {
    background: 'linear-gradient(135deg, #a2d9ff 0%, #007bbd 100%)',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    padding: '16px',
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:9001/service/getAllService');
        setServices(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const $carousel = $(carouselRef.current);
    
    const initializeCarousel = () => {
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
    };

    if (services.length > 0) {
      initializeCarousel();

      $('.custom-next').click(function () {
        $carousel.trigger('next.owl.carousel');
      });

      $('.custom-prev').click(function () {
        $carousel.trigger('prev.owl.carousel');
      });
    }

    return () => {
      $carousel.trigger('destroy.owl.carousel');
    };
  }, [services, isPaused]);

  useEffect(() => {
    new WOW.WOW().init();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.date || !formData.timeSlot) {
      setError('Date et créneau horaire sont requis.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:9001/booking/addBooknig/${selectedService._id}/${selectedService.provider._id}`;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status || response.status === 200) {
        setSuccess('Réservation effectuée avec succès.');

        setBookingDetails({
          serviceName: selectedService.title,
          providerName: selectedService.provider.userName,
          date: formData.date,
          timeSlot: formData.timeSlot
        });

        setFormData({
          date: '',
          timeSlot: '',
          comments: ''
        });
        handleHideDetails(); // Fermer le modal et réinitialiser
      } else {
        setError(response.data.message || 'Erreur lors de la réservation.');
      }
    } catch (error) {
      setError('Erreur lors de la réservation : ' + error.message);
    }
  };

  // Fonction pour masquer les détails et fermer le modal
  const handleHideDetails = () => {
    setSelectedService(null);
    setBookingDetails(null);
    setSuccess('');
    setShowBookingModal(false); // Fermer le modal de réservation
  };

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

  // Fonction pour afficher le modal de réservation
  const handleShowBookingModal = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  // Fonction pour afficher le modal de reviews
  const handleShowReviewModal = (service) => {
    setSelectedService(service);
    setShowReviewModal(true);
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
              <h6 className="text-secondary text-uppercase">Our Services</h6>
              <h1 className="mb-5">Explore Our Services</h1>
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
                    <p>**Localisation: {service.location}**</p>

                    <button
                      onClick={() => handleShowBookingModal(service)}
                      className="btn bg-white text-primary w-100 mt-2"
                    >
                      Réserver<i className="fa fa-arrow-right text-secondary ms-2"></i>
                    </button>

                    <button
                      onClick={() => handleShowReviewModal(service)}
                      className="btn bg-white text-primary w-100 mt-2"
                    >
                      Voir les reviews<i className="fa fa-arrow-right text-secondary ms-2"></i>
                    </button>
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

      {/* Modal pour afficher le formulaire de réservation */}
      {selectedService && (
        <Modal show={showBookingModal} onHide={handleHideDetails} centered>
          <Modal.Header closeButton>
            <Modal.Title>Réserver {selectedService.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date de Service</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="timeSlot" className="form-label">Créneau horaire</label>
                <input
                  type="text"
                  className="form-control"
                  id="timeSlot"
                  name="timeSlot"
                  placeholder="Ex: 10:00 - 12:00"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="comments" className="form-label">Commentaires</label>
                <textarea
                  className="form-control"
                  id="comments"
                  name="comments"
                  rows="3"
                  value={formData.comments}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Confirmer la réservation
              </button>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && (
                <div className="alert alert-success mt-3">
                  {success}
                  <div className="mt-3">
                    <strong>Détails de la réservation :</strong>
                    <p>Service : {bookingDetails?.serviceName}</p>
                    <p>Fournisseur : {bookingDetails?.providerName}</p>
                    <p>Date : {bookingDetails?.date}</p>
                    <p>Heure : {bookingDetails?.timeSlot}</p>
                  </div>
                </div>
              )}
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal pour afficher les reviews */}
      {selectedService && (
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reviews pour {selectedService.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReviewComponent serviceId={selectedService._id} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Services;
