import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import WOW from 'wowjs';
import { Modal } from 'react-bootstrap';
import ReviewComponent from './ReviewComponent'; // Importation du composant ReviewComponent
import { Link } from 'react-router-dom';
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('');
  const [showSubCategories, setShowSubCategories] = useState(true);
  const [showServices, setShowServices] = useState(false);

  const [autoPlayCategory, setAutoPlayCategory] = useState(true);
  const [autoPlaySubCategory, setAutoPlaySubCategory] = useState(true);
  const [autoPlayService, setAutoPlayService] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    comments: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  
  // Nouveau state pour gérer le modal des reviews
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [selectedServiceForReviews, setSelectedServiceForReviews] = useState(null); // Pour garder en mémoire le service sélectionné pour les reviews

  const carouselRef = useRef(null);
  const subCategoriesCarouselRef = useRef(null);
  const servicesCarouselRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9001/category/getAllParentCategoriesWithSubcategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  const destroyCarousel = (ref) => {
    const $carousel = $(ref.current);
    if ($carousel.data('owl.carousel')) {
      $carousel.trigger('destroy.owl.carousel');
      $carousel.find('.owl-stage-outer').children().unwrap();
    }
  };

  const initializeOwlCarousel = (ref, itemsCount, autoPlay) => {
    const $carousel = $(ref.current);
    $carousel.owlCarousel({
      loop: itemsCount > 3,
      margin: 20,
      nav: false,
      dots: true,
      autoplay: autoPlay,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      items: Math.min(itemsCount, 4),
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
    });
  };

  useEffect(() => {
    if (categories.length > 0) {
      destroyCarousel(carouselRef);
      initializeOwlCarousel(carouselRef, categories.length, autoPlayCategory);
    }
  }, [categories, autoPlayCategory]);

  useEffect(() => {
    if (subCategories.length > 0) {
      destroyCarousel(subCategoriesCarouselRef);
      initializeOwlCarousel(subCategoriesCarouselRef, subCategories.length, autoPlaySubCategory);
    }
  }, [subCategories, autoPlaySubCategory]);

  useEffect(() => {
    if (services.length > 0) {
      destroyCarousel(servicesCarouselRef);
      initializeOwlCarousel(servicesCarouselRef, services.length, autoPlayService);
    }
  }, [services, autoPlayService]);

  useEffect(() => {
    new WOW.WOW().init();
  }, []);

  const toggleSubCategories = async (categoryId, subCategories) => {
    destroyCarousel(subCategoriesCarouselRef);

    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setSubCategories([]);
      setServices([]);
      setSelectedSubCategoryName('');
      setShowServices(false);
    } else {
      setActiveCategory(categoryId);
      setSubCategories(subCategories);
      setShowSubCategories(true);
      setShowServices(false);
    }
  };

  const handleSubCategoryClick = async (subCategory) => {
    try {
      setServices([]);
      setSelectedSubCategoryName('');
      setShowServices(false);

      const response = await axios.get(`http://localhost:9001/service/getServiceBySubCategoryId/${subCategory._id}`);
      setServices(response.data);
      setSelectedSubCategoryName(subCategory.name);
      setShowServices(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      setServices([]);
    }
  };

  const toggleShowSubCategories = () => {
    setShowSubCategories(!showSubCategories);
  };

  const toggleShowServices = () => {
    setShowServices(!showServices);
  };

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
        setFormData({
          date: '',
          timeSlot: '',
          comments: ''
        });
        setSelectedService(null);
        setShowModal(false); // Fermer le modal après la soumission
      } else {
        setError(response.data.message || 'Erreur lors de la réservation.');
      }
    } catch (error) {
      setError('Erreur lors de la réservation : ' + error.message);
    }
  };

  const handleCancel = () => {
    setSelectedService(null);
    setFormData({
      date: '',
      timeSlot: '',
      comments: ''
    });
    setError('');
    setSuccess('');
    setShowModal(false); // Fermer le modal lors de l'annulation
  };

  // Fonction pour ouvrir le modal avec les informations de réservation
  const handleOpenModal = (service) => {
    setSelectedService(service);
    setShowModal(true); // Afficher le modal
  };

  // Gérer l'affichage du modal des reviews
  const handleShowAllReviews = (service) => {
    setSelectedServiceForReviews(service); // Sélectionner le service pour afficher ses reviews
    setShowAllReviewsModal(true); // Ouvrir le modal
  };

  const handleCloseAllReviews = () => {
    setShowAllReviewsModal(false); // Fermer le modal
    setSelectedServiceForReviews(null); // Réinitialiser le service sélectionné
  };

  // Définition de cardStyle
  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, height 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    height: '300px',
    margin: 'auto',
  };

  // Styles pour les images et le contenu des cartes
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  };

  const formStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 3,
    width: '100%',
  };

  const categoryHoveredCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const subCategoryHoveredCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const serviceHoveredCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const messageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
    fontSize: '16px',
    zIndex: 3,
    textAlign: 'center',
    pointerEvents: 'none',
  };

  // Gradients for background sections
  const categoryBackground = {
    background: 'linear-gradient(135deg, #000000, #434343)',
    padding: '20px',
    borderRadius: '10px',
  };

  const subCategoryBackground = {
    background: 'linear-gradient(135deg, #434343, #7F00FF)',
    padding: '20px',
    borderRadius: '10px',
  };

  const serviceBackground = {
    background: 'linear-gradient(135deg, #7F00FF, #00BFFF)',
    padding: '20px',
    borderRadius: '10px',
  };

  return (
    <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s" style={categoryBackground}>
      <div className="text-center mb-5">
        <h6 className="text-secondary text-uppercase">Our Categories</h6>
        <h1 className="display-5">Explore Our Categories</h1>
      </div>

      {/* Carrousel Owl pour les catégories */}
      <div ref={carouselRef} className="owl-carousel category-carousel position-relative wow fadeInUp" data-wow-delay="0.1s">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className={`item card shadow category-card`}
              onClick={() => toggleSubCategories(category._id, category.SubCategory)}
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                ...cardStyle,
                ...(hoveredCategory === category._id ? categoryHoveredCardStyle : {}),
                cursor: 'pointer',
              }}
            >
              <img
                src={`http://localhost:9001/images/category/${category.avatar}`}
                alt={category.name}
                style={imageStyle}
              />
              <div style={contentStyle}>
                <h5 className="card-title" style={{ ...titleStyle, fontSize: '24px' }}>{category.name}</h5>
                
                <h6 style={{ color: '#007bff', marginTop: '10px', fontSize: '18px' }}>Liste des sous-catégories :</h6>
                
                {category.SubCategory && category.SubCategory.length > 0 ? (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {category.SubCategory.map((subCategory) => (
                      <li key={subCategory._id} style={{ fontSize: '16px', marginTop: '5px', color: '#007bff' }}>
                        {subCategory.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '16px', color: '#aaa', marginTop: '10px' }}>
                    Il n&rsquo;y a pas de sous-catégories disponibles pour le moment.
                  </p>
                )}
              </div>
              {hoveredCategory === category._id && (
                <div style={messageStyle}>
                  Cliquez pour trouver les sous-catégories !
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucune catégorie disponible pour le moment.</p>
        )}
      </div>

      {/* Icône ON/OFF pour les catégories */}
      <div className="text-center mt-3">
        <i
          className={`fas ${autoPlayCategory ? 'fa-toggle-on' : 'fa-toggle-off'}`}
          onClick={() => setAutoPlayCategory(!autoPlayCategory)}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: autoPlayCategory ? '#28a745' : '#dc3545',
          }}
          title={autoPlayCategory ? 'Fermer le glissage auto' : 'Ouvrir le glissage auto'}
        ></i>
      </div>

      {/* Flèches de navigation pour les catégories */}
      {categories.length > 3 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-primary custom-prev mx-2"
            onClick={() => $(carouselRef.current).trigger('prev.owl.carousel')}
            style={{
              position: 'relative',
              zIndex: 1000,
            }}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            className="btn btn-primary custom-next mx-2"
            onClick={() => $(carouselRef.current).trigger('next.owl.carousel')}
            style={{
              position: 'relative',
              zIndex: 1000,
            }}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Carrousel Owl pour les sous-catégories */}
      {subCategories.length > 0 && showSubCategories && (
        <div className="mt-5" style={subCategoryBackground}>
          <div className="text-center mb-5">
            <h6 className="text-secondary text-uppercase">Sous-Catégories DISPONIBLES POUR LA CATÉGORIE :</h6>
            <h1 className="display-5">{categories.find((cat) => cat._id === activeCategory)?.name}</h1>
          </div>
          <div ref={subCategoriesCarouselRef} className="owl-carousel sub-category-carousel position-relative wow fadeInUp" data-wow-delay="0.1s">
            {subCategories.map((sub) => (
              <div
                key={sub._id}
                className={`item card shadow subcategory-card`}
                onClick={() => handleSubCategoryClick(sub)}
                onMouseEnter={() => setHoveredSubCategory(sub._id)}
                onMouseLeave={() => setHoveredSubCategory(null)}
                style={{
                  ...cardStyle,
                  ...(hoveredSubCategory === sub._id ? subCategoryHoveredCardStyle : {}),
                  cursor: 'pointer',
                }}
              >
                <img
                  src={`http://localhost:9001/images/subcategory/${sub.avatar}`}
                  alt={sub.name}
                  style={imageStyle}
                />
                <div style={contentStyle}>
                  <h5 className="card-title" style={titleStyle}>{sub.name}</h5>
                </div>
                {hoveredSubCategory === sub._id && (
                  <div style={messageStyle}>
                    Cliquez pour trouver les services !
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Icône ON/OFF pour les sous-catégories */}
          <div className="text-center mt-3">
            <i
              className={`fas ${autoPlaySubCategory ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              onClick={() => setAutoPlaySubCategory(!autoPlaySubCategory)}
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                color: autoPlaySubCategory ? '#28a745' : '#dc3545',
              }}
              title={autoPlaySubCategory ? 'Fermer le glissage auto' : 'Ouvrir le glissage auto'}
            ></i>
          </div>

          {/* Flèches de navigation pour les sous-catégories sous le carousel */}
          <div className="text-center mt-4">
            <button
              className="btn btn-primary custom-prev-subcategory mx-2"
              onClick={() => $(subCategoriesCarouselRef.current).trigger('prev.owl.carousel')}
              style={{
                position: 'relative',
                zIndex: 1000,
              }}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-primary custom-next-subcategory mx-2"
              onClick={() => $(subCategoriesCarouselRef.current).trigger('next.owl.carousel')}
              style={{
                position: 'relative',
                zIndex: 1000,
              }}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>

          {/* Bouton pour masquer/afficher les sous-catégories */}
          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={toggleShowSubCategories}
              style={{
                position: 'relative',
                zIndex: 1000,
                marginTop: '10px',
              }}
            >
              {showSubCategories ? 'Masquer Sous-Catégories' : 'Afficher Sous-Catégories'}
            </button>
          </div>
        </div>
      )}

      {/* Carrousel Owl pour les services */}
      {services.length > 0 && showServices && (
        <div className="mt-5" style={serviceBackground}>
          <div className="text-center mb-5">
            <h6 className="text-secondary text-uppercase">Services Disponibles Pour La Sous Catégorie :</h6>
            <h1 className="display-5">{selectedSubCategoryName}</h1>
          </div>
          <div ref={servicesCarouselRef} className="owl-carousel service-carousel position-relative wow fadeInUp" data-wow-delay="0.1s">
            {services.map((service) => (
              <div
                key={service._id}
                className={`item card shadow service-card`}
                onMouseEnter={() => setHoveredService(service._id)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  ...cardStyle,
                  height: selectedService && selectedService._id === service._id ? 'auto' : '375px', // Hauteur ajustée à 350px pour plus d'espace
                  ...(hoveredService === service._id ? serviceHoveredCardStyle : {}),
                  cursor: 'pointer',
                }}
              >
                <img
                  src={`http://localhost:9001/images/service/${service.avatar}`}
                  alt={service.name}
                  style={imageStyle}
                />
                <div style={contentStyle}>
                  <h5 className="card-title" style={titleStyle}>{service.title}</h5>
                  <p className="card-text">{service.description}</p>
                  <p className="card-text">
          <strong>Fournisseur:</strong>{' '}
          <Link 
            to={`/provider/provider/${service.provider._id}/profile`} 
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            {service.provider.userName || 'Fournisseur non disponible'}
          </Link>
        </p>
                  <p className="card-text"><strong>Prix:</strong> {service.price} DT</p>
                  <p className="card-text"><strong>Disponibilité:</strong> {service.availability ? "Disponible" : "Non disponible"}</p>
                  <p className="card-text"><strong>Localisation:</strong> {service.location}</p>
                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={() => handleOpenModal(service)}
                  >
                    Réserver
                  </button>

                  {/* Bouton pour afficher les reviews */}
                  <button
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() => handleShowAllReviews(service)}
                  >
                    Voir les reviews
                  </button>

                  {/* Intégration du composant ReviewComponent */}
                  <ReviewComponent serviceId={service._id} />
                </div>
              </div>
            ))}
          </div>

          {/* Icône ON/OFF pour les services */}
          <div className="text-center mt-3">
            <i
              className={`fas ${autoPlayService ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              onClick={() => setAutoPlayService(!autoPlayService)}
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                color: autoPlayService ? '#28a745' : '#dc3545',
              }}
              title={autoPlayService ? 'Fermer le glissage auto' : 'Ouvrir le glissage auto'}
            ></i>
          </div>

          {/* Flèches de navigation pour les services sous le carousel */}
          <div className="text-center mt-4">
            <button
              className="btn btn-primary custom-prev-service mx-2"
              onClick={() => $(servicesCarouselRef.current).trigger('prev.owl.carousel')}
              style={{
                position: 'relative',
                zIndex: 1000,
              }}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-primary custom-next-service mx-2"
              onClick={() => $(servicesCarouselRef.current).trigger('next.owl.carousel')}
              style={{
                position: 'relative',
                zIndex: 1000,
              }}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>

          {/* Bouton pour masquer/afficher les services */}
          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={toggleShowServices}
              style={{
                position: 'relative',
                zIndex: 1000,
                marginTop: '10px',
              }}
            >
              {showServices ? 'Masquer Services' : 'Afficher Services'}
            </button>
          </div>

          {/* Modal pour la réservation */}
          <Modal show={showModal} onHide={handleCancel} centered>
            <Modal.Header closeButton>
              <Modal.Title>Réservation pour {selectedService?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleBookingSubmit} className="mt-4" style={formStyle}>
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
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success w-45">
                    Confirmer
                  </button>
                  <button type="button" className="btn btn-danger w-45" onClick={handleCancel}>
                    Annuler
                  </button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
            </Modal.Body>
          </Modal>

          {/* Modal pour afficher les reviews */}
          <Modal show={showAllReviewsModal} onHide={handleCloseAllReviews} centered>
            <Modal.Header closeButton>
              <Modal.Title>Reviews pour {selectedServiceForReviews?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ReviewComponent serviceId={selectedServiceForReviews?._id} />
            </Modal.Body>
          </Modal>

          {/* Success message */}
          {success && (
            <div
              className="alert alert-success text-center"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1050,
                width: '400px',
                backgroundColor: 'lightgreen',
                padding: '20px',
                borderRadius: '10px',
              }}
            >
              {success}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
