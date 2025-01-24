const dotenv = require('dotenv');
dotenv.config();
const express = require("express")
const app=express()
const cors=require("cors")
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const mongoose=require("mongoose")
mongoose.connect(process.env.DATABASE_URL
).then(() => {
    console.log('Connected to DB');
}).catch(err => console.log(err));



const userRoutes = require('./routes/user.routes');
const captainRoutes=require("./routes/captain.routes")
const mapsRoutes = require('./routes/map.routes');
app.use('/users', userRoutes);
app.use("/captains",captainRoutes)
app.use('/maps', mapsRoutes);

module.exports=app