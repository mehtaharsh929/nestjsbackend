import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { ConflictException, UnauthorizedException } from "@nestjs/common";

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => "mockToken"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const registerDto = {
        email: "test@example.com",
        username: "testUser",
        password: "password123",
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(registerDto);
      mockUserRepository.save.mockResolvedValue(registerDto);

      const result = await service.register(registerDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: registerDto.email },
          { username: registerDto.username },
        ],
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: expect.any(String), // Ensure password is hashed
      });
      expect(result).toEqual(registerDto);
    });

    it("should throw ConflictException if user exists", async () => {
      const registerDto = {
        email: "test@example.com",
        username: "testUser",
        password: "password123",
      };

      mockUserRepository.findOne.mockResolvedValue(registerDto);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("login", () => {
    it("should return a JWT token for valid credentials", async () => {
      const loginDto = { email: "test@example.com", password: "password123" };
      const user = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        role: "user",
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({ token: "mockToken" });
    });

    it("should throw UnauthorizedException for invalid credentials", async () => {
      const loginDto = { email: "test@example.com", password: "wrongPassword" };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
