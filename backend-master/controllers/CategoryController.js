import Category from '../models/Category.js';


const addParentCategory = async (req, res) => {
    const { name } = req.body;  
    var avatar =req.file?.filename

    
    const newCategory = new Category({
        name,
        parent: null,// 'null' signifie que c'est une catégorie parente
        avatar  
    });

    try {
         await newCategory.save();
        res.status(201).json({
            status: true,
            message: "Category has been succefully created"
          })
    } catch (error) {
        res.status(500).json({ message: 'Error creating category: ' + error.message });
    }
};


const getAllParentCategoriesWithSubcategories = async (req, res) => {
    try {
        
        const parentCategories = await Category.find({ parent: null, etatDelete: false })
            .populate({
                path: 'SubCategory', 
                select: 'name , avatar',
                match: { etatDelete: false } // Filtrer les sous-catégories non supprimées
            })
            .exec();

        res.status(200).json(parentCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parent categories: ' + error.message });
    }
};


const markCategoryAsDeleted = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { etatDelete: true },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: 'Category marked as deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking category as deleted: ' + error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ etatDelete: false }) // Récupérer seulement les catégories non supprimées
            .exec();

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories: ' + error.message });
    }
};

export default {addParentCategory,getAllParentCategoriesWithSubcategories,markCategoryAsDeleted,getAllCategories};