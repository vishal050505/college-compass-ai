import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";

export const predictColleges = async (req: Request, res: Response) => {
  try {
    const {
      exam,
      rank,
      minPackage,
      maxFees,
      preferredState,
      preferredType,
      minPlacementRate,
    } = req.body;

    if (!rank || !exam) {
      return res.status(400).json({
        success: false,
        message: "Rank and exam are required",
      });
    }

    const rankNum = Number(rank);

    // Determine rank range based on exam
    // JEE Advanced: top ~15000 qualify
    // JEE Main: top ~250000 qualify
    // BITSAT: score-based (treat as rank out of 10000)
    // CAT: percentile-based (treat as rank out of 200000)
    const where: any = {
      acceptedExams: { has: String(exam) },
      minRank: { lte: rankNum },
      maxRank: { gte: rankNum },
      ...(maxFees && { fees: { lte: Number(maxFees) } }),
      ...(preferredState && {
        state: { contains: String(preferredState), mode: "insensitive" },
      }),
      ...(preferredType && { type: String(preferredType) }),
      ...(minPlacementRate && {
        placementRate: { gte: Number(minPlacementRate) },
      }),
      ...(minPackage && { avgPackage: { gte: Number(minPackage) } }),
    };

    const colleges = await prisma.college.findMany({
      where,
      orderBy: [{ rank: "asc" }, { rating: "desc" }],
      take: 10,
      include: { courses: true },
    });

    // Tag each college as Safe / Moderate / Ambitious
    const tagged = colleges.map((college) => {
      const midpoint = (college.minRank + college.maxRank) / 2;
      let chance: "High" | "Moderate" | "Low";
      if (rankNum <= midpoint * 0.5) chance = "High";
      else if (rankNum <= midpoint * 0.85) chance = "Moderate";
      else chance = "Low";
      return { ...college, admissionChance: chance };
    });

    res.status(200).json({
      success: true,
      totalFound: tagged.length,
      predictedColleges: tagged,
      criteria: { exam, rank: rankNum, maxFees, preferredState, preferredType, minPlacementRate },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Prediction failed" });
  }
};