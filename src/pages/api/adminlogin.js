var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
import connectDb from "../middleware/mongoose";
import User from "../../../models/User";

const handler = async (req, res) => {
  // Log the incoming request
  console.log(`[${new Date().toISOString()}] Admin Login Attempt - Method: ${req.method}, IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
  
  if (req.method == "POST") {
    try {
      const { email, password } = req.body;
      
      // Log the login attempt details (without password for security)
      console.log(`[${new Date().toISOString()}] Admin Login Request - Email: ${email}`);
      
      // Find admin user
      let user = await User.findOne({"email": email, "role": "admin"});
      
      if (!user) {
        console.log(`[${new Date().toISOString()}] Admin Login Failed - No admin user found for email: ${email}`);
        return res.status(200).json({ success: false, error: "No admin user found" });
      }
      
      // Log that user was found
      console.log(`[${new Date().toISOString()}] Admin User Found - Email: ${user.email}, Name: ${user.name}`);
      
      // Decrypt password
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
      const decryptpass = bytes.toString(CryptoJS.enc.Utf8);
      
      // Validate credentials
      if (email === user.email && password === decryptpass) {
        // Generate JWT token
        const token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, {
          expiresIn: '3d'
        });
        
        console.log(`[${new Date().toISOString()}] Admin Login Successful - Email: ${user.email}, Token Generated: ${token.substring(0, 20)}...`);
        
        return res.status(200).json({ 
          success: true, 
          token, 
          email: user.email,
          message: "Admin login successful"
        });
      } else {
        console.log(`[${new Date().toISOString()}] Admin Login Failed - Invalid credentials for email: ${email}`);
        return res.status(200).json({ success: false, error: "Invalid credentials" });
      }
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Admin Login Error - ${error.message}`, error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    console.log(`[${new Date().toISOString()}] Admin Login Failed - Invalid method: ${req.method}`);
    return res.status(400).json({ error: "This method is not allowed", success: false });
  }
};

export default connectDb(handler);
