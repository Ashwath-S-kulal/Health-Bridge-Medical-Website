import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  sodium: Number,
  sugar: Number,
  carbs: Number,
  gi: Number,
  ingredients: [String]
});

export default mongoose.model("Meal", MealSchema);