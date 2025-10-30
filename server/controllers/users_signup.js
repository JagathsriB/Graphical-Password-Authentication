import * as dotenv from 'dotenv'
import { usertModel as User } from '../models/user.js'
import bcrypt from "bcryptjs"
import { commons, signup_messages as msg } from '../static/message.js'
import jwt from 'jsonwebtoken'
import { userAttemptsModel } from '../models/user_attempts.js'

const signup = async (req, res, next) => {
    let token
    let existingUser
    let hashedPassword
    
    var { 
        username, 
        email, 
        password, 
        pattern, 
        categories, 
        sets 
    } = req.body

    username = username.toLowerCase()

    const validateInputs = () => {
        if (!username || !email || !password) {
            return {
                valid: false,
                message: commons.invalid_params
            }
        }

        if (!pattern || pattern.length < 5 || pattern.length > 25) {
            return {
                valid: false,
                message: "Pattern must contain 5-25 images"
            }
        }

        if (!sets || sets.length !== 5) {
            return {
                valid: false,
                message: "Sets must contain exactly 5 categories"
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return {
                valid: false,
                message: "Invalid email format"
            }
        }

        if (password.length < 8) {
            return {
                valid: false,
                message: "Password must be at least 8 characters long"
            }
        }

        return { valid: true }
    }

    const validationResult = validateInputs()
    if (!validationResult.valid) {
        return res.status(400).json({
            message: validationResult.message,
            format: msg.format
        })
    }

    try {
        existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        })
    } catch(err) {
        return res.status(500).json({
            message: msg.db_user_failed
        })
    }

    if (existingUser) {
        return res.status(409).json({
            message: existingUser.email === email 
                ? msg.user_already_exist 
                : "Username is already taken"
        })
    }

    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch(err) {
        return res.status(500).json({
            message: msg.pass_hash_err
        })
    }

    const createdUser = new User({
        username, 
        email, 
        password: hashedPassword, 
        sets, 
        pattern, 
        categories,
        sequence: false
    })

    const attempts = new userAttemptsModel({
        username, 
        email, 
        attempts: 0
    })

    try {
        await createdUser.save()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: msg.db_save_err
        })
    }

    try {
        await attempts.save()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: msg.db_save_err
        })
    }

    try {
        token = jwt.sign(
            {
                userId: createdUser.id, 
                email: createdUser.email
            }, 
            process.env.TOKEN_KEY, 
            { expiresIn: '24h' }
        )
    } catch (err) {
        return res.status(500).json({
            message: commons.token_failed
        })
    }

    res.status(201).json({
        username: createdUser.username, 
        userId: createdUser.id, 
        email: createdUser.email, 
        token: token,
        categories: createdUser.categories,
        sets: createdUser.sets
    })
}

export { signup as signupController }