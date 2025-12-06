import type { Request, Response, NextFunction } from "express";


export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const e = err as any;

  // pg unique violation
  if (e?.code === "23505") {
    return res.status(409).json({ success: false, message: "Duplicate value (unique constraint)." });
  }

  // pg check violation, etc.
  if (e?.code?.startsWith?.("23")) {
    return res.status(400).json({ success: false, message: "Database constraint error." });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error" });
}
