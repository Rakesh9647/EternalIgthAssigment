const userModel = require("../models/userModel");
const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const userController = require('../controller/userController')


const auth = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "secret-key");
        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "token is invalid" });
        req.user = decodedToken.userId
        req.token = decodedToken.token;

        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports.auth = auth;
