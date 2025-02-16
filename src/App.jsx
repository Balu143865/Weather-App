import "./App.css";
import React, { useState,useEffect } from "react";
import Navbar from "../src/components/navbar";
import MainWeather from "../src/components/mainweather";
import FiveDayForecast from "../src/components/fiveday";
import TodayHighlights from "../src/components/TodayHighlights";

import axios from "axios";

const WeatherDashboard = () => {
//function APP() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('London'); // Default city is set to London
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = '794e2bc9024c53c384bdc703fbff5ecd'; // Replace with your OpenWeatherMap API key
    axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then(response => {
        setAirQualityData(response.data.list[0]); // Set the first item in the list as air quality data
      })
      .catch(error => console.error('Error fetching the air quality data:', error));
  };

  const fetchWeatherData = (city) => {
    const API_KEY = '794e2bc9024c53c384bdc703fbff5ecd'; // Replace with your OpenWeatherMap API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        console.log(JSON.stringify(data));
        fetchAirQualityData(data.coord.lat, data.coord.lon); 
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
         .then(response => {
           setFiveDayForecast(response.data);
         })
         .catch(error => console.error('Error fetching the 5-day forecast data:', error));
    
      })
       .catch(error => console.error('Error fetching the weather data:', error));
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity); 
  };


  return (
    <div>
      <Navbar onSearch={handleSearch} />
      {weatherData && airQualityData &&  (
        <div style={{ display: "flex", padding: "30px", gap: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <MainWeather weatherData={weatherData} />
            <p style={{ fontWeight: "700", fontSize: "20px", marginTop: "20px" }}>5 Days Forecast</p>
            {fiveDayForecast && <FiveDayForecast forecastData={fiveDayForecast} />}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: "0.5", gap: "20px" }}>
            <TodayHighlights weatherData={weatherData} airQualityData={airQualityData}  />  
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;