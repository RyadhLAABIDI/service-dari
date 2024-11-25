import express from "express";
import customMulter from '../middleware/multer.js';
import subcat from "../controllers/SubCategoryController.js"
const router = express.Router();

router.post("/addSubCategory/:categoryId", customMulter("subcategory"), subcat.addSubCategory);
router.patch('/deletecategories/:subcategoryId', subcat.markSubCategoryAsDeleted);
router.get('/getallsubcategories',subcat.getAllSubCategories);
router.get('/getSubCategoriesByCategoryId/:categoryId', subcat.getSubCategoriesByCategoryId);


export default router;