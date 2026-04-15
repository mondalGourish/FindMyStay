
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
//it helps to create template
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
//for router
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//connection to database
const mongoose = require("mongoose");
//to store session(in form of cookie)
const session = require("express-session");
const MongoStore = require('connect-mongo');

//to flash messages after successful completeion of task
const flash = require("connect-flash");
//for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLAS_DB_URL;
main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(err => 
    console.log(err)
);
async function main() {
  await mongoose.connect(dbUrl);
}

//using the functionalities
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
//so that all the data which is coming can get parsed
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//mongo session store
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

//session adjustments
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    //expiry date for the cookie i.e set to the date after 1 week
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        //for security purposes
        httpOnly : true,
    },
}



//root route
// app.get("/",(req,res)=>{
//     res.send("Root Working");
// });


app.use(session(sessionOptions));
//used flash before the routes so that it could implement functionalities
app.use(flash());

//the session should be implemented earlier as when the user login and travels to different pages we should not ask the user to login for each traversal

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
//through passport and local strategy we use .authenticate function to authenticate the user
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize(store) and deserialize(unstore) of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// app.get("/demoUser", async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

//this is connected to the routes of listing.js through which functionalities work
app.use("/listings", listingRouter);

//this is connected to the routes of review.js through which functionalities work
app.use("/listings/:id/reviews",reviewRouter);
//this is connected to user.js
app.use("/",userRouter);


//other the above routes, if request is sent to any other route this it is forwarded to this
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

// error handler
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);

});

//local host
app.listen(8080, ()=>{
    console.log("Listening to port 8080");
});


// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Successful test");
// });