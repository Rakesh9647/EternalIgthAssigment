const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')
const middleware =require('../middleware/auth.js')

router.post("/register",userController.createUser)
router.post("/login",userController.login)
router.put("/updateDetails/:userId",middleware.auth,userController.updateUser);
router.post("/logout",middleware.auth,userController.logout);


//router.get("/user/:userId",middleware.auth,userController.getUserProfile)
// router.get("/users",userController.users)


module.exports=router;