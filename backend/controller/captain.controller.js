const bcrypt = require("bcrypt")
const captainModel = require('../models/captain.model');
const blackListTokenModel=require("../models/blackList.model")
const {captainRegisterSchema ,logInSchema}=require('../types/zod')
const jwt=require("jsonwebtoken")




const registerCaptain = async (req, res) => {
    const parsedData = captainRegisterSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
        const isCaptainAlready = await captainModel.findOne({ email:parsedData.data.email });

    if (isCaptainAlready) {
        return res.status(400).json({ message: 'Captian already exists' });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const a=parsedData.data
    const captain = await captainModel.create({
        name:a.name,
        email:a.email,
        password:hashedPassword,
        vehicle: {
            color:a.vehicle.color,
            plate:a.vehicle.plate,
            capacity:a.vehicle.capacity,
            vehicleType:a.vehicle.vehicleType
        }
    });

    const token=jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.cookie('token', token);
    res.status(201).json({ token, captain });
}




const loginCaptain = async (req, res) => {
    const parsedData = logInSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const { email, password } = parsedData.data;

    const captain = await captainModel.findOne({ email })

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password,captain.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token=jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.cookie('token', token);
    res.status(200).json({ token, captain });
}





const getCaptainProfile=async (req, res) => {
    res.status(200).json(req.captain);
}




const logoutCaptain = async (req, res) => {
  
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.clearCookie('token');
    

    res.status(200).json({ message: 'Logged out' });

}

module.exports = { registerCaptain , loginCaptain , getCaptainProfile , logoutCaptain};
