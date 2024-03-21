const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://real-time-weather-app-steel.vercel.app/",
    credentials: true,
  },
});

const API_KEY = process.env.API_KEY
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    res.send("Hi apicn am c");
  } catch (error) {
    console.log(error);
  }
});

let intervalId;

io.on('connection', (socket) => {
  socket.on('location', ({ latitude, longitude }) => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`);
        const weatherData = {
          name: response.data.location.name,
          region: response.data.location.region,
          feelLike: response.data.current.feelslike_c,
          pressure: response.data.current.pressure_mb,
          weather: response.data.current.condition.text,
          icon: response.data.current.condition.icon,
          direction: response.data.current.wind_dir,
          temperature: response.data.current.temp_c,
          humidity: response.data.current.humidity,
          windSpeed: response.data.current.wind_kph,
        };

        socket.emit('weatherData', weatherData);

      } catch (error) {
        console.error('Error fetching real-time weather data:', error);
      }
    };

    fetchData(); // Initial fetch

    intervalId = setInterval(fetchData, 30000); // Update weather data every 30 seconds

    socket.on('disconnect', () => {
      clearInterval(intervalId);
      console.log('Socket disconnected');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
