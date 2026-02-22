import axios from "axios";
import express from "express";

import { addPatient, getPatient, updateCuredStatus } from "../controller/patient.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();


router.post("/add",verifyToken,addPatient );

router.get("/get",verifyToken,getPatient );

router.post("/update/:id",verifyToken,updateCuredStatus)


router.get("/nearby", async (req, res) => {
  try {
    const { location } = req.query;

    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { format: "json", q: location },
      headers: { "User-Agent": "patient-app" }
    });

    if (!geoRes.data.length) return res.json({ hospitals: [], pharmacies: [] });

    const { lat, lon } = geoRes.data[0];

    const overpassQuery = `
      [out:json];
      (
        node["amenity"="hospital"](around:25000,${lat},${lon});
        node["amenity"="pharmacy"](around:25000,${lat},${lon});
      );
      out body;
    `;

    const overpassRes = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      { headers: { "Content-Type": "text/plain", "User-Agent": "patient-app" } }
    );

    const elements = overpassRes.data.elements.filter(el => el.tags?.name);

    // Split and limit to 10 each
    const hospitals = elements.filter(el => el.tags.amenity === "hospital").slice(0, 10);
    const pharmacies = elements.filter(el => el.tags.amenity === "pharmacy").slice(0, 10);

    res.json({ hospitals, pharmacies });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

router.get('/nih-proxy', async (req, res) => {
    try {
        const { term } = req.query;
        const nihUrl = `https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=${encodeURIComponent(term)}`;
        
        const response = await axios.get(nihUrl, {
            responseType: 'text' // Vital: tells axios not to try and parse it as JSON
        });
console.log(response)
        res.set('Content-Type', 'text/xml');
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching from NIH');
    }
});





export default router;
