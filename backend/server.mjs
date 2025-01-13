import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

const app = express();


app.use(cors({
   
}));
app.use(express.json());

mongoose.connect('mongodb_url', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const FavoriteSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
});
const Favorite = mongoose.model('Favorites', FavoriteSchema);

const TOMORROW_WEATHER_API_KEY = process.env.TOMORROW_WEATHER_API_KEY;


app.get('/get-weather', async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const city = req.query.city;
    const state = req.query.state;

    console.log("Data received:", lat, lon);

    if (lat && lon && lat !== 0 && lon !== 0) {
        const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&apikey={API_KEY}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover&units=imperial&timesteps=1d&timezone=America/Los_Angeles`;
        
        try {
            const response = await fetch(url);
            console.log("Weather API response status:", response.status);

            if (response.ok) {
                const weatherData = await response.json();
                return res.json({
                    city: city,
                    state: state,
                    latitude: lat,
                    longitude: lon,
                    weather: weatherData
                });
            } else {
                return res.status(500).json({ error: 'Could not retrieve weather data' });
            }
        } catch (error) {
            console.error("Error fetching weather data:", error.message);
            return res.status(500).json({ error: 'Could not retrieve weather data' });
        }
    } else {
        return res.status(400).json({ error: 'Invalid or missing coordinates' });
    }
});


app.get('/hourly-weather-data', async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    console.log("hourly weather data api called");

    if (lat && lon && lat !== 0 && lon !== 0) {
        const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,humidity,pressureSeaLevel,windSpeed,windDirection&units=imperial&timesteps=1h&startTime=now&endDay=nowPlus6d&apikey={API_KEY}`;
        
        try {
            const response = await fetch(url);

            if (response.ok) {
                const hourlyData = await response.json();
                return res.json({
                    data: hourlyData.data.timelines[0].intervals
                });
            } else {
                return res.status(500).json("Could not retrieve hourly weather data");
            }
        } catch (error) {
            return res.status(500).json("Could not retrieve hourly weather data");
        }
    } else {
        return res.status(400).json({ error: 'Invalid or missing coordinates' });
    }
});


app.get('/api/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.find();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

app.post('/api/favorites', async (req, res) => {
    try {
        const { city, state } = req.body;
        console.log("Received data:", city, state);

        if (!city || !state) {
            return res.status(400).json({ error: 'City and state are required' });
        }

        const existingFavorite = await Favorite.findOne({ city, state });
        if (existingFavorite) {
            return res.status(400).json({ error: 'Favorite already exists' });
        }

        const favorite = new Favorite({ city, state });
        await favorite.save();
        res.json(favorite);
    } catch (error) {
        console.error("Error in adding favorite:", error.message);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});


app.delete('/api/favorites', async (req, res) => {
    try {
        const { city, state } = req.query;
        if (!city || !state) {
            return res.status(400).json({ error: 'City and state are required' });
        }

        const result = await Favorite.deleteOne({ city: city, state: state });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete favorite' });
    }
});


const PORT =  process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});
