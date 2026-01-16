import weatherData from "./weather_data.js";
import sunnyImg from "../assets/sunny.png";
import clearNightImg from "../assets/default.png";
import partlyCloudyDayImg from "../assets/partly-cloudy.png";
import partlyCloudyNightImg from "../assets/default.png";
import cloudyImg from "../assets/cloudy.png";
import rainImg from "../assets/rain.png";
import thunderImg from "../assets/thunder.png";
import snowImg from "../assets/snow.png";
import fogImg from "../assets/fog.png";
import defaultImg from "../assets/default.png";

const container = document.getElementById("container");
const toggleBtn = document.getElementById("unitToggle");

let storedData = null;
let currentUnit = "C";

const backgrounds = {
    "clear-day": sunnyImg,
    "clear-night": clearNightImg,
    "partly-cloudy-day": partlyCloudyDayImg,
    "partly-cloudy-night": partlyCloudyNightImg,
    "cloudy": cloudyImg,
    "rain": rainImg,
    "thunderstorm": thunderImg,
    "snow": snowImg,
    "fog": fogImg,
    "default": defaultImg
};

function cToF(c) {
    return ((c * 9) / 5 + 32).toFixed(1);
}

function convertTemp(temp) {
    return currentUnit === "C" ? `${temp}°C` : `${cToF(temp)}°F`;
}

function setBackground(iconKey) {
    const url = backgrounds[iconKey] || "../assets/clear/default.png";
    document.body.style.background = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${url}') no-repeat center/cover`;
}

function displayCurrentConditions(data) {
    const div = document.createElement("div");
    div.classList.add("current-info", "card");

    const city = document.createElement("h2");
    const icon = document.createElement("img");
    const currentTemp = document.createElement("h1");
    const maxminTemp = document.createElement("h2");
    const condition = document.createElement("p");

    city.textContent = data.address;
    currentTemp.textContent = convertTemp(data.currentConditions.temp);
    maxminTemp.textContent = `Max / Min: ${convertTemp(data.days[0].tempmax)} / ${convertTemp(data.days[0].tempmin)}`;
    condition.textContent = data.currentConditions.conditions;

    icon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${data.currentConditions.icon}.png`;
    icon.alt = data.currentConditions.conditions;
    icon.classList.add("weather-icon");

    div.append(city, icon, currentTemp, maxminTemp, condition);
    return div;
}

function otherdata(data) {
    const otherDiv = document.createElement("div");
    otherDiv.classList.add("other-details-container", "card");

    otherDiv.innerHTML = `
        <div class="other-details"><h3>UV</h3><p>${data.currentConditions.uvindex}</p></div>
        <div class="other-details"><h3>Feels Like</h3><p>${convertTemp(data.currentConditions.feelslike)}</p></div>
        <div class="other-details"><h3>Humidity</h3><p>${data.currentConditions.humidity}%</p></div>
        <div class="other-details"><h3>Wind</h3><p>${data.currentConditions.windspeed} km/h</p></div>
        <div class="other-details"><h3>Pressure</h3><p>${data.currentConditions.pressure} hPa</p></div>
        <div class="other-details"><h3>Visibility</h3><p>${data.currentConditions.visibility} km</p></div>
        <div class="other-details"><h3>Sunrise</h3><p>${data.currentConditions.sunrise}</p></div>
        <div class="other-details"><h3>Sunset</h3><p>${data.currentConditions.sunset}</p></div>
    `;

    return otherDiv;
}

function futureConditions(days) {
    const div = document.createElement("div");
    div.classList.add("future-container", "card");

    days.forEach(day => {
        const futuredata = document.createElement("div");
        futuredata.classList.add("future-day");

        const date = document.createElement("p");
        const icon = document.createElement("img");
        const condition = document.createElement("p");
        const maxminTemp = document.createElement("p");

        date.textContent = day.datetime;
        condition.textContent = day.conditions;
        maxminTemp.textContent = `Max / Min: ${convertTemp(day.tempmax)} / ${convertTemp(day.tempmin)}`;

        icon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${day.icon}.png`;
        icon.classList.add("weather-icon-small");

        futuredata.append(date, icon, condition, maxminTemp);
        div.appendChild(futuredata);
    });

    container.appendChild(div);
}

function renderWeather() {
    container.innerHTML = "";

    const topSection = document.createElement("div");
    topSection.classList.add("top-section");

    topSection.append(
        displayCurrentConditions(storedData),
        otherdata(storedData)
    );

    container.appendChild(topSection);
    futureConditions(storedData.days);

    setBackground(storedData.currentConditions.icon);
}

export default async function display(city = "Chennai") {
    storedData = await weatherData(city);

    if (!storedData) {
        container.innerHTML = "<p style='color:red;'>Failed to fetch weather data</p>";
        return;
    }

    renderWeather();
}

toggleBtn.addEventListener("click", () => {
    currentUnit = currentUnit === "C" ? "F" : "C";
    toggleBtn.textContent = currentUnit === "C" ? "°F" : "°C";
    renderWeather();
});
