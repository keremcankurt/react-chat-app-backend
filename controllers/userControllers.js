const generateToken = require("../config/generateToken")
const { comparePassword } = require("../helpers/inputHelpers")
const User = require("../models/userModel")


const registerUser = async(req, res, next) => {
    try {
        const {name, email, password} = JSON.parse(req.body.user)
        if(!name || !email || !password) {
            res.status(400)
            throw new Error('Please Enter all the Fields')
        }
    
        const userExists = await User.findOne({ email })
        if(userExists) {
            res.status(400)
            throw new Error('User already Exists')
        }
        
        const user = await User.create({
            name,
            email,
            password,
            pic: req.savedImage
        })
        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }
        else {
            throw new Error('Failed to create user')
        }
    } catch (error) {
        res.status(400)
        res.json({
            message: error.message
        })
    }

}

const authUser = async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if(user && (comparePassword(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }else {
            throw new Error('Invalid Email or Password')
        }
    } catch (error) {
        
        res.status(401)
        res.json({
            message: error.message
        })
    }
    
}

const allUsers = async(req, res) => {
    const search = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    }
    : {}

    const users = await User.find(search).find({_id: {$ne: req.user._id}})
    res.send(users)
} 

module.exports = {
    registerUser,
    authUser,
    allUsers
}