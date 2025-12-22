import User from "../models/user.model.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAdmin = !user.isAdmin;
    await user.save();

    res.status(200).json({
      message: `User is now ${user.isAdmin ? "Admin" : "User"}`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update role" });
  }
};
