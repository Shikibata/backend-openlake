const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')


const verifyJWT = (req,res,next) => {
    const authHeader = req.cookies.openlake

    console.log(authHeader)

    if(!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader

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
    const authHeader = req.cookies.openlake

    console.log(authHeader)


    if(!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader

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
