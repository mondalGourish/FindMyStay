const Listing = require("../models/listing");
//extracted the part from ../routes/listing.js to make the code readable
//index
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
//(new)create
module.exports.renderNewForm = (req,res)=>{
   res.render("listings/new.ejs");
};
//create
module.exports.createListing = async(req,res,next)=>{
    
    const newListing = new Listing(req.body.listing);
    
    //the username of the user is shown who creates the listing
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
   
};
//edit
module.exports.editListing = async (req,res)=>{
   let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});

};
//update 
module.exports.updateListing = async(req,res)=>{
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
    req.flash("success","Listing Updated!");

    res.redirect(`/listings/${id}`);

};
//delete
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
//show
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};