const express = require('express');
const router = express.Router();
const {createRide, getFare} = require('../controller/ride.controller');
const {authUser} = require('../middlewares/auth.middlewares');


router.post('/create',authUser,createRide)

router.get('/get-fare',authUser,getFare)

// router.post('/confirm',
//     authMiddleware.authCaptain,
//     body('rideId').isMongoId().withMessage('Invalid ride id'),
//     rideController.confirmRide
// )

// router.get('/start-ride',
//     authMiddleware.authCaptain,
//     query('rideId').isMongoId().withMessage('Invalid ride id'),
//     query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
//     rideController.startRide
// )

// router.post('/end-ride',
//     authMiddleware.authCaptain,
//     body('rideId').isMongoId().withMessage('Invalid ride id'),
//     rideController.endRide
// )



module.exports = router;