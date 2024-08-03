import axios from 'axios';

export const getWeather = async (req, res) => {
  try {
    const { location } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
    
    const weatherData = {
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      wind_speed: response.data.wind.speed,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};