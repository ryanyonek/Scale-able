import { Router } from "express";
import { transposeTonic } from "../services/theory/transposeEngine.js";
import { generateScale } from "../services/theory/generateScale.js";

const router = Router();

router.post("/", (req, res) => {
  try {
    const config = req.body;

    //console.log(`Config Requested: ${config}`);

    const key = config.transpositionKey;

    console.log(`Transposition key: ${key}`);

    const newTonic = transposeTonic(config.tonic, key);

    const newConfig = {
      ...config,
      tonic: newTonic
    };

    const scale = generateScale(newConfig);

    res.json({...scale,
      tonic: newTonic
  });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;