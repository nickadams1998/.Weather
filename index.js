const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var city = String(req.body.cityInput); // Changed from zip to city
  console.log(req.body.cityInput);

  const units = "imperial";
  const mySecret = process.env['Weather.api']; // Using environment variable for API key
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" + // Changed from zip to q for query by city
    city +
    "&units=" +
    units +
    "&APPID=" +
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
      const city = weatherData.name;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<h1> The weather is " + weatherDescription + "</h1>");
      res.write(
        "<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit</h2>"
      );
      res.write("<h3>The Humidity is " + humidity + "%</h3>");
      res.write("<h3>The Wind Speed is " + windSpeed + " MPH</h3>");
      res.write("<img src='" + imageURL + "'>");
      res.send();
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server is running on port " + port);
});