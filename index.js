const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const bookingRoutes = require('./routers/booking')
const connectDB = require('./config/db')

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
connectDB();

const PORT = process.env.PORT || 8000;

 
app.use('/', bookingRoutes);
app.listen(PORT,()=>{
    console.log(`Server connected on port ${PORT}`);
})

