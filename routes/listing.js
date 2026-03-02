const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


//for validation of listing from the server site
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
};

//index route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));

//new(create) route
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
});

router.post("/", 
    validateListing,
    wrapAsync(async(req,res,next)=>{
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
   
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req,res)=>{
   let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id", 
    validateListing,
    wrapAsync(async(req,res)=>{
    let { id } = req.params;
    let updatedData = req.body.listing;

    let listing = await Listing.findById(id);

    listing.title = updatedData.title;
    listing.description = updatedData.description;
    listing.price = updatedData.price;
    listing.location = updatedData.location;
    listing.country = updatedData.country;

    // FIX: handle both string and object cases
    listing.image = {
        url: updatedData.image,
        filename: listing.image?.filename || "default"
    };

    await listing.save();

    res.redirect(`/listings/${id}`);

}));

//delete route
router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//show(read) route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

module.exports = router;