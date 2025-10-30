import { usertModel as User } from '../models/user.js'
import { userAttemptsModel } from '../models/user_attempts.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { commons, login_messages as msg } from '../static/message.js'

const MAX_LOGIN_ATTEMPTS = 5

const login = async (req, res, next) => {
    const { username, password, pattern } = req.body

    // Validate basic inputs
    if (!username || !password) {
        return res.status(400).json({
            message: commons.invalid_params
        })
    }

    try {
        // Find user and retrieve login attempts
        const user = await User.findOne({ username: username.toLowerCase() })
        const userAttempts = await userAttemptsModel.findOne({ username: username.toLowerCase() })

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                message: msg.user_not_found
            })
        }

        // Check login attempts
        if (userAttempts && userAttempts.attempts >= MAX_LOGIN_ATTEMPTS) {
            return res.status(403).json({
                message: msg.max_attempts_exceeded
            })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            // Increment login attempts
            if (userAttempts) {
                userAttempts.attempts += 1
                await userAttempts.save()
            }

            return res.status(401).json({
                message: msg.invalid_credentials
            })
        }

        // Reset login attempts on successful password verification
        if (userAttempts) {
            userAttempts.attempts = 0
            await userAttempts.save()
        }

        // Validate pattern if provided
        if (pattern) {
            const isPatternValid = pattern.every(imgId => 
                user.pattern.includes(imgId)
            ) && pattern.length === user.pattern.length

            if (!isPatternValid) {
                return res.status(401).json({
                    message: msg.invalid_pattern
                })
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email 
            },
            process.env.TOKEN_KEY,
            { expiresIn: '24h' }
        )

        // Send response
        res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email,
            token: token,
            categories: user.categories,
            sets: user.sets
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: commons.server_error
        })
    }
}

export { login as loginController }