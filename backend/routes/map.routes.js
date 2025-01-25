const express = require('express');
const router = express.Router();
const {authUser}=require("../middlewares/auth.middlewares")
const {getCoordinates,getDistanceTime,getAutoCompleteSuggestions} = require('../controller/map.controller');


router.get('/get-coordinates',authUser,getCoordinates);
router.get('/get-distance-time',authUser,getDistanceTime)
router.get('/get-suggestions',authUser,getAutoCompleteSuggestions)


module.exports = router;