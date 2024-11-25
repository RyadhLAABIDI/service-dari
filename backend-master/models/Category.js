import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String,
        required: false
    },
    etatDelete: {
        type: Boolean,
        default: false
    },
    SubCategory: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'  // Référence à d'autres instances de Category
    }]
}, {
    timestamps: true
});

const Category = model('Category', categorySchema);

export default Category;
