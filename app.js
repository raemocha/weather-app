const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

// server your css as static
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

  const query = req.body.cityName;

  const apiKey = "711535dc5f366025534318792003f93e";
  const units = "imperial";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    response.on("data", function (data) {

        let weatherData = JSON.parse(data);

       if (weatherData.cod==="404") {
            res.sendFile(__dirname + "/error.html");
       } else{
        let city = weatherData.name;
        let temp = weatherData.main.temp;
        let hum = weatherData.main.humidity;
        let temp_min = weatherData.main.temp_min;
        let temp_max = weatherData.main.temp_max;
        let sr = weatherData.sys.sunrise;
        let ss = weatherData.sys.sunset;
        let ws = weatherData.wind.speed;
        let desc = weatherData.weather[0].description;
        let icon = weatherData.weather[0].icon;
        let imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  
        res.render("results", {
          city: city,
          temp: temp,
          hum: hum,
          temp_min: temp_min,
          temp_max: temp_max,
          sr: sr,
          ss: ss,
          ws: ws,
          desc: desc,
          icon: icon,
          imageURL: imageURL,
        });
       }

    });
  });
});



app.get("/results", function (req, res) {
  res.render("results");
});

app.post("/error",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT ||3000, function () {
  console.log("Server is running on port 3000.");
});
