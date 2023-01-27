const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')


const verifyJWT = (req,res,next) => {
    const authHeader = req.headers.authorization 

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: `${err}` })
            req.user = decoded.UserInfo.email
            req.roles = decoded.UserInfo.role
            next()
        }
    )
}

const verifyJWTAdmin = (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    const decoding = jwt_decode(token)
    console.log(decoding)

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: `${err}` })
            req.user = decoded.UserInfo.email
            req.roles = decoded.UserInfo.role
            if (req.roles != "admin") return res.status(403).json({ message: 'Admin access only.' })
            next()
        }
    )
}

module.exports = { verifyJWT, verifyJWTAdmin }
