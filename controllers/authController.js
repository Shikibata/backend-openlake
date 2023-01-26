const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { json } = require('express')
const jwt_decode = require("jwt-decode")
const Profile = require('../models/Profile')


//@desc Login
//@route POST /auth
//@access Public

const login = asyncHandler(async (req,res) => {
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const foundUser = await User.findOne({email}).exec()
    const user_id = foundUser._id
    const foundProfile = await Profile.findOne({ user_id }).exec()

    if(!foundUser) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({message: 'Unauthorized'})

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "profile_id": foundProfile._id,
                "id": foundUser._id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
    )

    const refreshToken = jwt.sign(
        { "id": foundUser.username, "profile_id": foundProfile._id},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    //create a secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None', 
        maxAge: 7*24*60*60*1000 //matches refresh 
    })

    data = jwt_decode(accessToken)

    res.json({ data })
})

//@desc Refresh
//@route POST /auth/refresh
//@access Public - access token expired

const refresh = (req,res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden'})

            const foundUser = await User.findOne({username: decoded.username}).exec()
            const user_id = foundUser._id
            const foundProfile = await Profile.findOne({ user_id }).exec()

            if(!foundUser) {
                return res.status(401).json({message: 'Unauthorized'})
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "profile_id": foundProfile._id,
                        "id": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1m" }
            )

            res.json({ accessToken })
        })
    )
}

//@desc Logout
//@route POST /auth/logout
//@access Public - clear cookies if any

const logout = (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({message: 'Cookie cleared'})
}

module.exports = {
    login,
    refresh,
    logout
}

