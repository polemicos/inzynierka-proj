const express = require('express');
//const request = require('request');
const bp = require("body-parser");
const mongo = require("mongoose");
const app = express();




mongo.connect("mongodb+srv://projAdmin:passpass123@inzproj.wpzxa5a.mongodb.net/?retryWrites=true&w=majority&appName=InzProj");


//car dataSchema
var carSchema = new mongo.Schema({
    link: String,
    full_name: String,
    year: Number,
    mileage_km: String,
    gearbox: String,
    fuel_type: String,
    price_pln: Number,
    photo_link: String,
    plate: String
});

var Car = mongo.model("Car", carSchema);

// Car.create({
//     link: "https://www.otomoto.pl/osobowe/oferta/nissan-qashqai-1-6-pbacentanawigacjakamerabezwypadkowy-100-ID6GvjZ3.html",
//     full_name: "test",
//     year: 2009,
//     mileage_km: "200 000km",
//     gearbox: "manual",
//     fuel_type: "diesel",
//     price_pln: 12500,
//     photo_link: "https://ireland.apollo.olxcdn.com/v1/files/eyJmbiI6InkwemVndmw2ZmhsYTItT1RPTU9UT1BMIiwidyI6W3siZm4iOiJ3ZzRnbnFwNnkxZi1PVE9NT1RPUEwiLCJzIjoiMTYiLCJwIjoiMTAsLTEwIiwiYSI6IjAifV19.Hb-oPAUe5yC77MJG12fhskv7HCYAes4FbQ9GOxStXko/image;s=1024x0;q=80",
//     plate: "LIFMC555"
// });




app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({extended: true}));


app.get("/carplates", async (req, res) => {
    try {
        const cars = await Car.find({});
        console.log(cars);
        res.render("cplist", {
            list: cars
        });
    } catch (err) {
        console.error("Something went wrong trying to receive the data from the database: ", err)
    }
});


function list(){
    res.render("cplist", {
        list: cars
    });
}

app.post("/search", (req, res)=>{
    let data = req.body;
    console.log(data);
    let author = "Mikita";
    res.render("homepage", {
        author: author
    })
});

app.get("/carplates/:id", (req, res)=>{
    res.send("Carplate number: " + req.params.id);
});

app.get("/", (req, res)=>{
    let author = "Mikita";
    
    res.render("homepage", {
        author: author
        
    });
});

app.get("*", (req, res)=>{
    res.send("error!!! No such route!!!");
});


// request("http://www.google.com", function(error, response, body){
//     if(error){
//         console.error("Error: ", error);
//     }else console.log(body);
//     console.log(response.statusCode);


// });


// request("https://api.unsplash.com/photos" , function(error, response, body){
//     if(error){
//         log.error("Error:", error);
//     }else{
//         var data = JSON.parse(body);
//         console.log(data); 
//     }
// })


const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Listening on port 3000 --> http://localhost:${PORT}/`);
});