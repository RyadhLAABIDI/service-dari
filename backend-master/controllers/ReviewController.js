import ReviewM from "../models/ReviewModel.js"; 
import ServiceM from "../models/ServiceModel.js"; 
import mongoose from "mongoose";

const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { serviceId } = req.params; // Utiliser serviceId
    const client = req.payload._id;  // Récupérer le client depuis le token JWT
  
    try {
      // Log des valeurs pour vérifier ce qui est reçu
      console.log("Service ID:", serviceId);
      console.log("Client ID:", client);
      console.log("Rating:", rating);
      console.log("Comment:", comment);
  
      // Récupérer le service et le fournisseur associé
      const serviceDetails = await ServiceM.findById(serviceId).populate('provider');
      
      if (!serviceDetails) {
        console.log("Service non trouvé !");
        return res.status(404).json({ message: "Service not found" });
      }
  
      const provider = serviceDetails.provider; // Récupérer le fournisseur lié au service
  
      // Log pour vérifier le fournisseur
      console.log("Provider ID:", provider._id);
  
      const newReview = new ReviewM({
        client,
        service: serviceId,  // Associer l'id du service
        provider: provider._id, // Utiliser le provider lié au service
        rating,
        comment,
      });
  
      await newReview.save();
      res.status(201).json({
        status: true,
        message: "Review successfully created",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la review:", error.message);
      res.status(500).json({ message: 'Failed to create review: ' + error.message });
    }
  };
  

const getAllReviews = async (req, res) => {
    try {
        const reviews = await ReviewM.find({ etatDelete: false })
            .populate('client')
            .populate('service')
            .populate('provider');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get reviews: ' + error.message });
    }
};

const getReviewsByService = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const reviews = await ReviewM.find({ service: serviceId, etatDelete: false })
            .populate('client')
            .populate('provider');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get reviews for service: ' + error.message });
    }
};

const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const updatedReview = await ReviewM.findByIdAndUpdate(reviewId, { etatDelete: true }, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: 'Review marked as deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark review as deleted: ' + error.message });
    }
};

const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const updatedReview = await ReviewM.findByIdAndUpdate(reviewId, {
            rating,
            comment
        }, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({
            message: "Review updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update review: ' + error.message });
    }
};
const getReviewsByClientId = async (req, res) => {
  const { clientId } = req.params;
  console.log('Received clientId:', clientId); // Vérifiez que clientId est correctement reçu
  
  try {
    const clientObjectId = new mongoose.Types.ObjectId(clientId); // Convertir clientId en ObjectId
    const reviews = await ReviewM.find({ client: clientObjectId, etatDelete: false })
      .populate('service')
      .populate('provider');
    
    console.log('Reviews found:', reviews); // Log des reviews trouvées
  
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this client' });
    }
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error); // Log d'erreur
    res.status(500).json({ message: 'Error fetching reviews by client: ' + error.message });
  }
};

// ReviewController.js
const getReviewsByServiceAndClient = async (req, res) => {
  const { serviceId, clientId } = req.params;

  try {
    const reviews = await ReviewM.find({ service: serviceId, client: clientId, etatDelete: false })
        .populate('client')
        .populate('provider');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reviews for service and client: ' + error.message });
  }
};

  
export default {getReviewsByServiceAndClient, createReview,getAllReviews,getReviewsByService,deleteReview,updateReview,getReviewsByClientId};