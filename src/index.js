import "./style.css";
import display from "./scripts/ui";

const cityInput = document.getElementById('city-info');
const weatherForm = document.querySelector('form');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        display(city);
    }
});

display("Chennai");