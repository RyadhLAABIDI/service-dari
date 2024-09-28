import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: false
    },
    parent: { // Ajoutez ce champ
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    etatDelete: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const SubCategory = model('SubCategory', subCategorySchema);
export default SubCategory;