function changeWeather (response){
    let temperatureElement = document.querySelector('#temperature');
    let temperature = response.data.temperature.current;
    let cityElement = document.querySelector('#city');
    let descriptionElement = document.querySelector('#description');
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#windspeed");
    let timeElement = document.querySelector("#time");
    let date = new Date(response.data.time * 1000);
    let icon = document.querySelector("#main-icon");
    
    
    icon.innerHTML = `<img src="${response.data.condition.icon_url}" class="main-weather-icon"/>`;
    timeElement.innerHTML = formatDate(date);
    cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
    temperatureElement.innerHTML = Math.round(temperature);

    getForecast(response.data.city);
}

function formatDate(date){
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   
    let day = days[date.getDay()];

    if (minutes < 10){
        minutes = `0${minutes}`;
    }

   return `${day} ${hours}:${minutes}`;

}

function searchCity (city){
    let apiKey = "25003fb5bf42fe9747o6t953e32a77ae";
    let apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiURL).then(changeWeather);
}

function handleSearches(event){
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input-id");

    searchCity(searchInput.value);
}

function formatDay (timestamp){
    let date = new Date(timestamp * 1000);
     let days = [
         "Sun",
         "Mon",
         "Tue",
         "Wed",
         "Thu",
         "Fri",
         "Sat",
    ];

    return days[date.getDay()];
}


function getForecast(city){
    let apiKey = "25003fb5bf42fe9747o6t953e32a77ae";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios(apiUrl).then(showForecast);
}

function showForecast (response){
    
    let forecastHtml = "";
    
    response.data.daily.forEach(function (day, index){
        if (index < 5){
            forecastHtml =
            forecastHtml +
            `
            <div class="forecast-weather-day">
            <div class="weather-forecast-date">${formatDay(day.time)}</div>
            
            <img src="${day.condition.icon_url}" class="forecast-weather-icon"/>
            
            <div class="forecast-weather-temperatures">
            <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}°</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(
                day.temperature.minimum
            )}°
            </div> 
            </div>
            </div>
            `;
        }
    });
    
let showForecast = document.querySelector("#forecast");
showForecast.innerHTML = forecastHtml;

}

let searchForm = document.querySelector("#search-form-id");
searchForm.addEventListener("submit", handleSearches);

searchCity("Paris");
