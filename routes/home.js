const express=require("express");
const router=express.Router();

router.get("/",async(req,res,next)=>{

    return res.status(200).json({
        title:"express testing",
        message:"the app is working properly"
    })
})

module.exports=router;