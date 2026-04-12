const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//for index and create(post route) implementing router.route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single("listing[image]"), 
         validateListing,
        wrapAsync(listingController.createListing)
    );
   

//new(create) route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//for the get/show update and delete route
router
    .route("/:id")
    .put(isLoggedIn, 
        isOwner,
        upload.single("listing[image]"),  
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))
    .get(wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));



module.exports = router;