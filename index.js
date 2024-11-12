function refreshWeather(response) {
    let temperatureElement = document.querySelector("#temperature");
    let temperature = response.data.temperature.current;
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#wind-speed");
    let timeElement = document.querySelector("#time");
    let date = new Date(response.data.time * 1000);
    let iconElement = document.querySelector("#icon");

    cityElement.innerHTML = response.data.city;
    timeElement.innerHTML = formatDate(date);
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
    temperatureElement.innerHTML = Math.round(temperature);
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

    getForecast(response.data.city);
}

function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
    let apiKey = "6cef3c6b12ac03oa7c3c47900da5te44";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query={query}&key={key}`;
    axios.get(apiUrl).then(refreshWeather).catch(error => alert("City not found. Please try again."));
}

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    searchCity(searchInput.value);
}

function formatDay(timeStamp) {
    let date = new Date(timeStamp * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

function getForecast(city) {
    let apiKey = "6cef3c6b12ac03oa7c3c47900da5te44";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query={query}&key={key}`;
    axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
    let forecastHtml = "";

    response.data.daily.forEach(function (day, index) {
        if (index < 5) {
            forecastHtml += `
                <div class="weather-forecast-day">
                    <div class="weather-forecast-date">${formatDay(day.time)}</div>
                    <div><img class="weather-forecast-icon" src="${day.condition.icon_url}" /></div>
                    <div class="weather-forecast-temperatures">
                        <div class="weather-forecast-temperature"><strong>${Math.round(day.temperature.maximum)}°</strong></div>
                        <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}°</div>
                    </div>
                </div>`;
        }
    });

    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris"); 
