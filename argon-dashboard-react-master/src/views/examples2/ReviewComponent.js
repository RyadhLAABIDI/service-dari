import { useState, useEffect } from 'react';
import { createReview, updateReview, deleteReview, getReviewsByServiceId, getReviewsByServiceIdAndClientId } from './reviewService'; // Import des services
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types'; // Import pour valider les props
import { useAuth } from '../../AuthContext'; // Import du contexte d'authentification

const ReviewComponent = ({ serviceId }) => {
  const { user } = useAuth(); // Récupérer l'utilisateur depuis le contexte AuthContext
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false); // Boîte de dialogue pour ajouter ou modifier une review
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false); // Boîte de dialogue pour afficher toutes les reviews
  const [showUserReviewsModal, setShowUserReviewsModal] = useState(false); // Boîte de dialogue pour afficher les reviews de l'utilisateur
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null); // Stocker la review sélectionnée pour la modification
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState([]); // State pour gérer les reviews existantes
  const [userReviews, setUserReviews] = useState([]); // State pour gérer les reviews de l'utilisateur connecté

  // Fonction pour récupérer les reviews par serviceId
   // Fonction pour récupérer les reviews par serviceId
   const fetchReviews = async () => {
    try {
      const response = await getReviewsByServiceId(serviceId);
      console.log('Fetched Reviews:', response);
      setReviews(response);
    } catch (error) {
      setError('Erreur lors de la récupération des reviews : ' + error.message);
    }
  };

  // Fonction pour récupérer les reviews de l'utilisateur connecté
  const fetchUserReviews = async () => {
    try {
      const clientId = localStorage.getItem('clientId');

      if (!clientId) {
        throw new Error('Client ID is missing. Please make sure you are logged in.');
      }

      console.log('clientId:', clientId);
      const reviews = await getReviewsByServiceIdAndClientId(serviceId, clientId);
      console.log('User Reviews:', reviews);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      setError('Erreur lors de la récupération des reviews : ' + error.message);
    }
  };

  // Fonction pour recharger les reviews
  const refreshReviews = async () => {
    try {
      await fetchReviews(); // Charger toutes les reviews
      await fetchUserReviews(); // Charger les reviews de l'utilisateur connecté
    } catch (error) {
      setError('Erreur lors du rafraîchissement des reviews : ' + error.message);
    }
  };

  // Effacer le message de succès après 2 secondes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 2000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [success]);

  // Afficher la boîte de dialogue pour ajouter une review
  const handleAddReview = () => {
    setIsUpdating(false);
    setSelectedReview(null);
    setRating('');
    setComment('');
    setShowReviewModal(true);
  };

  // Ouvrir la boîte de dialogue pour modifier une review
  const handleEditReview = (review) => {
    setIsUpdating(true);
    setSelectedReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowReviewModal(true);
  };

  // Soumettre la review (ajout ou mise à jour)
  const handleSubmitReview = async () => {
    try {
      if (isUpdating && selectedReview) {
        await updateReview(selectedReview._id, rating, comment);
        setSuccess('Review mise à jour avec succès !');
      } else {
        await createReview(serviceId, user.clientId, rating, comment);
        setSuccess('Review ajoutée avec succès !');
      }
      setShowReviewModal(false);
      setRating('');
      setComment('');
      await refreshReviews(); // Recharger les reviews après ajout ou modification
    } catch (error) {
      setError('Erreur : ' + error.message);
    }
  };

  // Supprimer une review
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setSuccess('Review supprimée avec succès !');
      await refreshReviews(); // Recharger les reviews après suppression
    } catch (error) {
      setError('Erreur lors de la suppression : ' + error.message);
    }
  };

  // Ouvrir la boîte de dialogue pour afficher toutes les reviews
  const handleShowAllReviews = () => {
    setShowAllReviewsModal(true);
    fetchReviews(); // Charger les reviews
  };

  // Ouvrir la boîte de dialogue pour afficher les reviews de l'utilisateur connecté
  const handleShowUserReviews = () => {
    setShowUserReviewsModal(true);
    fetchUserReviews(); // Charger les reviews de l'utilisateur connecté
  };

  return (
    <div className="review-interface">
      {/* Conteneur pour les boutons */}
      <div className="button-container">
        {user.role === 'USER' && ( // Afficher le bouton seulement pour les utilisateurs avec le rôle 'USER'
          <button className="btn-3d btn-3d-add" onClick={handleAddReview}>
          Ajouter Review
        </button>
        )}

          <button className="btn-3d btn-3d-show" onClick={handleShowAllReviews}>
            Afficher les Reviews
          </button>

          <button className="btn-3d btn-3d-user" onClick={handleShowUserReviews}>
            Mes Reviews
          </button>
      </div>

      {/* Modal d'ajout ou de mise à jour */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? 'Mettre à jour la review' : 'Ajouter une review'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Note (1 à 5)</label>
              <input
                type="number"
                className="form-control"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Commentaire</label>
              <textarea
                className="form-control"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                required
              />
            </div>
            <button type="button" className="btn-3d w-100" onClick={handleSubmitReview}>
              {isUpdating ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal pour afficher toutes les reviews */}
      <Modal show={showAllReviewsModal} onHide={() => setShowAllReviewsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Toutes les Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="card-3d mb-3">
                <div className="card-body">
                  <h5 className="card-title">Note: {review.rating}</h5>
                  <p className="card-text">{review.comment}</p>
                  {/* Afficher les boutons Modifier et Supprimer seulement si l'avis appartient à l'utilisateur */}
                  {review.client && user.clientId === review.client._id && (
                    <>
                      <button
                        className="btn-3d btn-warning mr-2"
                        onClick={() => handleEditReview(review)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn-3d btn-danger"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Il n/y a pas de reviews disponibles pour le moment.</p>
          )}
        </Modal.Body>
      </Modal>

            {/* Modal pour afficher les reviews de l'utilisateur connecté */}
            <Modal show={showUserReviewsModal} onHide={() => setShowUserReviewsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mes Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userReviews.length > 0 ? (
            userReviews.map((review) => (
              <div key={review._id} className="card-3d mb-3">
                <div className="card-body">
                  <h5 className="card-title">Note: {review.rating}</h5>
                  <p className="card-text">{review.comment}</p>
                  {/* Les boutons Modifier et Supprimer sont affichés ici car les reviews sont celles de l'utilisateur connecté */}
                  <button
                    className="btn-3d btn-warning mr-2"
                    onClick={() => handleEditReview(review)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-3d btn-danger"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Vous n/avez pas encore posté de reviews.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Message de succès ou d'erreur */}
      {success && <div className="alert alert-success mt-3">{success}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <style>{`
  /* Background noir pour l'interface principale */
  .review-interface {
    background-color: #000;
    color: white;
    padding: 20px;
    border-radius: 15px; /* Bordure arrondie plus marquée */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Ombre plus prononcée */
  }

  /* Conteneur pour les boutons */
  .button-container {
    display: flex;
    flex-direction: column; /* Affiche les boutons en colonne */
    gap: 15px; /* Espace entre les boutons */
    align-items: center; /* Centre les boutons horizontalement */
    margin-top: 20px; /* Espace au-dessus des boutons */
  }

  /* Style général pour les boutons 3D */
  .btn-3d {
    padding: 12px 24px;
    font-size: 1rem; /* Taille de police plus grande pour plus de lisibilité */
    max-width: 100%; /* Empêche le débordement horizontal */
    border: none;
    border-radius: 15px; /* Bordure arrondie plus marquée */
    color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Ombre plus prononcée */
    transition: all 0.3s ease-in-out;
    cursor: pointer; /* Change le curseur pour indiquer que c'est cliquable */
  }

  .btn-3d:hover {
    transform: translateY(-6px); /* Effet de survol plus marqué */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4); /* Ombre plus prononcée au survol */
  }

  /* Boutons avec des dégradés modernes */
  .btn-3d-add {
    background: linear-gradient(145deg, #f953c6, #b91d73); /* Dégradé rose/mauve */
  }

  .btn-3d-show {
    background: linear-gradient(145deg, #56CCF2, #2F80ED); /* Dégradé bleu clair/bleu foncé */
  }

  .btn-3d-user {
    background: linear-gradient(145deg, #4CAF50, #087f23); /* Dégradé vert clair/vert foncé */
  }

  /* Style pour assurer que les trois boutons ont la même taille */
  .btn-3d-add,
  .btn-3d-show,
  .btn-3d-user {
    width: 100%;
    max-width: 300px; /* Largeur maximale identique pour ces trois boutons */
  }

  /* Modal Styling for 3D Effect */
  .modal-content {
    background-color: #1c1c1c; /* Fond de modal sombre */
    color: white;
    border-radius: 20px; /* Bordure arrondie */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5); /* Ombre plus prononcée */
  }

  /* Alert Styling */
  .alert {
    transition: opacity 0.5s ease;
  }
`}</style>

    </div>
  );
};

// Validation des props
ReviewComponent.propTypes = {
  serviceId: PropTypes.string.isRequired, // serviceId est requis
};

export default ReviewComponent;
