import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req, res) => {
  const {
    search = "",
    location,
    maxFees,
    page = "1",
    pageSize = "6",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const sizeNum = Math.max(parseInt(pageSize, 10) || 6, 1);

  const where = {
    AND: [
      search
        ? {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {},
      location
        ? {
            location: {
              contains: location, 
              mode: "insensitive" as const,
            },
          }
        : {},
      maxFees
        ? {
            fees: {
              lte: Number(maxFees),
            },
          }
        : {},
    ],
  };

  const [data, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { rating: "desc" },
      skip: (pageNum - 1) * sizeNum,
      take: sizeNum,
    }),
    prisma.college.count({ where }),
  ]);

  return res.json({
    data,
    pagination: {
      page: pageNum,
      pageSize: sizeNum,
      total,
      totalPages: Math.ceil(total / sizeNum),
    },
  });
});

router.get("/compare/list", async (req, res) => {
  const ids = ((req.query.ids as string) || "")
    .split(",")
    .map((id) => Number(id))
    .filter(Boolean);

  if (ids.length < 2 || ids.length > 5) {
    return res.status(400).json({ message: "Select 2 to 5 colleges" });
  }

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
  });
  return res.json(colleges);
});

router.get("/predict", async (req, res) => {
  const { exam = "JEE", rank } = req.query as {
    exam?: string;
    rank?: string;
  };

  if (!rank) {
    return res.status(400).json({ message: "Rank is required" });
  }

  const rankNum = Number(rank);

  if (isNaN(rankNum)) {
    return res.status(400).json({ message: "Invalid rank" });
  }

  try {
    const colleges = await prisma.college.findMany({
      where: {
        exam: {
          equals: exam,
          mode: "insensitive",
        },
        cutoffRank: {
          not: null,
          gte: rankNum,
        },
      },
      orderBy: [{ cutoffRank: "asc" }, { rating: "desc" }],
      take: 10,
    });

    return res.json(colleges);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Prediction failed" });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const college = await prisma.college.findUnique({ where: { id } });
  if (!college) return res.status(404).json({ message: "College not found" });
  return res.json(college);
});

export default router;
