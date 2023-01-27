const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')


const verifyJWT = (req,res,next) => {
    const authHeader = req.headers.cookie


    if(!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.slice(0, 4)

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
    const authHeader = req.headers.cookie

    console.log(req.headers.cookie)


    if(!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.slice(0, 4)

    console.log(token)

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
