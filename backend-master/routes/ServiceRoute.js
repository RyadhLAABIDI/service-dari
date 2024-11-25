import express from "express";
import servController from "../controllers/ServiceController.js"; 
import customMulter from '../middleware/multer.js';
import {verifyAdmin,verifyAndAuth,} from "../middleware/verifyToken.js"; 
const router = express.Router();

router.post("/addService", verifyAndAuth, customMulter("service"), servController.createService);
router.get("/getServiceById/:serviceId", servController.getServiceById);
router.get("/getAllService", servController.getAllServices);
router.patch("/deleteService/:serviceId", servController.deleteService);
router.put("/updateService/:serviceId", customMulter("service"), servController.updateService);
router.get("/getServiceBySubCategoryId/:subCategoryId", servController.getServicesBySubCategoryId);
router.get("/getServiceByProviderId", verifyAndAuth, servController.getServicesByProviderId);
router.get("/getServiceByProvider", verifyAndAuth, servController.getServicesByProvider);
router.post("/search/service", servController.searchByServiceType);

router.get("/search/location", servController.searchByLocation);
router.get("/search/availability", servController.searchByAvailability);
export default router;