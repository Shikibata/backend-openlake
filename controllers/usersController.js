const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const Profile = require('../models/Profile')

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: 'No user found'})
    }
    res.json(users)
})

//@desc Get user and profile for one user
//@route POST /profile
//@access Private
const getUser = asyncHandler(async (req,res) => {
    const { user_id, profile_id } = req.body


    const profile = await Profile.findById(profile_id ).select('-password').exec()
    const user = await User.findById(user_id ).select('-password').exec()


    if(!user){
        return res.status(400).json({message: 'No user found'})
    }
    res.json({user, profile})
})

//@desc Create user
//@route POST /users
//@access Private
const createNewUser = asyncHandler(async (req,res) => {
    const { email, password, firstName, lastName, address } = req.body
    console.log(req)
    //Confirm data
    if(!email || !password) {
        return res.status(400).json( {message: 'All fields are required.'})
    }

    //Check for duplicate 

    const duplicate = await User.findOne({ email }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    //Hash password

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { email, "password" : hashedPwd }

    

    //create and store user

    const user = await User.create(userObject)

    const getUserID = await User.findOne({email}).lean().exec()

    const user_id= getUserID._id

    const profileObject = { user_id, "first_name": firstName, "last_name":lastName, address }

    const profile = await Profile.create(profileObject)

    if(user && profile) {
        res.status(201).json({ message: `New user created` })
    } else {
        res.status(400).json({message: 'Invalid data received'})
    }



})

//@desc Update user
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req,res) => {
    const {_id,email, password, firstName, lastName, address} = req.body

    

    if(!_id, !email, !firstName, !lastName, !address) {
        return res.status(400).json({message:"All fields are required"})

    }

    const user = await User.findById(_id).exec()
    const user_id = user._id
    const profile = await Profile.findOne({ user_id }).exec()

    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    if(!profile){
        return res.status(400).json({message:"Profile not found"})
    }

    //Check duplicate
    const duplicate = await User.findOne({email}).lean().exec()
    //allow updates for original user
    if(duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({message:"Duplicate email"})
    }

    user.email = email
    profile.last_name = lastName
    profile.first_name = firstName
    profile.address = address
    
    if(password){
        //Hash
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    const updatedProfile = await profile.save()
    

    res.json({message: `${updatedProfile.first_name} updated`})
    
})

//@desc Delete user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req,res) => {
        const { id } = req.body
        if(!id){
            return res.status(400).json({message: 'User ID required'})
        }

        //const notes = await Note.findOne({user: username}).lean().exec()

    //    // if(notes?.length) {
    //         return res.status(400).json({message: 'User has assigned notes'})
    //     }

        const user = await User.findById(id).exec()
        const user_id = user._id
        const profile = await Profile.findOne({ user_id }).exec()

        if(!user){
            return res.status(400).json({message: 'User not found'})
        }

        const result = await user.remove()
        const deletedProfile = await profile.remove()

        const reply = `Username ${result.username} with ID ${result._id} deleted`

        res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}


