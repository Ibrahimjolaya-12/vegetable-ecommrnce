import { User } from "../Models/Auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({$or:[{email}, {phone}]});
    if (user)
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      phone,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "A new user successfully registered" });
  } catch (error) {
    console.log(error.message);
    return (
      res.status(500).json({ success: false, message: "Internal server error, try again" })
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentail" });
    }
    const matchUser = await bcrypt.compare(password, user.password);
    if (!matchUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credential" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role:user.role},
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role:user.role
      },
    });
  } catch (error) {
    console.log("Login error : ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again" });
  }
};

