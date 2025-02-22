import React, { useState } from "react";
import axios from "axios";
 // Weather condition icon
import "../styles/weather.css";

const Weather = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);

    const fetchWeather = async () => {
        if (!city) return;
        const API_KEY = "7af133b932019e37ab2ded3b1d9198a9";
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        try {
            const response = await axios.get(URL);
            setWeather(response.data);
        } catch (error) {
            alert("City not found!");
        }
    };

    return (
        <div className="weather-container">
            <div className="weather-card">
                <h2 className="tittleweather">🌤 Weather</h2>
                <input
                className="inputz"
                    type="text"
                    placeholder="Enter City Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button className="buttonz" onClick={fetchWeather}>Get Weather</button>

                {weather && (
                    <div className="weather-info">
                        <h3>{weather.name}, {weather.sys.country}</h3>

                        <div className="weather-detail">
                            <img src="https://t4.ftcdn.net/jpg/09/65/93/53/360_F_965935315_1eOUHruSK2ecp574xMvkmZDhnhUsL0Ga.jpg " alt="Temperature" />
                            <span className="weather-text">
                                🌡 Temperature: {weather.main.temp}°C
                            </span>
                        </div>

                        <div className="weather-detail">
                            <img src="https://t4.ftcdn.net/jpg/07/89/76/83/360_F_789768363_9i7eGUZDefUTJjhJ26f80pyG4o144zCG.jpg " alt="Wind Speed" />
                            <span className="weather-text">
                                💨 Wind Speed: {weather.wind.speed} m/s
                            </span>
                        </div>

                        <div className="weather-detail">
                            <img src="https://cdn-icons-png.freepik.com/256/8356/8356649.png?semt=ais_hybrid" alt="Weather Condition" />
                            <span className="weather-text">
                                🌥 Condition: {weather.weather[0].description}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
