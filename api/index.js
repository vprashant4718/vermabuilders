import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authrouter from './routes/auth.route.js';
import userrouter from './routes/user.route.js'
import listingrouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();



const app = express();
app.use(cors())

app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to mongo");
}).catch((error)=>{
    console.log(error);
});

const __dirname = path.resolve();

app.listen(5000, () =>{
    console.log('server is running on port 5000');
}); 

app.use('/api/auth',authrouter); 
app.use('/api/user',userrouter); 
app.use('/api/listing',listingrouter); 


app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

app.use((error, req, res, next) =>{
    const statuscode = error.statuscode || 500;
    const message = error.message || 'Internal error';
    return res.status(statuscode).json({
        success: false,
        statuscode: statuscode,
        message: message
    })
})
