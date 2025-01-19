const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{ 
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
    },
})


const userModel = mongoose.model('user', userSchema);

module.exports = userModel;