import {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
} from "../entryController";
import { prismaMock } from "../../singleton";
import { AuthRequest } from "../../middleware/auth";
import { Response } from "express";

describe("Entry Controller", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
      query: {},
      userId: 1,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("createEntry", () => {
    it("should create an entry for the authenticated user", async () => {
      const entryData = {
        date: new Date("2024-01-01"),
        entryType: "MEAL",
        note: "Breakfast",
      };

      const createdEntry = {
        id: 1,
        userId: 1,
        ...entryData,
      };

      mockReq.body = entryData;

      prismaMock.entry.create.mockResolvedValue(createdEntry as never);

      await createEntry(mockReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          ...entryData,
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdEntry);
    });

    it("should return 500 when creation fails", async () => {
      mockReq.body = { entryType: "MEAL" };
      prismaMock.entry.create.mockRejectedValue(new Error("Database error"));

      await createEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error creating entry",
      });
    });
  });

  describe("getEntries", () => {
    it("should fetch entries for the user without filters", async () => {
      const entries = [
        { id: 1, userId: 1, entryType: "MEAL", date: new Date("2024-01-01") },
      ];

      prismaMock.entry.findMany.mockResolvedValue(entries as never);

      await getEntries(mockReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { date: "desc" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(entries);
    });

    it("should apply date filter when date is provided", async () => {
      const queryDate = new Date("2024-02-10");
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);

      mockReq.query = { date: "2024-02-10" } as any;
      prismaMock.entry.findMany.mockResolvedValue([] as never);

      await getEntries(mockReq as AuthRequest, mockRes as Response);

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
    });

    it("should apply date range and entry type filters", async () => {
      const start = new Date("2024-03-01");
      const end = new Date("2024-03-05");

      mockReq.query = {
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        entryType: "MOOD",
      } as any;

      prismaMock.entry.findMany.mockResolvedValue([] as never);

      await getEntries(mockReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          date: {
            gte: start,
            lte: end,
          },
          entryType: "MOOD",
        },
        orderBy: { date: "desc" },
      });
    });

    it("should return 500 when fetching entries fails", async () => {
      prismaMock.entry.findMany.mockRejectedValue(new Error("Database error"));

      await getEntries(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error fetching entries",
      });
    });
  });

  describe("getEntry", () => {
    it("should return a specific entry for the user", async () => {
      const entry = {
        id: 1,
        userId: 1,
        entryType: "MEAL",
        date: new Date("2024-01-02"),
      };

      mockReq.params = { id: "1" };
      prismaMock.entry.findFirst.mockResolvedValue(entry as never);

      await getEntry(mockReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 1,
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(entry);
    });

    it("should return 400 when id or userId is missing", async () => {
      mockReq.userId = undefined;
      mockReq.params = {};

      await getEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid request" });
      expect(prismaMock.entry.findFirst).not.toHaveBeenCalled();
    });

    it("should return 404 when entry is not found", async () => {
      mockReq.params = { id: "5" };
      prismaMock.entry.findFirst.mockResolvedValue(null as never);

      await getEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Entry not found" });
    });

    it("should return 500 when fetching the entry fails", async () => {
      mockReq.params = { id: "2" };
      prismaMock.entry.findFirst.mockRejectedValue(new Error("Database error"));

      await getEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error fetching entry",
      });
    });
  });

  describe("updateEntry", () => {
    it("should update an existing entry", async () => {
      const existingEntry = {
        id: 1,
        userId: 1,
      };

      const updatedEntry = {
        ...existingEntry,
        note: "Updated note",
      };

      mockReq.params = { id: "1" };
      mockReq.body = { note: "Updated note" };

      prismaMock.entry.findFirst.mockResolvedValue(existingEntry as never);
      prismaMock.entry.update.mockResolvedValue(updatedEntry as never);

      await updateEntry(mockReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 1,
        },
      });
      expect(prismaMock.entry.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { note: "Updated note" },
      });
      expect(mockRes.json).toHaveBeenCalledWith(updatedEntry);
    });

    it("should return 400 when id or userId is missing", async () => {
      mockReq.userId = undefined;
      mockReq.params = {};

      await updateEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid request" });
      expect(prismaMock.entry.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.entry.update).not.toHaveBeenCalled();
    });

    it("should return 404 when entry does not exist", async () => {
      mockReq.params = { id: "3" };
      prismaMock.entry.findFirst.mockResolvedValue(null as never);

      await updateEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Entry not found" });
      expect(prismaMock.entry.update).not.toHaveBeenCalled();
    });

    it("should return 500 when update fails", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { note: "Updated note" };

      prismaMock.entry.findFirst.mockResolvedValue({ id: 1, userId: 1 } as never);
      prismaMock.entry.update.mockRejectedValue(new Error("Database error"));

      await updateEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error updating entry",
      });
    });
  });

  describe("deleteEntry", () => {
    it("should delete an existing entry", async () => {
      mockReq.params = { id: "1" };

      prismaMock.entry.findFirst.mockResolvedValue({ id: 1, userId: 1 } as never);
      prismaMock.entry.delete.mockResolvedValue({} as never);

      await deleteEntry(mockReq as AuthRequest, mockRes as Response);

      expect(prismaMock.entry.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 1,
        },
      });
      expect(prismaMock.entry.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Entry deleted successfully",
      });
    });

    it("should return 400 when id or userId is missing", async () => {
      mockReq.userId = undefined;
      mockReq.params = {};

      await deleteEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid request" });
      expect(prismaMock.entry.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.entry.delete).not.toHaveBeenCalled();
    });

    it("should return 404 when entry is not found", async () => {
      mockReq.params = { id: "2" };
      prismaMock.entry.findFirst.mockResolvedValue(null as never);

      await deleteEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Entry not found" });
      expect(prismaMock.entry.delete).not.toHaveBeenCalled();
    });

    it("should return 500 when delete fails", async () => {
      mockReq.params = { id: "1" };

      prismaMock.entry.findFirst.mockResolvedValue({ id: 1, userId: 1 } as never);
      prismaMock.entry.delete.mockRejectedValue(new Error("Database error"));

      await deleteEntry(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error deleting entry ",
      });
    });
  });
});
