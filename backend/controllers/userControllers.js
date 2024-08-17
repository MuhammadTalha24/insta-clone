import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js"
import mongoose from "mongoose"

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All Fields Are Required",
                success: false,
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "Email Already in Use",
                success: false,
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        await User.create({
            username, email, password: hashedPassword
        });
        return res.status(201).json({
            message: 'Account Created Successfully',
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}


//login Controller

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(401).json({
                message: "All Fields Are Required",
                success: false,
            })
        }
        const userFind = await User.findOne({ email })
        if (!userFind) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            })
        }

        const checkPassword = bcrypt.compareSync(password, userFind.password)
        if (!checkPassword) {
            return res.status(401).json({
                message: "Password do not match",
                success: false,
            })
        }

        const user = {
            _id: userFind._id,
            email: userFind.email,
            username: userFind.username,
            profilepic: userFind.profilepic,
            bio: userFind.bio,
            following: userFind.following,
            followers: userFind.followers,
            post: userFind.posts,

        }

        const token = await jwt.sign({ userId: userFind._id }, process.env.JWT_KEY, { expiresIn: '1d' })
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome Back ${userFind.username}`,
            success: true,
            user,
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie('token', '', { maxAge: 0 }).json({
            message: 'Logout Successfully',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
        return res.status(201).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilepic = req.file;
        let cloudResponse;
        if (profilepic) {
            const fileUri = getDataUri(profilepic)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                success: false
            })
        }
        if (bio) {
            user.bio = bio;
        }
        if (gender) {
            user.gender = gender;
        }
        if (profilepic) {
            user.profilepic = cloudResponse.secure_url;
        }

        await user.save();
        return res.status(201).json({
            message: "Profile Updated",
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUser = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUser) {
            return res.status(401).json({
                message: 'Currently do not have any user',
                success: false
            })
        }

        return res.status(201).json({
            users: suggestedUser,
            success: true,
        })

    } catch (error) {
        console.log(error)
    }
}


export const followOrunfollow = async (req, res) => {
    try {
        const followkarnewala = req.id;
        const jiskofollowkarna = req.params.id;

        if (followkarnewala === jiskofollowkarna) {
            return res.status(401).json({
                message: "You Cannot Follow or Unfollow Yourself",
                success: false,
            })
        }


        const user = await User.findById(followkarnewala);
        const targetUser = await User.findById(jiskofollowkarna);
        if (!user || !targetUser) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            })
        }

        const isFollowing = await user.following.includes(jiskofollowkarna)

        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followkarnewala }, { $pull: { following: jiskofollowkarna } }),
                User.updateOne({ _id: jiskofollowkarna }, { $pull: { followers: followkarnewala } })
            ])
            return res.status(201).json({ message: 'Unfollowed Successfully', success: true })
        } else {
            User.updateOne({ _id: followkarnewala }, { $push: { following: jiskofollowkarna } })
            User.updateOne({ _id: jiskofollowkarna }, { $push: { followers: followkarnewala } })
            return res.status(201).json({ message: 'Followed Successfully', success: true })
        }
    } catch (error) {
        console.log(error)
    }
}


