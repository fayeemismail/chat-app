import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import chatRoute from './routes/chatRoute.js'
import initializeSocket from './sockets/socketHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())



const server = http.createServer(app);


// Initialize socket.io
const io = initializeSocket(server);


// Connect MongoDB
// console.log(process.env.MONGO) 
mongoose.connect(process.env.MONGO)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));




//SETTING ROUTE FOR USER
app.use("/api/auth", authRoute);
app.use('/api/chat', chatRoute);

// Start the server
server.listen(process.env.PORT, () => {
    console.log('Server started on port 3001');
});
