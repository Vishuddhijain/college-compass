import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const router = Router();

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.email(),
  password: z.string().min(6)
});

router.post("/register", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success || !parsed.data.name) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  });

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post("/login", async (req, res) => {
  const parsed = schema.omit({ name: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "Server misconfigured" });

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

export default router;
