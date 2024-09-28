import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bookingSchema = new Schema({
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
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    etatDelete: {
        type: Boolean,
        default: false,
      },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    comments: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const BookingModel = model("Booking", bookingSchema);
export default BookingModel;