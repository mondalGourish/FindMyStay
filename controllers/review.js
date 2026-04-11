const Listing = require("../models/listing");
const Review = require("../models/review");

//create
module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    req.body.review.comment = req.body.review.comment.trim();

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");

    res.redirect(`/listings/${listing._id}`);

};
//delete
module.exports.deleteReview = async(req,res)=>{
        let {id, reviewId} = req.params;
        //to remove the reviewid from the reviews array which matches with the id deleted
        await Listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted");

        res.redirect(`/listings/${id}`);
    
    
};