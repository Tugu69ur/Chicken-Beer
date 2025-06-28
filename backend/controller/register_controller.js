// controllers/authController.js
import asyncHandler from "../middleware/asyncHandler.js";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

const saltRounds = 10;

export const register = asyncHandler(async (req, res) => {
  const { email, name, password, phone } = req.body;

  if (!email || !name || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "Мэдээлэлээ бүрэн оруулна уу",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Уучлаарай. Бүртгэлтэй хэрэглэгч байна",
    });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "user",
  });


  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});
