import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '15d'
    })

    res.cookie("jwt",token,{
        maxAge: 15 *24 * 60 * 60 * 1000,
        httpOnly: true,// prevent XSS attacks cross-site scripting attacks(prevents javascript access to the cookie)
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks( Ensures the cookie is sent only to the same site)
        secure: process.env.NODE_ENV !== "development" //  Ensures the cookie is sent only to the same site


    });
};

export default generateTokenAndSetCookie;