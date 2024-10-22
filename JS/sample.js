const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");
const API_KEY = "d0fee6b9931f9938841a065c7224269f"; // Paste your API here
// Create weather card HTML based on weather data
const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="mt-3 d-flex justify-content-between">
                    <div>
                        <h3 class="fw-bold">${cityName} (${
      weatherItem.dt_txt.split(" ")[0]
    })</h3>
                        <h6 class="my-3 mt-3">Temperature: ${(function celcToFahr(
                          n
                        ) {
                          return (n * 9.0) / 5.0 + 32.0;
                        })(weatherItem.main.temp - 273.15).toFixed(2)}°F</h6>
                        <h6 class="my-3">Wind: ${
                          weatherItem.wind.speed
                        } M/S</h6>
                        <h6 class="my-3">Humidity: ${
                          weatherItem.main.humidity
                        }%</h6>
                    </div>
                    <div class="text-center me-lg-5">
                        <img src="https://openweathermap.org/img/wn/${
                          weatherItem.weather[0].icon
                        }@4x.png" alt="weather icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>
                </div>`;

    console.log(celsiusToFahrenheit(25)); // Output: 77
  } else {
    return `<div class="col mb-3">
                    <div class="card border-0 bg-secondary text-white">
                        <div class="card-body p-3 text-white">
                            <h5 class="card-title fw-semibold">(${
                              weatherItem.dt_txt.split(" ")[0]
                            })</h5>
                            <img src="https://openweathermap.org/img/wn/${
                              weatherItem.weather[0].icon
                            }.png" alt="weather icon">
                            <h6 class="card-text my-3 mt-3">Temp: ${(
                              weatherItem.main.temp - 273.15
                            ).toFixed(2)}°C</h6>
                            <h6 class="card-text my-3">Wind: ${
                              weatherItem.wind.speed
                            } M/S</h6>
                            <h6 class="card-text my-3">Humidity: ${
                              weatherItem.main.humidity
                            }%</h6>
                        </div>
                    </div>
                </div>`;
  }
};
// Get weather details of passed latitude and longitude
const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      const forecastArray = data.list;
      const uniqueForecastDays = new Set();
      const fiveDaysForecast = forecastArray.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (
          !uniqueForecastDays.has(forecastDate) &&
          uniqueForecastDays.size < 6
        ) {
          uniqueForecastDays.add(forecastDate);
          return true;
        }
        return false;
      });
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      daysForecastDiv.innerHTML = "";
      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          daysForecastDiv.insertAdjacentHTML("beforeend", html);
        }
      });
    })
    .catch(() => {
      alert("An error occurred while fetching the weather forecast!");
    });
};
// Get coordinates of entered city name
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!");
    });
};
searchButton.addEventListener("click", () => getCityCoordinates());
const savedSearchHistory = (city) => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    cityHistory = [];
  }
  cityHistory.push(city);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
};

// Fetch search history and render buttons
const saveSearchHistory = (city) => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    cityHistory = [];
  }
  cityHistory.push(city);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
};
const renderSearchHistory = () => {
  let cityHistory = JSON.parse(localStorage.getItem("cities"));
  if (!cityHistory) {
    return;
  }
  console.log(cityHistory);
  for (city of cityHistory) {
    const button = document.createElement("button");
    button.textContent = city;
    button.value = city;
    button.classList.add("historyButton");
    console.log(city);
    search_element.appendChild(button);
  }
  search_element.addEventListener("click", function (e) {
    console.log(e.target.value);
    const city = e.target.value;
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { name, lat, lon } = data[0]; //defind them and passing them down
        console.log(lat, lon);
        getWeather(name, lat, lon); //passing down to the function
      })
      .catch((error) => {
        weather.innerHTML = `<p>Error: ${error}</p>`;
      });
  });
};

// Function to fetch weather data
function fetchWeatherData(cityName) {
  fetch("/api/weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city: cityName }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update UI with weather data
      displayWeather(data);
    });
}
