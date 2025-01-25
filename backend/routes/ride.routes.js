const express = require('express');
const router = express.Router();
const {createRide, getFare, confirmRide,startRide, endRide} = require('../controller/ride.controller');
const {authUser, authCaptain} = require('../middlewares/auth.middlewares');


router.post('/create',authUser,createRide)

router.get('/get-fare',authUser,getFare)

router.post('/confirm',authCaptain,confirmRide)

router.get('/start-ride',authCaptain,startRide)

router.post('/end-ride',authCaptain,endRide)



module.exports = router;