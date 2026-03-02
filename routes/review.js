const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
 

//for validation of review from the server site
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
};

//reviews (post) route
router.post("/",
    validateReview,
    wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    req.body.review.comment = req.body.review.comment.trim();

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}));
//reviews(delete) route
router.delete(
    "/:reviewId",
    wrapAsync(async(req,res)=>{
        let {id, reviewId} = req.params;
        //to remove the reviewid from the reviews array which matches with the id deleted
        await Listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    
    
}));

module.exports = router;