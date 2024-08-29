const express = require('express');
const router = express.Router();

// Route to render the dashboard
router.get("/", (req, res, next) => {
    console.log("Dashboard route hit");
    if (req.isAuthenticated()) {
        console.log("User authenticated:", req.user); // Log user details
        const username = req.user.username;
        res.render("dashboard/dashboard", { username });
    } else {
        req.flash("error", "You need to log in first.");
        res.redirect("/login");
    }
});

module.exports = router;