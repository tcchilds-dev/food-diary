import { createEntry, getEntries, deleteEntry } from "../entryController";
import { prismaMock } from "../../singleton";
import { AuthRequest } from "../../middleware/auth";
import { Response } from "express";

describe("entryController", () => {
  let mockAuthReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;

  mockAuthReq = {
    params: {},
    query: {},
    body: {},
    userId: undefined,
  };

  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEntry", () => {
    it("should successfully create a new food entry", async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        date: new Date(),
        entryType: "food",
        mealType: "dinner",
        foodName: "burger",
        calories: 300,
        symptomType: null,
        symptomSeverity: null,
        exerciseType: null,
        exerciseIntensity: null,
        exerciseDuration: null,
        notes: "test",
        createdAt: new Date(),
      };

      mockAuthReq.body = {
        entryType: "food",
        mealType: "dinner",
        foodName: "burger",
        calories: 300,
        notes: "test",
      };

      mockAuthReq.userId = 1;

      prismaMock.entry.create.mockResolvedValue(mockEntry);

      await createEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.create).toHaveBeenCalledWith({
        data: {
          userId: mockAuthReq.userId!,
          ...mockAuthReq.body,
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEntry);
    });
    it("should successfully create a new symptom entry", async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        date: new Date(),
        entryType: "symptom",
        mealType: null,
        foodName: null,
        calories: null,
        symptomType: "pain",
        symptomSeverity: 2,
        exerciseType: null,
        exerciseIntensity: null,
        exerciseDuration: null,
        notes: "test",
        createdAt: new Date(),
      };

      mockAuthReq.body = {
        entryType: "symptom",
        symptomType: "pain",
        symptomSeverity: 2,
        notes: "test",
      };

      mockAuthReq.userId = 1;

      prismaMock.entry.create.mockResolvedValue(mockEntry);

      await createEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.create).toHaveBeenCalledWith({
        data: {
          userId: mockAuthReq.userId!,
          ...mockAuthReq.body,
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEntry);
    });
    it("should successfully create a new exercise entry", async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        date: new Date(),
        entryType: "exercise",
        mealType: null,
        foodName: null,
        calories: null,
        symptomType: null,
        symptomSeverity: null,
        exerciseType: "walking",
        exerciseIntensity: 2,
        exerciseDuration: 120,
        notes: "test",
        createdAt: new Date(),
      };

      mockAuthReq.body = {
        entryType: "exercise",
        exerciseType: "walking",
        exerciseIntensity: 2,
        exerciseDuration: 120,
        notes: "test",
      };

      mockAuthReq.userId = 1;

      prismaMock.entry.create.mockResolvedValue(mockEntry);

      await createEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.create).toHaveBeenCalledWith({
        data: {
          userId: mockAuthReq.userId!,
          ...mockAuthReq.body,
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEntry);
    });

    it("should return 500 if there was an error creating the entry", async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        date: new Date(),
        entryType: "food",
        mealType: "dinner",
        foodName: "burger",
        calories: 300,
        symptomType: null,
        symptomSeverity: null,
        exerciseType: null,
        exerciseIntensity: null,
        exerciseDuration: null,
        notes: "test",
        createdAt: new Date(),
      };

      mockAuthReq.body = {
        entryType: "food",
        mealType: "dinner",
        foodName: "burger",
        calories: 300,
        notes: "test",
      };

      mockAuthReq.userId = 1;

      prismaMock.entry.create.mockRejectedValue(new Error("Database error"));

      await createEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error creating entry",
      });
    });
  });

  describe("getEntries", () => {
    it("should return all entries for a user when no filters are provided", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15"),
          entryType: "food",
          mealType: "breakfast",
          foodName: "oatmeal",
          calories: 200,
          symptomType: null,
          symptomSeverity: null,
          exerciseType: null,
          exerciseIntensity: null,
          exerciseDuration: null,
          notes: "morning meal",
          createdAt: new Date(),
        },
        {
          id: 2,
          userId: 1,
          date: new Date("2024-01-14"),
          entryType: "symptom",
          mealType: null,
          foodName: null,
          calories: null,
          symptomType: "bloating",
          symptomSeverity: 3,
          exerciseType: null,
          exerciseIntensity: null,
          exerciseDuration: null,
          notes: "felt bloated",
          createdAt: new Date(),
        },
      ];

      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should filter entries by specific date", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15T10:00:00"),
          entryType: "food",
          mealType: "lunch",
          foodName: "salad",
          calories: 300,
          symptomType: null,
          symptomSeverity: null,
          exerciseType: null,
          exerciseIntensity: null,
          exerciseDuration: null,
          notes: null,
          createdAt: new Date(),
        },
      ];

      mockAuthReq.query = { date: "2024-01-15" };
      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      const queryDate = new Date("2024-01-15");
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          date: {
            gte: queryDate,
            lt: nextDay,
          },
        },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should filter entries by date range", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15"),
          entryType: "exercise",
          mealType: null,
          foodName: null,
          calories: null,
          symptomType: null,
          symptomSeverity: null,
          exerciseType: "running",
          exerciseIntensity: 4,
          exerciseDuration: 30,
          notes: "morning run",
          createdAt: new Date(),
        },
      ];

      mockAuthReq.query = { startDate: "2024-01-10", endDate: "2024-01-20" };
      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          date: {
            gte: new Date("2024-01-10"),
            lte: new Date("2024-01-20"),
          },
        },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should filter entries by entryType", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15"),
          entryType: "food",
          mealType: "dinner",
          foodName: "pasta",
          calories: 500,
          symptomType: null,
          symptomSeverity: null,
          exerciseType: null,
          exerciseIntensity: null,
          exerciseDuration: null,
          notes: null,
          createdAt: new Date(),
        },
      ];

      mockAuthReq.query = { entryType: "food" };
      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          entryType: "food",
        },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should filter entries by both date and entryType", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15T10:00:00"),
          entryType: "symptom",
          mealType: null,
          foodName: null,
          calories: null,
          symptomType: "pain",
          symptomSeverity: 5,
          exerciseType: null,
          exerciseIntensity: null,
          exerciseDuration: null,
          notes: "severe pain",
          createdAt: new Date(),
        },
      ];

      mockAuthReq.query = { date: "2024-01-15", entryType: "symptom" };
      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      const queryDate = new Date("2024-01-15");
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          date: {
            gte: queryDate,
            lt: nextDay,
          },
          entryType: "symptom",
        },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should filter entries by date range and entryType", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15"),
          entryType: "exercise",
          mealType: null,
          foodName: null,
          calories: null,
          symptomType: null,
          symptomSeverity: null,
          exerciseType: "walking",
          exerciseIntensity: 2,
          exerciseDuration: 45,
          notes: null,
          createdAt: new Date(),
        },
      ];

      mockAuthReq.query = {
        startDate: "2024-01-10",
        endDate: "2024-01-20",
        entryType: "exercise",
      };
      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          date: {
            gte: new Date("2024-01-10"),
            lte: new Date("2024-01-20"),
          },
          entryType: "exercise",
        },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should return empty array when no entries match filters", async () => {
      mockAuthReq.query = { entryType: "food" };
      prismaMock.entry.findMany.mockResolvedValue([]);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it("should only return entries for the authenticated user", async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          date: new Date("2024-01-15"),
          entryType: "food",
          mealType: "breakfast",
          foodName: "eggs",
          calories: 150,
          symptomType: null,
          symptomSeverity: null,
          exerciseType: null,
          exerciseIntensity: null,
          exerciseDuration: null,
          notes: null,
          createdAt: new Date(),
        },
      ];

      mockAuthReq.userId = 1;
      prismaMock.entry.findMany.mockResolvedValue(mockEntries);

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 }),
        }),
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it("should return 500 if there was an error fetching entries", async () => {
      mockAuthReq.query = {};
      prismaMock.entry.findMany.mockRejectedValue(new Error("Database error"));

      await getEntries(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error fetching entries",
      });
    });
  });

  describe("deleteEntry", () => {
    it("should delete a specified entry", async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        date: new Date(),
        entryType: "exercise",
        mealType: null,
        foodName: null,
        calories: null,
        symptomType: null,
        symptomSeverity: null,
        exerciseType: "walking",
        exerciseIntensity: 2,
        exerciseDuration: 120,
        notes: "test",
        createdAt: new Date(),
      };

      mockAuthReq.params = { id: "1" };

      mockAuthReq.userId = 1;

      prismaMock.entry.findFirst.mockResolvedValue(mockEntry);

      await deleteEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findFirst).toHaveBeenCalledWith({
        where: {
          id: parseInt("1"),
          userId: 1,
        },
      });
      expect(prismaMock.entry.delete).toHaveBeenCalledWith({
        where: {
          id: parseInt("1"),
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Entry deleted successfully",
      });
    });

    it("should return 400 if id is missing", async () => {
      mockAuthReq.userId = 1;

      mockAuthReq.params = {};

      await deleteEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid request",
      });
    });

    it("should return 400 if userId is missing", async () => {
      mockAuthReq.userId = undefined;

      mockAuthReq.params = { id: "1" };

      await deleteEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid request",
      });
    });

    it("should return 404 if the entry does not exist", async () => {
      mockAuthReq.params = { id: "1" };

      mockAuthReq.userId = 1;

      prismaMock.entry.findFirst.mockResolvedValue(null);

      await deleteEntry(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Entry not found",
      });
    });
  });
});
