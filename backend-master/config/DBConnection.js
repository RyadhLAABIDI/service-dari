import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// Fonction asynchrone pour établir la connexion à la base de données MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); 
    }
};

export default connectDB;
