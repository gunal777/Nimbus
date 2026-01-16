import weatherData from "./weather_data.js";

const container = document.getElementById("container");

function displayCurrentConditions(data) {
    const div = document.createElement("div");
    div.classList.add("current-info", "card");

    const city = document.createElement("h2");
    const icon = document.createElement("img");
    const currentTemp = document.createElement("h1");
    const maxminTemp = document.createElement("h2");
    const condition = document.createElement("p");

    city.textContent = data.address;
    currentTemp.textContent = `${data.currentConditions.temp}°C`;
    maxminTemp.textContent = `Max / Min: ${data.days[0].tempmax}°C / ${data.days[0].tempmin}°C`;
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
        <div class="other-details"><h3>Feels Like</h3><p>${data.currentConditions.feelslike}°C</p></div>
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
    const mainContainer = document.getElementById("main-container");

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
        maxminTemp.textContent = `Max / Min: ${day.tempmax}°C / ${day.tempmin}°C`;

        icon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${day.icon}.png`;
        icon.classList.add("weather-icon-small");

        futuredata.append(date, icon, condition, maxminTemp);
        div.appendChild(futuredata);
    });

    mainContainer.appendChild(div);
}

export default async function display(city = "Chennai") {
    container.innerHTML = "";

    const data = await weatherData(city);
    if (!data) {
        container.innerHTML = "<p style='color:red;'>Failed to fetch weather data</p>";
        return;
    }

    const topSection = document.createElement("div");
    topSection.classList.add("top-section");

    const current = displayCurrentConditions(data);
    const other = otherdata(data);

    topSection.append(current, other);
    container.appendChild(topSection);

    futureConditions(data.days);
}
