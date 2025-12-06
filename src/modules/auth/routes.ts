import { Router } from "express";
const router = Router();

router.get("/test", (req, res) => {
  res.json({ module: "auth", ok: true });
});

export default router;
