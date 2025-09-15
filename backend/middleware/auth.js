import jwt from 'jsonwebtoken'

export const authenticateToken = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log(token);

    jwt.verify(token, "mynameisaaryarastogiiamamernstackdeveloper", async(err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.status(403).json({ message: 'Forbidden' });
        }
        // console.log("user", user.user);
        req.user = user;
        req.token = token;
        next();
    });
};