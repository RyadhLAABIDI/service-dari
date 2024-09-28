import SubCategory from '../models/SubCategoryModel.js';
import Category from '../models/Category.js'; 
import mongoose from 'mongoose';

const addSubCategory = async (req, res) => {
    const { name } = req.body;
    var avatar =req.file?.filename
    const { categoryId } = req.params; 

    try {
       
        const parentCategory = await Category.findById(categoryId);
        if (!parentCategory) {
            return res.status(404).json({ message: "Parent category not found" });
        }

       
        const newSubCategory = new SubCategory({
            name,
            avatar,
            parent: categoryId  
        });

       
        const savedSubCategory = await newSubCategory.save();

     
        parentCategory.SubCategory.push(savedSubCategory._id);
        await parentCategory.save();

        res.status(201).json({
            status: true,
            message: "Category has been succefully created"
          })
    } catch (error) {
        res.status(500).json({ message: 'Error creating subcategory: ' + error.message });
    }
};

const markSubCategoryAsDeleted = async (req, res) => {
    const { subcategoryId } = req.params;

    try {
        // Récupérer la sous-catégorie avant de la mettre à jour
        const subCategory = await SubCategory.findById(subcategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        console.log("SubCategory before update:", subCategory);

        // Mettre à jour la sous-catégorie
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            subcategoryId,
            { etatDelete: true },
            { new: true }
        );

        // Retourner la sous-catégorie mise à jour dans la réponse
        res.status(200).json({ message: 'SubCategory marked as deleted', subCategory: updatedSubCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error marking subcategory as deleted: ' + error.message });
    }
};


const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ etatDelete: false }) // Récupérer seulement les sous-catégories non supprimées
            .exec();

        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories: ' + error.message });
    }
};

const getSubCategoriesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const subCategories = await SubCategory.find({
            parent: categoryId,
            etatDelete: false  // Assurer que vous ne récupérez que les sous-catégories actives
        });

        if (subCategories.length === 0) {
            return res.status(404).json({ message: "No subcategories found for this category" });
        }

        console.log("Fetched subcategories for category ID:", categoryId);
        subCategories.forEach((subCategory) => {
            console.log("Subcategory Name:", subCategory.name);
            console.log("Subcategory ID:", subCategory.id);
        });

        res.status(200).json(subCategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error.message);
        res.status(500).json({ message: 'Error fetching subcategories: ' + error.message });
    }
};


export default {addSubCategory,markSubCategoryAsDeleted,getAllSubCategories,getSubCategoriesByCategoryId};