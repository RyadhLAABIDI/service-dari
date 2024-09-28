import dotenv from "dotenv";
import express  from "express";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import AuditRoutes from './routes/AuditRoutes.js'; 
import authRoute from "./routes/AuthRoutes.js";
import HandlerError from './middleware/HandlerError.js';
import connectDB from './config/DBConnection.js'
import userRoute from "./routes/UserRoute.js";
import catRoute from "./routes/CategoryRoute.js";
import subcatRoute from "./routes/SubCategoryRoute.js";
import serviceRoute from "./routes/ServiceRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import BookingRoute from "./routes/BookingRoute.js";






dotenv.config();
const app =express()
const port=process.env.PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors());
connectDB();

// Servir des fichiers statiques
app.use('/images/users', express.static(path.join(__dirname, 'public/images/users')));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));




// app.use(HandlerError.notFound);
// app.use(HandlerError.unauthorized);
// app.use(HandlerError.forbidden);
// app.use(HandlerError.badRequest);
// app.use(HandlerError.internalServerError);
// app.use(HandlerError.notAcceptable);

const limiter = rateLimit({
    windowMs: 60 * 1000 + 15 * 1000, 
    max: 1000, 
    message: 'Too many requests from this IP, please try again later.',
    skipFailedRequests: true, 
    skipSuccessfulRequests: false 
  });
  app.use(limiter);

  app.get("/", (req, res) => {
    res.send("hello world !");
  });

  app.use(AuditRoutes);
  app.use("/", authRoute);
  app.use("/user", userRoute);
  app.use("/category", catRoute);
  app.use("/subcategory", subcatRoute);
  app.use("/service", serviceRoute);
  app.use("/booking", BookingRoute);
  app.use("/review", ReviewRoute);
 

  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
  