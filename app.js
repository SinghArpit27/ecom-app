import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './modules/user/router/userRoute.js';
import ecomRoute from './modules/user/router/userEcomRoute.js';

// Create express app
const app = express();

// .env config
dotenv.config();

// connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Definition
// User Route
app.use('/', userRoute);

// Core Functionality Route
app.use('/ecom', ecomRoute);






app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT: ${process.env.PORT}`);
});