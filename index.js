function refreshWeather(response) {
  let cityElement = document.querySelector("#MeteoApp-city");
  let temperatureElement = document.querySelector("#MeteoApp-temp");
  let timeElement = document.querySelector("#MeteoApp-time");
  let descriptionElement = document.querySelector("#MeteoApp-description");
  let humidityElement = document.querySelector("#MeteoApp-humidity");
  let windElement = document.querySelector("#MeteoApp-wind");
  let iconElement = document.querySelector("#icon");

  let temperature = response.data.temperature.current;
  let date = new Date(response.data.time * 1000);

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = Math.round(temperature);
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed}km/h`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="MeteoApp-icon"/>`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "d5180efbbf1tod072214b12633a0a1f4";
  let apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiURL).then(refreshWeather);
}

function searchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "d5180efbbf1tod072214b12633a0a1f4";
  let apiURL = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(day.temperature.maximum)}°</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(
              day.temperature.minimum
            )}°</div>
          </div>
        </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", searchSubmit);

searchCity("Paris");


    
