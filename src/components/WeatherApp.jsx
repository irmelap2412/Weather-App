import React from "react";
import sunny from "../assets/sunny.png";
import cloudy from "../assets/cloudy.png";
import snow from "../assets/snow.png";
import mist from "../assets/mist.png";
import storm from "../assets/storm.png";
import rainy from "../assets/rainy.png";
import drizzle from "../assets/drizzle.png";
import loadingGif from "../assets/load.gif";
import { useState, useEffect } from "react";

const WeatherApp = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const api_key = "e23c1b895c974e161796545acae63208";
  const [loading, setLoading] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [localDate, setLocalDate] = useState('');

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setLoading(true);
      const defaultLocation = "Tuzla";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      setData(defaultData);
  
      if (defaultData.timezone) {
        const timezoneOffset = defaultData.timezone;
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; 
        const localTimeInMs = utcTime + timezoneOffset * 1000;
        const time = new Date(localTimeInMs);
        setLocalTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setLocalDate(time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }));
      }
      setLoading(false);
    };
    fetchDefaultWeather();
  }, []);
  
  const handleInput = (e) => {
    setLocation(e.target.value);
  };
  
  const handleKey = (e) => {
    if (e.key === "Enter") search();
  };
  
  const search = async () => {
    if (location.trim() !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const searchData = await res.json();
  
      if (searchData.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(searchData);
        setLocation("");
      }
  
      if (searchData.timezone) {
        const timezoneOffset = searchData.timezone;
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; 
        const localTimeInMs = utcTime + timezoneOffset * 1000;
        const time = new Date(localTimeInMs);
        setLocalTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setLocalDate(time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }));
      }
      setLoading(false);
    }
  };
  
  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Drizzle: drizzle,
    Thunderstorm: storm,
    Snow: snow,
    Mist: mist,
  };

  const weatherImage = data.weather
    ? weatherImages[data.weather[0].main]
    : null;


  return (
    <div className="container">
      <div className="weather-app">
        <div className="search">
          <div className="search-top">
            <div className="search-left">
              <div className="search-element">
                <i className="fa-solid fa-location-dot"></i>
                <div className="location">{data.name}</div>
              </div>
            </div>
            <div className="seach/right">
              <div className="search-element">
                <i className="fa-solid fa-clock"></i>
                <div className="time">
                  {localTime}
                </div>
              </div>
            </div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter other location"
              value={location}
              onChange={handleInput}
              onKeyDown={handleKey}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>
        {loading ? (
          <img className="load" src={loadingGif} alt="loading" />
        ) : data.notFound ? (
          <div className="not-found">
            Oops! The place you're searching for cannot be found.😪{" "}
          </div>
        ) : (
          <>
            <div className="weather">
              <img src={weatherImage} alt="sunny" />
              <div className="weather-type">
                {data.weather ? data.weather[0].main : null}
              </div>
              <div className="temperature">
                {data.main ? `${Math.floor(data.main.temp)}°` : null}
              </div>
            </div>
            <div className="date">
              {localDate}
            </div>
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">
                  {data.main ? data.main.humidity : null}%
                </div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">
                  {data.wind ? data.wind.speed : null} km/h
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
