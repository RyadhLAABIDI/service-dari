import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const serviceSchema = new Schema({
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    price: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    etatDelete: {
        type: Boolean,
        default: false,
      },
    location: {
        type: String, 
        required: true
    },
    avatar: [{
        type: String,
        required: true,
    }]
}, {
    timestamps: true
});

const Service = model('Service', serviceSchema);

export default Service;