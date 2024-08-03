import axios from 'axios';

const getWeather = async (location) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    return {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
    };
  } catch (error) {
    throw new Error('Unable to fetch weather data');
  }
};

export default { getWeather };