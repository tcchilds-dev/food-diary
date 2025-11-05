import { register, login, getProfile } from "../authController";
import { prismaMock } from "../../singleton";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/auth";

// Mock bcrypt and jwt
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockAuthReq: Partial<AuthRequest>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response
    mockReq = {
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockAuthReq = {
      body: {},
      userId: undefined,
    };
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword123",
        name: "Test User",
        createdAt: new Date(),
      };

      mockReq.body = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      // Mock Prisma and bcrypt
      prismaMock.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue("hashedPassword123" as never);
      prismaMock.user.create.mockResolvedValue(mockUser);
      mockedJwt.sign.mockReturnValue("mock-jwt-token" as never);

      await register(mockReq as Request, mockRes as Response);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          password: "hashedPassword123",
          name: "Test User",
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        token: "mock-jwt-token",
        user: {
          id: 1,
          email: "test@example.com",
          name: "Test User",
        },
      });
    });

    it("should register user without name (optional field)", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword123",
        name: null,
        createdAt: new Date(),
      };

      mockReq.body = {
        email: "test@example.com",
        password: "password123",
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue("hashedPassword123" as never);
      prismaMock.user.create.mockResolvedValue(mockUser);
      mockedJwt.sign.mockReturnValue("mock-jwt-token" as never);

      await register(mockReq as Request, mockRes as Response);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          password: "hashedPassword123",
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if email is missing", async () => {
      mockReq.body = {
        password: "password123",
      };

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return 400 if password is missing", async () => {
      mockReq.body = {
        email: "test@example.com",
      };

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 400 if user already exists", async () => {
      mockReq.body = {
        email: "existing@example.com",
        password: "password123",
      };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: "existing@example.com",
        password: "hashedPassword",
        name: "Existing User",
        createdAt: new Date(),
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User already exists",
      });
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it("should return 500 if database error occurs", async () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password123",
      };

      prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error creating user",
      });
    });
  });

  describe("login", () => {
    it("should successfully login a user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword123",
        name: "Test User",
        createdAt: new Date(),
      };

      mockReq.body = {
        email: "test@example.com",
        password: "password123",
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue("mock-jwt-token" as never);

      await login(mockReq as Request, mockRes as Response);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword123"
      );
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: 1 },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        token: "mock-jwt-token",
        user: {
          id: 1,
          email: "test@example.com",
          name: "Test User",
        },
      });
    });

    it("should return 400 if email is missing", async () => {
      mockReq.body = {
        password: "password123",
      };

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 400 if password is missing", async () => {
      mockReq.body = {
        email: "test@example.com",
      };

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
    });

    it("should return 401 if user does not exist", async () => {
      mockReq.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it("should return 401 if password is incorrect", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword123",
        name: "Test User",
        createdAt: new Date(),
      };

      mockReq.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });

    it("should return 500 if database error occurs", async () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password123",
      };

      prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error logging in",
      });
    });
  });

  describe("getProfile", () => {
    it("should successfully get user profile", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date(),
      };

      mockAuthReq.userId = 1;

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      await getProfile(mockAuthReq as AuthRequest, mockRes as Response);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 401 if userId is not present", async () => {
      mockAuthReq.userId = undefined;

      await getProfile(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      mockAuthReq.userId = 999;

      prismaMock.user.findUnique.mockResolvedValue(null);

      await getProfile(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("should return 500 if database error occurs", async () => {
      mockAuthReq.userId = 1;

      prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

      await getProfile(mockAuthReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error fetching profile",
      });
    });
  });
});
