import ServiceM from "../models/ServiceModel.js"; 
import SubCategory from '../models/SubCategoryModel.js';


export const createService = async (req, res) => {
  // Log request body and file information
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  console.log('User Payload:', req.payload);

  const { title, description, subCategory, price, availability, location } = req.body;
  const avatar = req.file?.filename;
  const provider = req.payload._id;

  try {
    const newService = new ServiceM({
      provider,
      title,
      description,
      subCategory,
      price,
      availability,
      avatar,
      location, 
    });

    // Log new service object before saving
    console.log('New Service Object:', newService);

    await newService.save();
    res.status(201).json({
      status: true,
      message: 'Service has been successfully created',
    });
  } catch (error) {
    console.error('Error in createService:', error.message); // Log the error
    res.status(500).json({ message: 'Failed to create service: ' + error.message });
  }
};


const getServiceById = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const service = await ServiceM.findOne({ _id: serviceId, etatDelete: false }).populate('provider').populate('subCategory');
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service: ' + error.message });
    }
};

export const getAllServices = async (req, res) => {
    try {
        const services = await ServiceM.find().populate('provider').populate('subCategory');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get services: ' + error.message });
    }
};
const updateService = async (req, res) => {
    const { serviceId } = req.params;
    const { title, description, price, availability, location } = req.body;
    var avatar =req.file?.filename

    try {
        const updatedService = await ServiceM.findByIdAndUpdate(serviceId, {
            title,
            description,
            price,
            availability,
            location,
            avatar
        }, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service updated successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update service: ' + error.message });
    }
};

const deleteService = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const deletedService = await ServiceM.findByIdAndUpdate(serviceId, { etatDelete: true }, { new: true });
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: 'Service marked as deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark service as deleted: ' + error.message });
    }
};

const getServicesBySubCategoryId = async (req, res) => {
    const { subCategoryId } = req.params;

    try {
        const services = await ServiceM.find({ subCategory: subCategoryId, etatDelete: false })
            .populate('provider')
            .populate('subCategory');
        if (services.length === 0) {
            return res.status(404).json({ message: "No services found for this sub-category" });
        }
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services by sub-category: ' + error.message });
    }
};

const getServicesByProviderId = async (req, res) => {
    const providerId = req.payload._id

    try {
        const services = await ServiceM.find({ provider: providerId, etatDelete: false })
            .populate('provider')
            .populate('subCategory');
        if (services.length === 0) {
            return res.status(404).json({ message: "No services found for this provider" });
        }
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services by provider: ' + error.message });
    }
};

const getServicesByProvider = async (req, res) => {
    const { providerId } = req.query; // Récupérer l'ID du provider depuis les paramètres de la requête

    try {
        const services = await ServiceM.find({ provider: providerId, etatDelete: false })
            .populate('provider')
            .populate('subCategory');
        if (services.length === 0) {
            return res.status(404).json({ message: "No services found for this provider" });
        }
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services by provider: ' + error.message });
    }
};

const searchByServiceType = async (req, res) => {
    try {
      const { serviceType } = req.body;
  
      if (!serviceType) {
        return res.status(400).json({ message: 'Service type is required' });
      }
  
      // Rechercher l'ObjectId de la sous-catégorie en utilisant le nom
      const subCategory = await SubCategory.findOne({ name: serviceType });
  
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
  
      // Utiliser l'ObjectId de la sous-catégorie pour rechercher les services
      const services = await ServiceM.find({
        subCategory: subCategory._id,
        etatDelete: false, // Exclude soft-deleted services
      }).populate('provider').populate('subCategory');
  
      res.status(200).json({ services });
    } catch (error) {
      console.error('Error searching by service type:', error);
      res.status(500).json({ message: 'Error searching by service type', error: error.message });
    }
  };
  
  
 // Search by Location
export const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query; // Utiliser req.query pour les paramètres GET

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const services = await ServiceM.find({
      location: { $regex: location, $options: 'i' }, // Case-insensitive regex match
      etatDelete: false, // Exclude soft-deleted services
    }).populate('provider').populate('subCategory');

    res.status(200).json({ services });
  } catch (error) {
    console.error('Error searching by location:', error);
    res.status(500).json({ message: 'Error searching by location', error: error.message });
  }
};

  // Search by Availability
  export const searchByAvailability = async (req, res) => {
    try {
      const { availability } = req.query;  // Utilisation de req.query
   
      if (availability === undefined) {
        return res.status(400).json({ message: 'Availability status is required' });
      }
   
      const isAvailable = availability === 'true';
   
      const services = await ServiceM.find({
        availability: isAvailable,
        etatDelete: false, // Exclude soft-deleted services
      }).populate('provider').populate('subCategory');
   
      res.status(200).json({ services });
    } catch (error) {
      console.error('Error searching by availability:', error);
      res.status(500).json({ message: 'Error searching by availability', error: error.message });
    }
   };
   



export default {createService,getAllServices,getServiceById,deleteService,updateService,getServicesBySubCategoryId,getServicesByProviderId,getServicesByProviderId, getServicesByProvider, searchByServiceType, searchByLocation, searchByAvailability};