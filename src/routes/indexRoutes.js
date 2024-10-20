const express = require("express");
const router = express.Router();

// Homepage route
router.get("/", (req, res) => {
    res.render("homepage");
});

// Search route
router.post("/search", (req, res) => {
    const data = req.body;
    console.log(data);
    res.render("homepage");
});

// Catch-all route for unknown paths
// router.get("*", (req, res) => {
//     res.redirect("/");
// });

module.exports = router;
