import { Router } from "express";
const router = Router();

router.get("/test", (req, res) => {
  res.json({ module: "users", ok: true });
});

export default router;
