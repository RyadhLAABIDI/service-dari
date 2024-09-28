import express from "express";
import UserController from "../controllers/UserController.js"; 
import {verifyAdmin,verifyAndAuth,} from "../middleware/verifyToken.js"; 
import customMulter from '../middleware/multer.js';
const router = express.Router();



router.put("/", verifyAndAuth, customMulter("users"), UserController.updateAccount);
router.delete("/", verifyAndAuth, UserController.deleteAccount);
router.get("/profile", verifyAndAuth, UserController.getUser);
// Route pour récupérer un utilisateur par ID
router.get('/user/:id', verifyAndAuth, UserController.getUserById);
router.get("/", UserController.getAllUsers);
router.get("/admins", UserController.getAllAdmins);
router.put("/ban", UserController.banUser);
router.put("/unBan", UserController.unBanUser);
export default router;