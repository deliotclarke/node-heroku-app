const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const errorMessage = document.getElementById('error-message');
const fullError = document.getElementById('full-error');
const locationPara = document.getElementById('location');
const forecast = document.getElementById('forecast');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userInput = search.value;
  forecast.textContent = 'Loading...';
  fetch(`http://localhost:3000/weather?address=${userInput}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        forecast.textContent = '';
        errorMessage.textContent = data.message;
        fullError.textContent = data.error;
      } else {
        locationPara.textContent = data.location;
        forecast.textContent = data.forecast;
      }
    });
});
