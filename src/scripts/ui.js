import weatherData from "./weather_data.js";

const container = document.getElementById("container");
const toggleBtn = document.getElementById("unitToggle");

let storedData = null;
let currentUnit = "C";

function cToF(c) {
    return ((c * 9) / 5 + 32).toFixed(1);
}

function convertTemp(temp) {
    return currentUnit === "C" ? `${temp}°C` : `${cToF(temp)}°F`;
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
