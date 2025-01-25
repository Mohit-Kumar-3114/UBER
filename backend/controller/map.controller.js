const {addressSchema,distanceTimeSchema}=require("../types/zod")
const axios=require("axios")



let getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}



let getDistanceTimeHelper = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}




let getAutoCompleteSuggestionsHelper = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}





const getCoordinates = async (req, res) => {
    const { address } = req.query;
    const result = addressSchema.safeParse(address);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    const add=result.data
    try {
        const coordinates = await getAddressCoordinate(add);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}




let getDistanceTime = async (req, res) => {
    const data= req.query;
    const result = distanceTimeSchema.safeParse(data);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const {origin,destination}=result.data

    try {
        const distanceTime = await getDistanceTimeHelper(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



let getAutoCompleteSuggestions = async (req, res) => {
    const { address } = req.query;
    const result = addressSchema.safeParse(address);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    const input=result.data
    try {
        const suggestions = await getAutoCompleteSuggestionsHelper(input);
        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports={getCoordinates, getDistanceTime,getAutoCompleteSuggestions,getDistanceTimeHelper, getAddressCoordinate}