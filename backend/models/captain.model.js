const mongoose = require('mongoose')

const captainSchema = new mongoose.Schema({
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

    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [ 3, 'Color must be at least 3 characters long' ],
        },
        plate: {
            type: String,
            required: true,
            minlength: [ 3, 'Plate must be at least 3 characters long' ],
        },
        capacity: {
            type: Number,
            required: true,
            min: [ 1, 'Capacity must be at least 1' ],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: [ 'car', 'moto', 'auto' ],
        }
    },

    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})

const captainModel = mongoose.model('captain', captainSchema)

module.exports = captainModel;