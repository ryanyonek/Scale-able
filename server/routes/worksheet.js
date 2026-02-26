import { Router } from "express";

const router = Router();

router.post("/worksheet", async (req, res) => {
  const { scales } = req.body;

  res.json({
    message: `Worksheet generated for ${scales.length} scales`
  });
});

export default router;