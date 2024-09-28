import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js';
import WOW from 'wowjs';

const Booking = ({ hideBooking }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    comments: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const clientId = localStorage.getItem('clientId');
        const token = localStorage.getItem('token');

        if (!clientId || !token) {
          setError('Identifiant client ou token manquant.');
          return;
        }

        const response = await axios.get(`http://localhost:9001/booking/getBookingsByClientId/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des réservations.');
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 2000); // Le message de succès disparaît après 2 secondes

      return () => clearTimeout(timer); // Nettoie le timeout si le composant est démonté ou si le success change
    }
  }, [success]);

  const handleEditClick = (booking) => {
    setIsEditing(true);
    setEditingBookingId(booking._id);
    setFormData({
      date: booking.date,
      timeSlot: booking.timeSlot,
      comments: booking.comments,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      date: '',
      timeSlot: '',
      comments: ''
    });
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:9001/booking/updateBooking/${editingBookingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Réservation mise à jour avec succès.');
      setIsEditing(false);
      setFormData({
        date: '',
        timeSlot: '',
        comments: ''
      });
      setBookings(bookings.map((booking) =>
        booking._id === editingBookingId ? { ...booking, ...formData } : booking
      ));
    } catch (error) {
      setError('Erreur lors de la mise à jour de la réservation.');
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:9001/booking/deleteBooking/${bookingToDelete}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Réservation supprimée avec succès.');
      setBookings(bookings.filter((booking) => booking._id !== bookingToDelete));
      setBookingToDelete(null);
    } catch (error) {
      setError('Erreur lors de la suppression de la réservation.');
    }
  };

  useEffect(() => {
    new WOW.WOW().init();
  }, []);

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const nextPage = () => {
    if (currentPage < Math.ceil(bookings.length / bookingsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Styles CSS pour les cartes, boutons, et flèches modernisés
  const cardStyle = {
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
    backgroundColor: '#000',  // Noir
    color: 'white',
  };

  const hoveredCardStyle = {
    transform: 'translateY(-10px) scale(1.05) rotateX(5deg) rotateY(-5deg)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  };

  const buttonStyle = {
    transition: 'all 0.4s ease',
    backgroundColor: '#007bff',  // Bleu
    color: 'white',
    borderRadius: '50px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  };

  const buttonHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#007bff',  // La couleur reste bleu au hover
  };

  const arrowStyle = {
    transition: 'all 0.4s ease',
    fontSize: '2.5rem',
    cursor: 'pointer',
    color: '#007bff',  // Bleu
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
  };

  const arrowHoverStyle = {
    color: '#007bff',  // La couleur reste bleu au hover
    transform: 'scale(1.2)',
  };

  if (hideBooking) {
    return null; // Ne pas rendre le composant si hideBooking est true
  }

  return (
    <div className="container-fluid px-0" style={{ margin: '6rem 0' }}>
      <div className="video wow fadeInUp" data-wow-delay="0.1s">
        <h1 className="text-white mb-4">Emergency Plumbing Service</h1>
        <h3 className="text-white mb-0">24 Hours 7 Days a Week</h3>
      </div>

      <div className="container position-relative wow fadeInUp" data-wow-delay="0.1s" style={{ marginTop: '-6rem' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-light text-center p-5">
              <h1 className="mb-4">Mes Réservations</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <div className="row">
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (
                    <div key={booking._id} className="col-md-6">
                      <div
                        className="card mb-4 shadow-sm"
                        style={{ ...cardStyle }}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoveredCardStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                      >
                        <div className="card-body">
                          <h5 className="card-title" style={{ color: 'gold' }}>Service: {booking.service.title}</h5>
                          {/* Changer le format de la date */}
                          <p className="card-text">
                            Date: {new Date(booking.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="card-text">Heure: {booking.timeSlot}</p>
                          <p className="card-text">Fournisseur: {booking.provider.userName}</p>
                          <p className="card-text">Commentaires: {booking.comments}</p>
                          <div className="d-flex justify-content-between">
                            <button
                              onClick={() => handleEditClick(booking)}
                              className="btn"
                              style={{ ...buttonStyle }}
                              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
                              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => setBookingToDelete(booking._id)}
                              className="btn"
                              style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
                              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucune réservation disponible.</p>
                )}
              </div>
              {isEditing && (
                <form className="mt-4" onSubmit={handleUpdateBooking}>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date de Service</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn w-100 me-2" style={buttonStyle}>
                      Enregistrer les modifications
                    </button>
                    <button type="button" className="btn w-100 ms-2" style={buttonStyle} onClick={handleCancelEdit}>
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Flèches de pagination */}
              <div className="d-flex justify-content-between mt-4">
                <div
                  className="arrow-left"
                  style={{ ...arrowStyle }}
                  onClick={prevPage}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, arrowHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, arrowStyle)}
                >
                  &#8249;
                </div>
                <div
                  className="arrow-right"
                  style={{ ...arrowStyle }}
                  onClick={nextPage}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, arrowHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, arrowStyle)}
                >
                  &#8250;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirmer la suppression</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteBooking}>Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Booking.propTypes = {
  hideBooking: PropTypes.bool, // Ajoutez ceci pour valider `hideBooking`
};

export default Booking;