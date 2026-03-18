import { Router } from "express";
import { generateScale } from "../services/theory/generateScale.js";

const router = Router();

router.post("/worksheet", async (req, res) => {
    try {
  
      //console.log("Incoming config:", req.body);
      const scale = generateScale(req.body);
  
      if (!scale) {
        return res.status(400).json({ error: "Invalid scale configuration" });
      }
  
      res.json(scale);
    } catch (err) {
      console.error("Scale generation error:", err);
      res.status(500).json({ error: "Server error generating scale" });
    }
});

export default router;