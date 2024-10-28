const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// Homepage route
router.get("/", (req, res) => {
    res.render("homepage",
        {
            carsByPlate: []
        }
    );
});

// Search route
router.post("/search", async (req, res) => {
    console.log(req.body.plate);
    const plate = req.body.plate;
    if (plate.length < 1) {
        res.render("homepage",
            {
                carsByPlate: []
            }
        );
    };
    const data = await searchController.findByPlate(plate);
    //console.log(data);
    res.render("homepage",
        {
            carsByPlate: data
        }
    );
});

router.get("/info", (req, res) => {
    res.render("info");
});

router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;
