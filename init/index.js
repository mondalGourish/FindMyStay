const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async ()=>{
    await Listing.deleteMany({});
    //the object id is added later with the data which was already there in the db
    initData.data = initData.data.map((obj)=>({...obj,owner:'69b6a6e93046e545a98ac313'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");

}
initDB();