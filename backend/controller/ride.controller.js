const {createRideSchema, getFareSchema}=require("../types/zod")
const {getDistanceTimeHelper,getAddressCoordinate}=require("./map.controller")
const rideModel=require("../models/ride.model")
const captainModel=require("../models/captain.model")
const {sendMessageToSocketId }=require("../socket")



const getCaptainsInTheRadius = async (userLtd, userLng, radius,vehicleType) => {
   
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
        return distance <= radius && captain.vehicle.vehicleType === vehicleType;
    });

    return captainsInRadius;
};




const confirmRideHelper = async ({rideId, captainId}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({_id: rideId}, {
        status: 'accepted',
        captain: captainId
    })

    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}




const startRideHelper = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({ _id: rideId}, {status: 'ongoing' })

    return ride;
}




const endRideHelper = async ({ rideId}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({ _id: rideId}).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({ _id: rideId }, {status: 'completed'})

    return ride;
}





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
        const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 10,a.vehicleType);

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




const confirmRide = async (req, res) => {
    const { rideId,captainId } = req.body;

    try {
        const ride = await confirmRideHelper({ rideId, captainId });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}




const startRide = async (req, res) => {

    const { rideId, otp } = req.query;

    try {
        const ride = await startRideHelper({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




const endRide = async (req, res) => {


    const { rideId} = req.body;
    console.log({rideId})

    try {
        const ride = await endRideHelper({ rideId});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })
        return res.status(200).json(ride);
    } catch (err) {
        console.log(err)
        return res.status(400).json( "hi there " );
    } 
}


module.exports ={createRide,getFare, confirmRide,startRide,endRide}