import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";

export const getAllColleges = async (req: Request, res: Response) => {
  try {
    const {
      search,
      location,
      state,
      type,
      minFees,
      maxFees,
      minRating,
      minPackage,
      exam,
      page = "1",
      limit = "12",
      sortBy = "rank",
      sortOrder = "asc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, parseInt(limit as string));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      ...(search && {
        name: { contains: String(search), mode: "insensitive" },
      }),
      ...(location && {
        location: { contains: String(location), mode: "insensitive" },
      }),
      ...(state && {
        state: { contains: String(state), mode: "insensitive" },
      }),
      ...(type && { type: String(type) }),
      ...(minFees || maxFees
        ? {
            fees: {
              ...(minFees && { gte: Number(minFees) }),
              ...(maxFees && { lte: Number(maxFees) }),
            },
          }
        : {}),
      ...(minRating && { rating: { gte: Number(minRating) } }),
      ...(minPackage && { avgPackage: { gte: Number(minPackage) } }),
      ...(exam && {
        acceptedExams: { has: String(exam) },
      }),
    };

    const orderBy: any = { [sortBy as string]: sortOrder };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: { courses: true, reviews: true },
      }),
      prisma.college.count({ where }),
    ]);

    res.status(200).json({
      colleges,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const college = await prisma.college.findUnique({
      where: { id: parseInt(id) },
      include: { courses: true, reviews: true },
    });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch college" });
  }
};

export const getCollegeFilters = async (req: Request, res: Response) => {
  try {
    const [types, states, exams] = await Promise.all([
      prisma.college.findMany({ select: { type: true }, distinct: ["type"] }),
      prisma.college.findMany({ select: { state: true }, distinct: ["state"] }),
      prisma.college.findMany({ select: { acceptedExams: true } }),
    ]);

    const allExams = [...new Set(exams.flatMap((c) => c.acceptedExams))].sort();

    res.status(200).json({
      types: types.map((t) => t.type).sort(),
      states: states.map((s) => s.state).sort(),
      exams: allExams,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch filters" });
  }
};