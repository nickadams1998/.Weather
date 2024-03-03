const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//displays index.html of root path
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//invoked after hitting go in the html form
app.post("/", function(req, res) {
    
    // takes in the zip from the html form, display in console. Takes in as string, ex. for zip 02139
        var id = String(req.body.cityid);
        console.log(req.body.cityid);
    
    //build up the URL for the JSON query, API Key is // secret and needs to be obtained by signup 
        const units = "imperial";
        const apiKey = "67f6b382921c1e89b39b20d4f9556f22";
        const url = 
"https://api.openweathermap.org/data/2.5/weather?id=" + id + "&units=" + units + "&APPID=" + apiKey;

    // this gets the data from Open WeatherPI
    https.get(url, function(response){
        console.log(response.statusCode);
        
        // gets individual items from Open Weather API
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const speed = weatherData.wind.speed;
            const direction = weatherData.wind.deg;
            const cloudy = weatherData.clouds.all;
            const city = weatherData.name;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            
            // displays the output of the results
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit<h2>");
            res.write("<h3>The humidity in " + city + " is " + humidity + " % " + " and the wind speed is " + speed + "mph " + "and the wind direction is " + direction + " degrees " + "and the cloudyness is " + cloudy + "% "+ "<h3>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})


//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});