// const jwt = require("jsonwebtoken");
// const auth = (req, res, next) => {
//     if (!req.headers['authorization']) {
//         return res.status(400).json({ status: 0, msg: "Unautorized" })
//     }

//     const token = req.headers['authorization'].split(' ')[1]

//     jwt.verify(token, process.env.KEY, (err, user) => {
//         if (err) {
//             const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
//             return res.status(400).json({ status: 0, message: message })
//         }
//         req.payload = user
//         next()
//     })
// }

// module.exports = auth

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const db = require("../models");
const Users = mongoose.model('User')




const userAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).send({ error: "you must be logged in" })
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.KEY, async (err, payload) => {
         if (err) {
            return res.status(401).send({ error: "you must be logged in " })
        }
        const { userId } = payload;
         const user = await db.User.findById(userId)
        req.user = user;
        next();
    })
} 
  const therapistAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).send({ error: "you must be logged in" })
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.KEY, async (err, payload) => {
         if (err) {
            return res.status(401).send({ error: "you must be logged in " })
        }
        const { therapistId } = payload;
         const therapist = await db.Therapist.findById(therapistId)
        req.therapist = therapist;
        next();
    })
} 
const bussinessAuth= (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).send({ error: "you must be logged in" })
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.KEY, async (err, payload) => {
         if (err) {
            return res.status(401).send({ error: "you must be logged in " })
        }
        const { businessId } = payload;
         const business = await db.Business.findById(businessId)
        req.business = business;
        next();
    })
} 

module.exports = {therapistAuth,userAuth ,bussinessAuth}