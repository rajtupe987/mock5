const express=require("express");
require("dotenv").config();
const cors=require("cors");
const {connection}=require("./config/db");
const {routeUser}=require("./route/signup_login.route");
const {employeeRouter}=require("./route/dashboard.route");
const {authMiddleWare}=require("./middleware/athentication")
const app=express();
app.use(express.json());
app.use(cors());



app.get("/",(req,res)=>{
    res.send("WELCOME TO EMPLOYEE MANAGEMENT")
})


app.use("/",routeUser);
//app.use(authMiddleWare)
app.use("/Dashboard",employeeRouter);


app.listen(process.env.port_no,async()=>{

    try {
         await connection;
         console.log("connected to DB")
    } catch (error) {
        console.log("Error while connecting database")
    }
    console.log(`port is running at ${process.env.port_no}`)
})