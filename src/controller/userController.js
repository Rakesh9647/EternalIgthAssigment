const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose =require("mongoose")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = RequestBody => Object.keys(RequestBody).length > 0

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
 }

const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { name, email, password } = data;

        if (!isValidRequestBody(data)) {
            return res.status(400).send({status: false, msg: "Invalid request parameters ,please provide the user details",});
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: "please fill the name" })
        }
        if (!isValid(email)) {
           return res.status(400).send({ status: false, msg: "please fill the email" })
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
           return res.status(400).send({ status: false, msg: "Invalid Email" })
            
        }
        let isEmailAlreadyUsed = await userModel.findOne({ email })
        if (isEmailAlreadyUsed) {
          return res.status(400).send({ status: false, msg: "Email is Already Exists" })
    
        }
        if (!isValid(password)) {
         return res.status(400).send({ status: false, msg: "please fill the password" })
        }
        if (password.trim().length > 15) {
           return res.status(400).send({ status: false, msg: "Password should be less than 15 characters" })
        }
        if (password.trim().length < 8) {
           return res.status(400).send({ status: false, msg: "Password should be more than 8 characters" })
            
        }
        let saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        console.log(salt)
        let hash = await bcrypt.hash(req.body.password, salt)
        console.log(hash)

        let createData = { name, email, password: hash }
        let createdUser = await userModel.create(createData);
        return res.status(201).send({ data: createdUser })

    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

module.exports.createUser = createUser;


const login = async function (req, res) {
    try {
        let { email, password } = req.body;

        if (!isValidRequestBody(req.body))
            return res.status(400).send({ status: false, msg: "invalid paramaters please provide email-password", });

        if (!isValid(email))
            return res.status(400).send({ status: false, msg: "email is required" });
        const findUser = await userModel.findOne({ email });

        if (!findUser) {
            return res.status(401).send({ status: false, message: `Login failed! email is incorrect.` });
        }

        if (!isValid(password))
          return res.status(400).send({ status: false, msg: "password is required" });

        let encryptedPassword = findUser.password;

        const findUserr = await bcrypt.compare(password, encryptedPassword);

        if (!findUserr) {
           return res.status(401).send({ status: false, message: `Login failed! password is incorrect.` });
        }

        let userId = findUser._id;

        let token = await jwt.sign(
            {
                userId: userId.toString(),
            },
            "secret-key"
        );
        res.setHeader("x-api-key",token)
        let userDetails =await userModel.find({email}).select({name:true,email:true,_id:false})
        if(!userDetails) return res.status(400).send({status:false, msg: "userDetails is not present"})
        return res.status(200).send({ status: true, msg: "loggedin successfully", data: { userId, token } ,userDetails:{userDetails}});
    } catch (err) {
        return res.status(500).json({ status: false, msg: err.message });
    }
};
module.exports.login = login


// const getUserProfile =async function(req,res){
//     try{
//         let userId =req.params.userId
//         if(!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "userID is incorrect ", });
//         let data =await userModel.find({_id:userId})
//         if(!data)  return res.status(400).send({ status: false, msg: "user is not found ", });
//         return res.status(200).send({status:true , data:data})

//     }catch(error){
//         return res.status(500).json({ status: false, msg: err.message });

//     }
// }

// module.exports.getUserProfile =getUserProfile;

const updateUser =async function(req,res){
    try{

        const userId =req.params.userId;
        console.log(userId)
        let data = req.body;
        let {name,password} =data
    
        if(!isValid(userId)) return res.status(400).send({status:false , msg:"provide userId "})

        if(!isValidObjectId(userId)) return res.status(400).send({status:false , msg:"invalid userId"})

        if(!isValidRequestBody(data)) return res.status(400).send({status:false , msg:"please fill the box"})

        if(!isValid(name)) {
            return res.status(400).send({status:false , msg:"please fill name "})
        }
        
        if(!isValid(password)){
            return res.status(400).send({status:false , msg:"please fill password "})
        }

        if (password.trim().length > 15) {
            return res.status(400).send({ status: false, msg: "Password should be less than 15 characters" })
        
        }
        if (password.trim().length < 8) {
            return res.status(400).send({ status: false, msg: "Password should be more than 8 characters" })
          
        }
        let saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        console.log(salt)
        let hash = await bcrypt.hash(req.body.password, salt)
        console.log(hash)
        let finalFillter ={name,password:hash}

        if(req.user!=userId){
            return res.status(400).send({status:false , msg:"user is not authorized"})
        }
        const update =await userModel.findByIdAndUpdate({_id:userId} ,{$set:finalFillter}, {new:true})
        console.log(update)
        return res.status(200).send({ status: true, msg: update })

    }catch(error){
        return res.status(500).json({ status: false, msg: err.message });
    }
}

module.exports.updateUser=updateUser;


const logout =async function (req,res){
    try{
        if(req.token ==undefined){
            res.status(200).send("logout");
        }
      
    }catch(error){
        res.status(500).send({status:false, msg:error.message})

    }
}
module.exports.logout=logout;


