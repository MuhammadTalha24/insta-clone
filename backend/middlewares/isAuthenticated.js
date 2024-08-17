import jwt from 'jsonwebtoken'


const isAuthenticated = async (req, res) => {
    try {
        const token = req.cookie.token;
        if (!token) {
            return res.status(401).json({
                message: 'User is not Authenticated',
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_KEY)
        if (!decode) {
            return res.status(401), json({
                message: 'Invalid User',
                success: false,
            })
        }

        req.id = decode.userId;
    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated