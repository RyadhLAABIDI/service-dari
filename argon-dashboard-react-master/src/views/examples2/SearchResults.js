import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { services } = location.state || { services: [] };
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    comments: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Réinitialiser le formulaire et le service sélectionné lorsque les services sont mis à jour
    setFormData({
      date: '',
      timeSlot: '',
      comments: ''
    });
    setSelectedService(null);
    setError('');
    setSuccess('');
  }, [services]); // Dépendance sur `services` pour réinitialiser lorsque les services changent

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

        setTimeout(() => {
          setSuccess('');
        }, 2000);

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
  };

  // Styles adaptés de Categories.js
  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, height 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '330px',
    height: selectedService ? 'auto' : '360px', // Hauteur ajustée pour s'adapter au contenu
    margin: 'auto',
    cursor: 'pointer',
  };

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

  const serviceHoveredCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  // Gradients for background sections
  const serviceBackground = {
    background: 'linear-gradient(135deg, #7F00FF, #00BFFF)', // Purple to deep blue
    padding: '20px',
    borderRadius: '10px',
  };

  return (
    <div className="container-fluid py-5" style={serviceBackground}>
      <div className="text-center mb-5">
        <h6 className="text-secondary text-uppercase">Résultats de la recherche</h6>
        <h1 className="display-5">Services Disponibles</h1>
      </div>
      <div className="row justify-content-center">
        {services.length > 0 ? (
          services.map(service => (
            <div
              key={service._id}
              className="col-md-4 mb-4"
              onMouseEnter={() => setHoveredService(service._id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div
                className={`item card shadow service-card`}
                style={{
                  ...cardStyle,
                  height: selectedService && selectedService._id === service._id ? 'auto' : '300px',
                  ...(hoveredService === service._id ? serviceHoveredCardStyle : {}),
                }}
              >
                <img
                  src={`http://localhost:9001/images/service/${service.avatar}`}
                  alt={service.title}
                  style={imageStyle}
                />
                <div style={contentStyle}>
                  <h5 className="card-title" style={titleStyle}>{service.title}</h5>
                  <p className="card-text">{service.description}</p>
                  <p className="card-text"><strong>Fournisseur:</strong> {service.provider.userName}</p>
                  <p className="card-text"><strong>Prix:</strong> {service.price} DT</p>
                  <p className="card-text"><strong>Disponibilité:</strong> {service.availability ? "Disponible" : "Non disponible"}</p>
                  <p className="card-text"><strong>Localisation:</strong> {service.location}</p>
                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={() => setSelectedService(service)}
                  >
                    Réserver
                  </button>
                  {selectedService && selectedService._id === service._id && (
                    <div style={{ position: 'relative' }}>
                      {success && (
                        <div
                          className="alert alert-success text-center"
                          style={{
                            position: 'absolute',
                            top: '-60px',
                            left: '0',
                            width: '100%',
                            backgroundColor: 'lightgreen',
                            padding: '10px',
                            borderRadius: '10px',
                            zIndex: 1050,
                          }}
                        >
                          {success}
                        </div>
                      )}
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun service trouvé pour vos critères de recherche.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
