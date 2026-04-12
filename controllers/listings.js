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
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);

    //the username of the user is shown who creates the listing
    newListing.owner = req.user._id;
    //this is added directly to the cloudinary then to link to the database
    newListing.image = {url,filename};
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});

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

    //  only update image if new file uploaded
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
    }

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