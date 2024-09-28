import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    etatDelete: {
        type: Boolean,
        default: false,
      },
    comment: {
        type: String,
        required: false,
        trim: true
    },
    createdAt: {        type: Date,
        default: Date.now

    }
}, {
    timestamps: true
});

const ReviewModel = model("Review", reviewSchema);
export default ReviewModel;