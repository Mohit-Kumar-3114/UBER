const bcrypt = require("bcrypt")
const userModel = require('../models/user.model');
const blackListTokenModel=require("../models/blackList.model")
const {registerSchema , logInSchema}=require('../types/zod')
const jwt=require("jsonwebtoken")




const registerUser = async (req, res) => {
    const parsedData = registerSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
        const isUserAlready = await userModel.findOne({ email:parsedData.data.email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await userModel.create({
       name:parsedData.data.name,
        email:parsedData.data.email,
        password:hashedPassword
    });

    const token=jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.cookie('token', token);
    res.status(201).json({ token, user });
}




const loginUser = async (req, res) => {
    const parsedData = logInSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const { email, password } = parsedData.data;
   
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token=jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.cookie('token', token);
    res.status(200).json({ token, user });
}





const getUserProfile=async (req, res) => {
    res.status(200).json(req.user);
}




const logoutUser = async (req, res) => {
  
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.clearCookie('token');
    

    res.status(200).json({ message: 'Logged out' });

}

module.exports = { registerUser , loginUser , getUserProfile , logoutUser};
