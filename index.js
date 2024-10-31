let searchForm = document.querySelector("#search-form");
let searchInput = document.querySelector("#search-input");
let searchButton = document.querySelector(".search-button");

searchForm.addEventListener("submit", searchSubmit);
searchInput.addEventListener("input", toggleButton);

function toggleButton() {
  searchButton.disabled = searchInput.value === "";
}

async function searchSubmit(event) {
  event.preventDefault();

  const cityElement = document.querySelector("#weather-app-city");
  const temp = document.querySelector(".weather-temperature");
  const icon = document.querySelector(".weather-icon");
  const condition = document.querySelector("#description");
  const humidityElement = document.querySelector("#humidity");
  const speedElement = document.querySelector("#speed");
  const timeElement = document.querySelector("#time");

  try {
    const currentWeatherData = await fetchWeatherData(searchInput.value, 'current');
    updateCurrentWeather(currentWeatherData, cityElement, temp, icon, condition, humidityElement, speedElement, timeElement);

    const forecastWeatherData = await fetchWeatherData(searchInput.value, 'forecast');
    updateForecastWeather(forecastWeatherData);
  } catch (error) {
    alert("Error fetching weather data: " + error.message);
  }
}

async function fetchWeatherData(city, type) {
  const apiKey = "6bdb310086a38f79b2oc40bdd04tdc66";
  const apiUrl = `https://api.shecodes.io/weather/v1/${type}?query=${city}&key=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("City not found or API error");
  }
  
  return response.json();
}

function updateCurrentWeather(data, cityElement, temp, icon, condition, humidityElement, speedElement, timeElement) {
  const date = new Date(data.time * 1000);
  timeElement.innerHTML = formatDay(date);

  cityElement.innerHTML = data.city;
  temp.innerHTML = Math.round(data.temperature.current);
  icon.src = data.condition.icon_url;
  condition.innerHTML = data.condition.description;
  humidityElement.innerHTML = `${data.temperature.humidity}%`;
  speedElement.innerHTML = `${data.wind.speed} km/h`;
}

function updateForecastWeather(data) {
  const forecastElement = document.querySelector("#forecast");
  const forecastDays = data.daily.slice(1, 5);
  
  const forecastHTML = forecastDays.map(day => `
      <div class="forecast-day">
        <div class="forecast-date">${formatDays(day.time)}</div>
        <div>
          <img src="${day.condition.icon_url}" class="forecast-icon" />
        </div>
        <div class="forecast-temperatures">
          <div class="forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º</strong>
          </div>
          <div class="forecast-temperature">${Math.round(day.temperature.minimum)}º</div>
        </div>
      </div>`).join('');

  forecastElement.innerHTML = forecastHTML;
}

function formatDay(date) {
  let hour = date.getHours();
  let minute = date.getMinutes();

  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const day = days[date.getDay()];

  return `${day} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function formatDays(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

document.addEventListener("DOMContentLoaded", async () => {
  searchInput.value = "Cape Town";
  await searchSubmit(new Event("submit")); 
  searchInput.value = "";
  toggleButton(); 
});
