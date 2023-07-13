const mongoose=require("mongoose");
require("dotenv").config();
const connection=mongoose.connect(process.env.url_mongo);

module.exports={
    connection
}