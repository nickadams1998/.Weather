const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const latitude = req.body.latitudeInput;
  const longitude = req.body.longitudeInput;
  console.log(latitude, longitude);

  const units = "imperial";
  const mySecret = process.env['Weather.api']; // API key from environment variable
  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=" +
    units +
    "&appid=" +
    mySecret;

  https.get(url, function(response) {
    console.log(response.statusCode);

    let data = "";
    response.on("data", function(chunk) {
      data += chunk;
    });

    response.on("end", function() {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name; // The API will return the closest city to the lat/lon
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const humidity = weatherData.main.humidity; // Extract humidity
      const windSpeed = weatherData.wind.speed; // Extract wind speed
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<h1> The weather is " + weatherDescription + "</h1>");
      res.write("<h2>The Temperature near " + city + " is " + temp + " Degrees Fahrenheit</h2>"); // Note the text change to "near"
      res.write("<h3>Humidity: " + humidity + "%</h3>"); // Display humidity
      res.write("<h3>Wind Speed: " + windSpeed + " miles/hour</h3>"); // Display wind speed
      res.write("<img src='" + imageURL + "'>");
      res.send();
    });
  });
});
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server is running on port " + port);
});
