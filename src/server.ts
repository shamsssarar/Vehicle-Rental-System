import express from "express";
import { env } from "./config/env";
import { pool,initDB } from "./db";
import authRoutes from "./modules/auth/routes";
import userRoutes from "./modules/users/routes";
import vehicleRoutes from "./modules/vehicles/routes";
import bookingRoutes from "./modules/bookings/routes";



const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/db-test", async (req, res) => {
  const r = await pool.query("SELECT NOW() as now");
  res.json({ dbTime: r.rows[0].now });
});


app.listen(env.PORT, async() => {
  await initDB();
  console.log(`Server running on http://localhost:${env.PORT}`);
});
