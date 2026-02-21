import express from 'express';
import mealModel from '../models/meal.model.js';
import DiseaseDietRule from '../models/DiseaseDiet.model.js'


const router = express.Router();

router.post("/filter-meals", async (req, res) => {
  try {
    const { diseases } = req.body;

    if (!diseases || diseases.length === 0) {
      return res.json({ meals: [], activeRules: [] });
    }

    // 1. Fetch rules for selected diseases
    const rules = await DiseaseDietRule.find({ disease: { $in: diseases } });

    if (rules.length === 0) {
      const allMeals = await mealModel.find().limit(20);
      return res.json({ meals: allMeals, activeRules: [] });
    }

    // Helper to safely handle data whether it's an Array or a pipe-separated String
    const normalize = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.flatMap(item => typeof item === 'string' ? item.split('|') : item);
      if (typeof val === 'string') return val.split('|');
      return [];
    };

    // Determine strict profile
    const strictProfile = rules.reduce((acc, rule) => ({
      max_sugar: Math.min(acc.max_sugar, rule.max_sugar ?? Infinity),
      max_sodium: Math.min(acc.max_sodium, rule.max_sodium ?? Infinity),
      max_calories: Math.min(acc.max_calories, rule.max_calories ?? Infinity),
      max_carbs: Math.min(acc.max_carbs, rule.max_carbs ?? Infinity),
      max_gi: Math.min(acc.max_gi, rule.max_gi ?? Infinity),
      restricted_foods: [...acc.restricted_foods, ...normalize(rule.restricted_foods)]
    }), {
      max_sugar: Infinity, max_sodium: Infinity, max_calories: Infinity, 
      max_carbs: Infinity, max_gi: Infinity, restricted_foods: []
    });

    const finalRestricted = [...new Set(strictProfile.restricted_foods)];

    // 2. Fetch meals
    const meals = await mealModel.find({
      sugar: { $lte: strictProfile.max_sugar === Infinity ? 999 : strictProfile.max_sugar },
      sodium: { $lte: strictProfile.max_sodium === Infinity ? 9999 : strictProfile.max_sodium }
    });

    // 3. Filtering & Scoring
    const filteredAndScoredMeals = meals.filter(meal => {
      const mealIngs = normalize(meal.ingredients);
      const hasRestricted = finalRestricted.some(r => 
        mealIngs.some(ing => String(ing).toLowerCase().includes(String(r).toLowerCase()))
      );

      if (hasRestricted) return false;
      if (meal.calories > strictProfile.max_calories) return false;
      if (meal.gi > strictProfile.max_gi) return false;

      return true;
    }).map(meal => {
      let score = 100;
      if (strictProfile.max_gi !== Infinity && meal.gi) score -= (meal.gi / strictProfile.max_gi) * 30;
      if (strictProfile.max_sodium !== Infinity && meal.sodium) score -= (meal.sodium / strictProfile.max_sodium) * 30;
      
      return { ...meal.toObject(), matchScore: Math.round(Math.max(score, 50)) };
    });

    // 4. Return both the meals and the original rules
    res.json({ 
      meals: filteredAndScoredMeals.sort((a, b) => b.matchScore - a.matchScore),
      activeRules: rules // This contains allowed_foods and restricted_foods
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/search-diseases", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    // Find diseases starting with or containing the query string
    // 'i' makes it case-insensitive
    const suggestions = await DiseaseDietRule.find({
      disease: { $regex: q, $options: "i" }
    })
    .select("disease") // Only return the name to keep it fast
    .limit(10);        // Don't overwhelm the UI

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
