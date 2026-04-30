import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const items = await prisma.savedCollege.findMany({
    where: { userId: req.userId! },
    include: { college: true },
    orderBy: { createdAt: "desc" }
  });
  return res.json(items.map((item: (typeof items)[number]) => item.college));
});

router.post("/:collegeId", async (req: AuthRequest, res) => {
  const collegeId = Number(req.params.collegeId);
  await prisma.savedCollege.upsert({
    where: {
      userId_collegeId: {
        userId: req.userId!,
        collegeId
      }
    },
    update: {},
    create: { userId: req.userId!, collegeId }
  });
  return res.status(201).json({ message: "Saved" });
});

router.delete("/:collegeId", async (req: AuthRequest, res) => {
  const collegeId = Number(req.params.collegeId);
  await prisma.savedCollege.deleteMany({
    where: { userId: req.userId!, collegeId }
  });
  return res.json({ message: "Removed" });
});

export default router;
