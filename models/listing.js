const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        filename: {
        type: String,
        default: "listingimage"
        },
        url:{
            type:String,
        //it shows the url in the terminal
        default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        //process to set a default value if img is not present
        set:(v) => v === ""? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
        }
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
            coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;