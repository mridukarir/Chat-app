import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import User from '../models/user.model.js';
export const signup = async (req,res) =>{
  try{
    const{fullName,username,password,confirmPassword,gender} = req.body;
   
    if(password !== confirmPassword){
        return res.status(400).json({error:"Passwords don't match"})
    }
    const user = await User.findOne({username});

    if(user){
        return res.status(400).json({error:"Username already exists"})
    }
    
    // Hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/

    const boyProfilePic =`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${username}`
    const girlProfilePic =`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${username}`

    const newUser = new User({
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender ==="male" ? boyProfilePic : girlProfilePic
    })
  if(newUser){
    //generate jwt token
    generateTokenAndSetCookie(newUser._id, res);

    await newUser.save();

    res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic
    });
}else{
    res.status(400).json({error: "Invalid user data"});
}


}catch(error){
      console.log("Error in signup contoller", error.message);
      res.status(500).json({error:"Internal Server Error"});
  }
};

export const login = async(req,res) =>{
    try {
     const {username, password} =req.body;

     const user = await User.findOne({username});

     const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

     if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"Invalid Credentials"});
}    
      generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic
    });
     
        
    } catch (error) {
        console.log("Error in login contoller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
       
};
export const logout = async(req,res) =>{
           try {
            res.cookie("jwt","",{maxAge:0});
            res.status(200).json({
              message: "Logged out successfully"
            });
            
           } catch (error) {
            console.log("Error in logout contoller", error.message);
        res.status(500).json({error:"Internal Server Error"});
           }
};

