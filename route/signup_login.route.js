const express = require("express");

const {usermodel}=require("../models/users.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config()
const routeUser = express.Router();


// for register part
routeUser.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
  
    const check = await usermodel.find({ email });
    if (check.length > 0) {
      return res.status(200).json({ "ok": false, "msg": "User already exists" });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ "ok": false, "msg": "Passwords do not match" });
    }
  
    bcrypt.hash(password, 5, async (err, hash) => {
      try {
        if (err) {
          res.send(err.message);
        } else {
          const data = new usermodel({ name, email, password: hash });
          await data.save();
          res.status(200).json({ "ok": true, "msg": "Registered Successfully" });
        }
      } catch (error) {
        res.status(400).json({ "ok": false, "msg": error.message });
      }
    });
  });
  


//for login part

routeUser.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email:email });
    if (!user) {
      return res.status(401).json({ msg: "User with this email not found", ok: false })
    }
    const isPasswordSame = await bcrypt.compare(password, user.password)
    if (!isPasswordSame) {
      return res.status(401).json({ msg: "Invalid email or password", ok: false })
    }

    //{ userId: user._id } == this is going to encoded into jwt
    const token = jwt.sign({ userId: user._id }, process.env.key_secret, { expiresIn: '1hr' })

    const response = {
      "ok": true,
      "token": token,
      "msg": "Successfull login",
      "id": user._id,
    }
  
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ "ok": false, "msg": error.message });
  }
})



//for blcaklisting part
let blacklist = [];

routeUser.post('/blacklist', (req, res) => {
  const { email } = req.body;

  if (blacklist.includes(email)) {
    return res.status(400).json({ ok: false, msg: 'User already blacklisted' });
  }

  blacklist.push(email);

  res.status(200).json({ ok: true, msg: 'User blacklisted successfully' });
});



module.exports = {
    routeUser
}
