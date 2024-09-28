import express from "express";
import catController from "../controllers/CategoryController.js"; 
import customMulter from '../middleware/multer.js';
const router = express.Router();

router.post("/addParentCategory", customMulter("category"), catController.addParentCategory);
router.get("/getAllParentCategoriesWithSubcategories", catController.getAllParentCategoriesWithSubcategories);
router.patch('/categories/:categoryId', catController.markCategoryAsDeleted);
router.get('/getallcategories', catController.getAllCategories);






export default router;