const express = require('express');
const zod = require("zod");
const {User} = require("../db");
const jwt = require("jsonwebtoken")
const router = express.Router();
// introduce signup signin routes etc etc T_T
const signupSchema = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
})
router.post("/signup",async(req,res)=>{ 
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message:"Incorrect Inputs"
        })
    }

    const user = User.findOne({
        username:body.username
    })

    if(user._id) {
        return res.json({
            message:"Email is already taken"
        })
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId:dbUser._id
    },JWT_SECRET);

    res.json({
        message:"User created succesfully",
        token:token
    })
})
/////////////////////////////////////////////////////////////////////////////////////

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

module.exports = router;