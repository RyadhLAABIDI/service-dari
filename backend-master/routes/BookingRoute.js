import express from "express";
import BokController from "../controllers/BookingController.js"; 
import {verifyAdmin,verifyAndAuth,} from "../middleware/verifyToken.js"; 
const router = express.Router();


router.post("/addBooknig/:service/:provider", verifyAndAuth, BokController.createBooking);
router.get("/getAllBooknig", BokController.getAllBookings);
router.get("/getBookingById/:bookingId", BokController.getBookingById);
router.put("/updateBooking/:bookingId", BokController.updateBooking);
router.patch("/deleteBooking/:bookingId", BokController.deleteBooking);
router.put("/updateBookingStatus/:bookingId", BokController.updateBookingStatus);

router.get("/getBookingsByClientId/:clientId", BokController.getBookingsByClientId);
router.get("/getBookingsByProviderId/:providerId", BokController.getBookingsByProviderId);
router.get("/getBookingsByServiceId/:serviceId", BokController.getBookingsByServiceId);



export default router;