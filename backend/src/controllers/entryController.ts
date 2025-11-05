import { Response } from "express";
import { prisma } from "../client";
import { AuthRequest } from "../middleware/auth";

export const createEntry = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await prisma.entry.create({
      data: {
        userId: req.userId!,
        ...req.body,
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating entry" });
  }
};

export const getEntries = async (req: AuthRequest, res: Response) => {
  try {
    const { date, entryType, startDate, endDate } = req.query;

    const where: any = { userId: req.userId };

    if (date) {
      const queryDate = new Date(date as string);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.date = {
        gte: queryDate,
        lt: nextDay,
      };
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (entryType) {
      where.entryType = entryType;
    }

    const entries = await prisma.entry.findMany({
      where,
      orderBy: { date: "desc" },
    });

    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching entries" });
  }
};

export const getEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !req.userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const entry = await prisma.entry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching entry" });
  }
};

export const updateEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !req.userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Check entry exists and belongs to user
    const existingEntry = await prisma.entry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const entry = await prisma.entry.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating entry" });
  }
};

export const deleteEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !req.userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Check entry exists and belongs to user
    const existingEntry = await prisma.entry.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await prisma.entry.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting entry " });
  }
};
