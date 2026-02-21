import mongoose from "mongoose";

const DiseaseDietRuleSchema = new mongoose.Schema({
  disease: { type: String, required: true },

  allowed_foods: [String],
  restricted_foods: [String],

  max_calories: Number,
  max_sodium: Number,
  max_sugar: Number,
  max_carbs: Number,
  max_gi: Number
});

export default mongoose.model("DiseaseDietRule", DiseaseDietRuleSchema);