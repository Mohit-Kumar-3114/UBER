const {createRideSchema, getFareSchema}=require("../types/zod")
const {getDistanceTimeHelper,getAddressCoordinate}=require("./map.controller")
const rideModel=require("../models/ride.model")
const captainModel=require("../models/captain.model")
const {sendMessageToSocketId }=require("../socket")



const getCaptainsInTheRadius = async (userLtd, userLng, radius) => {
   
    const captains = await captainModel.find({});
  
    const EARTH_RADIUS = 6371; 
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                  Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c; 
    };

   
    const captainsInRadius = captains.filter(captain => {
        const { ltd, lng } = captain.location;
        const distance = calculateDistance(userLtd, userLng, ltd, lng); 
        return distance <= radius; 
    });

    return captainsInRadius;
};





async function getFare(req,res) {
    const {pickup, destination}=req.query
    const result=getFareSchema.safeParse({pickup, destination})
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }
    const distanceTime = await getDistanceTimeHelper(result.data.pickup, result.data.destination);
    
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };
    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };
    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };
     const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };
    res.status(201).json(fare);
}






const createRide = async (req, res) => {
    const {fare,pickup,destination,vehicleType}=req.body
    const result = createRideSchema.safeParse({ pickup, destination, vehicleType,fare });
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }
    
    let a=result.data
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const ride = await rideModel.create({ user: req.user._id, pickup:a.pickup, destination:a.destination, vehicleType:a.vehicleType,otp, fare:a.fare });
        res.status(201).json(ride);

        const pickupCoordinates = await getAddressCoordinate(a.pickup);
        const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 10);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        console.log(rideWithUser)
        console.log(captainsInRadius)
        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })

     }
     catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};


module.exports ={createRide,getFare}