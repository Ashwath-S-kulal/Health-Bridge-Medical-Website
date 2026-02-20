import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );

      const { password: hashedPassword, ...rest } = user._doc;

      return res.status(200).json({
        ...rest,
        token,
      });
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-8),
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.photo,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: hashedPassword2, ...rest } = newUser._doc;

    res.status(200).json({
      ...rest,
      token,
    });

  } catch (error) {
    next(error);
  }
};


export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
