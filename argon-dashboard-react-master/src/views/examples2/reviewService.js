import axios from 'axios';

// Base URL de votre API backend
const API_URL = 'http://localhost:9001';

// Fonction pour créer une review
export const createReview = async (serviceId, clientId, rating, comment) => {
  try {
    const token = localStorage.getItem('token'); // On récupère le token pour l'authentification
    const response = await axios.post(
      `${API_URL}/review/addReview/${serviceId}`, // Supprimer providerId de l'URL
      { rating, comment, clientId }, // Passer uniquement clientId dans le corps de la requête
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authentification via token
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to create review: ' + error.response?.data?.message || error.message);
  }
};

// Fonction pour supprimer une review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.patch(`${API_URL}/review/deleteReview/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete review: ' + error.response?.data?.message || error.message);
  }
};

// Fonction pour mettre à jour une review
export const updateReview = async (reviewId, rating, comment) => {
  try {
    const response = await axios.put(`${API_URL}/review/updateReview/${reviewId}`, { rating, comment });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update review: ' + error.response?.data?.message || error.message);
  }
};

// Fonction pour récupérer les reviews par serviceId
export const getReviewsByServiceId = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/review/getReviewsByService/${serviceId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch service reviews: ' + error.response?.data?.message || error.message);
  }
};

// Fonction pour récupérer les reviews par clientId
export const getReviewsByClientId = async (clientId) => {
  try {
    const token = localStorage.getItem('token'); // On récupère le token pour l'authentification
    const response = await axios.post(
      `${API_URL}/review/getReviewsByClientId/${clientId}`, // Endpoint pour récupérer les reviews par clientId
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authentification via token
        },
      }
    );
    return response.data; // Retourner les reviews récupérées
  } catch (error) {
    throw new Error('Failed to fetch client reviews: ' + error.response?.data?.message || error.message);
  }
};

export const getReviewsByServiceIdAndClientId = async (serviceId, clientId) => {
  try {
    const response = await axios.get(`${API_URL}/review/getReviewsByServiceAndClient/${serviceId}/${clientId}`);
    
    // Avec axios, les erreurs de statut HTTP sont lancées directement, donc pas besoin de vérifier la réponse manuellement
    return response.data; // Utiliser response.data pour obtenir le corps de la réponse

  } catch (error) {
    // Vérifie si l'erreur provient d'une réponse Axios et fournit un message utile
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code de statut en dehors de la plage 2xx
      throw new Error(`Erreur lors de la récupération des reviews : ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error('Aucune réponse reçue du serveur');
    } else {
      // Autre chose s'est produite lors de la configuration de la requête
      throw new Error('Erreur lors de la récupération des reviews : ' + error.message);
    }
  }
};

