import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    method: {
        type: String,
        required: true,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Other']
    },
    transactionId: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const PaymentModel = model("Payment", paymentSchema);
export default PaymentModel;
