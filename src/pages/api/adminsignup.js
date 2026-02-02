var CryptoJS = require("crypto-js");
import connectDb from "../middleware/mongoose";
import User from "../../../models/User";

const handler = async (req, res) => {
  // Log the incoming request
  console.log(`[${new Date().toISOString()}] Admin Signup Attempt - Method: ${req.method}, IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
  
  if (req.method == "POST") {
    try {
      const { name, email, password, npassword } = req.body;
      
      // Log the signup attempt details (without password for security)
      console.log(`[${new Date().toISOString()}] Admin Signup Request - Name: ${name}, Email: ${email}`);
      
      // Validate required fields
      if (!name || !email || !password || !npassword) {
        console.log(`[${new Date().toISOString()}] Admin Signup Failed - Missing required fields for email: ${email}`);
        return res.status(400).json({ success: false, error: "All fields are required" });
      }
      
      // Validate password confirmation
      if (password !== npassword) {
        console.log(`[${new Date().toISOString()}] Admin Signup Failed - Passwords do not match for email: ${email}`);
        return res.status(400).json({ success: false, error: "Passwords do not match" });
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`[${new Date().toISOString()}] Admin Signup Failed - User already exists for email: ${email}`);
        return res.status(400).json({ success: false, error: "User already exists" });
      }
      
      // Encrypt password
      const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString();
      console.log(`[${new Date().toISOString()}] Admin Password Encrypted for email: ${email}`);
      
      // Create new admin user
      const newUser = new User({ 
        name, 
        email, 
        password: encryptedPassword, 
        role: "admin" 
      });
      
      await newUser.save();
      
      console.log(`[${new Date().toISOString()}] Admin Signup Successful - Name: ${name}, Email: ${email}, Role: ${newUser.role}`);
      
      return res.status(200).json({ 
        success: true, 
        message: "Admin user created successfully",
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Admin Signup Error - ${error.message}`, error);
      return res.status(500).json({ success: false, error: "Internal server error during signup" });
    }
  } else {
    console.log(`[${new Date().toISOString()}] Admin Signup Failed - Invalid method: ${req.method}`);
    return res.status(400).json({ error: "This method is not allowed", success: false });
  }
};

export default connectDb(handler);
