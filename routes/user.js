const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
// const { saveRedirectUrl } = require("../middleware.js");

const ExpressError=require("../utils/ExpressError.js");
router.get("/signup",(req,res)=>{
   res.render("users/signup.ejs")
});

router.post("/signup", async (req, res, next) => {
    try {
        let {
            username, email, password, fullName, dateOfBirth, gender, phoneNumber,
            address = {}, 
            emergencyContact = {} 
        } = req.body;

       
        const newUser = new User({
            username,
            email,
            fullName,
            dateOfBirth,
            gender,
            phoneNumber,
            address: {
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                postalCode: address.postalCode || "",
                country: address.country || ""
            },
            emergencyContact: {
                name: emergencyContact.name || "",
                relationship: emergencyContact.relationship || "",
                phoneNumber: emergencyContact.phoneNumber || ""
            }
        });
        console.log(newUser); // Log the newUser object

        // Register User
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser); 

        // Log in the user automatically after successful registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Oddyssey Quest");
            res.redirect("/dashboard");  // Redirect to the dashboard
        });
    } catch (error) {
        console.error(error);
        req.flash("error", error.message || "An error occurred during registration. Please try again.");
        res.redirect("/signup");
    }
});

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs");
});
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
//     req.flash("success", "Welcome to Oddyssey Quest");
//     res.redirect("/listings");
//     res.redirect(res.locals.redirectUrl);
// });
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome to Oddyssey Quest");
    res.redirect("/dashboard");
});


router.get("/logout",async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","You logged Out");
        res.redirect("/login");
    })
})
module.exports=router;