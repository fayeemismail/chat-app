import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1',
    })
    
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_SECRET, {
        expiresIn: '7d',
    })    
    
    return {accessToken, refreshToken}
};

export default generateToken;