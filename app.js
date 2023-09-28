import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './modules/user/router/userRoute.js';
import ecomRoute from './modules/user/router/userEcomRoute.js';
import adminRoute from './modules/admin/router/adminRoute.js';
import morgan from 'morgan';

// Create express app
const app = express();

// .env config
dotenv.config();

// connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// LOG 
// Configure Morgan to write logs to the accessLogStream
// Import FS and PATH module which are built-in module in node.js
// FS => allows you to work with the file system
// PATH => is used for working with file and directory paths.
import fs from 'fs';
import path from 'path';

// this line imports the `fileURLToPath` function from the url module. It will be used to convert a file URL to a file path
import { fileURLToPath } from 'url';
// Get the directory path of the current module
// These lines use `import.meta.url` to get the URL of the current module, which typically represents the file where this code resides
// `fileURLToPath` is then used to convert the file URL to a file path, which is stored in `__filename`
const __filename = fileURLToPath(import.meta.url);

// `path.dirname` is used to extract the directory part of the file path, which is stored in `__dirname`. This gives you the directory path of the current module.
const __dirname = path.dirname(__filename);

// This line uses `path.join` to construct the path to the log file. It joins `__dirname` (the directory path of the current module) with './Logs/logs.log' to create an absolute path to the log file
const logFilePath = path.join(__dirname, './Logs/logs.log');

// This line creates a writable stream using fs.createWriteStream. It takes two arguments:
// `logFilePath`: The path to the log file where the data will be written.
// `{ flags: 'a' }`: An options object that specifies that the stream should be opened in "append" mode ('a'). This means that data will be added to the end of the file if it already exists, or a new file will be created if it doesn't.
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// 1). Assuming that app is an instance of an Express.js application, this line uses the morgan middleware to log HTTP requests and responses.
// 2). 'combined' is a predefined log format in morgan that logs various details about each request and response.
// 3). { stream: accessLogStream } specifies that the log data should be written to the accessLogStream created earlier, which in turn writes to the log file
app.use(morgan('combined', { stream: accessLogStream }));



// Route Definition
// User Route
app.use('/', userRoute);

// Core Functionality Route
app.use('/ecom', ecomRoute);

// Admin Route
app.use('/admin', adminRoute);




app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT: ${process.env.PORT}`);
});