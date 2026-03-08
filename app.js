const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
//it helps to create template
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
//for router
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
//connection to database
const mongoose = require("mongoose");
//to store session(in form of cookie)
const session = require("express-session");

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(err => 
    console.log(err)
);
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//using the functionalities
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
//so that all the data which is coming can get parsed
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//session adjustments
const sessionOptions = {
    secret:"mysupersecretcode",
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
app.use(session(sessionOptions));

//root 
app.get("/",(req,res)=>{
    res.send("Root Working");
});

//this is connected to the routes of listing.js through which functionalities work
app.use("/listings", listings);

//this is connected to the routes of review.js through which functionalities work
app.use("/listings/:id/reviews",reviews);


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