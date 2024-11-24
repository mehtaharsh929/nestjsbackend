import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { UserRole } from "././entities/user.entity";

describe("UsersService", () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result: User[] = [
        {
          id: 1,
          username: "John",
          email: "john@example.com",
          password: "password",
          role: UserRole.ADMIN,
          documents: [],
        },
      ];
      jest.spyOn(repository, "find").mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe("findById", () => {
    it("should return a user by ID", async () => {
      const result: User = {
        id: 1,
        username: "John",
        email: "john@example.com",
        password: "password",
        role: UserRole.ADMIN,
        documents: [],
      };
      jest.spyOn(repository, "findOne").mockResolvedValue(result);

      expect(await service.findById(1)).toBe(result);
    });

    it("should throw NotFoundException if user not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      await expect(service.findById(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should create and return a new user", async () => {
      const createUserDto = {
        email: "test@example.com",
        username: "testuser",
        password: "password",
        role: UserRole.ADMIN,
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const result: User = {
        id: 2,
        ...createUserDto,
        password: hashedPassword,
        documents: [],
      };

      jest.spyOn(repository, "findOne").mockResolvedValue(null); // No existing user
      jest.spyOn(repository, "create").mockReturnValue(result);
      jest.spyOn(repository, "save").mockResolvedValue(result);

      expect(await service.create(createUserDto)).toBe(result);
    });

    it("should throw ConflictException if email or username already exists", async () => {
      const createUserDto = {
        email: "test@example.com",
        username: "testuser",
        password: "password",
        role: UserRole.ADMIN,
      };
      jest.spyOn(repository, "findOne").mockResolvedValue({
        id: 1,
        email: "test@example.com",
        username: "John",
        password: "password",
        role: UserRole.ADMIN, // Use enum for role
        documents: [],
      }); // Existing user

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException
      );
    });

    it("should throw BadRequestException on other errors", async () => {
      const createUserDto = {
        email: "test@example.com",
        username: "testuser",
        password: "password",
        role: UserRole.ADMIN,
      };
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      jest
        .spyOn(repository, "save")
        .mockRejectedValue(new Error("Unexpected error"));

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("update", () => {
    it("should update and return the updated user", async () => {
      const updateUserDto = { email: "newemail@example.com" };
      const existingUser: User = {
        id: 1,
        username: "John",
        email: "john@example.com",
        password: "password",
        role: UserRole.ADMIN,
        documents: [],
      };
      const updatedUser: User = { ...existingUser, ...updateUserDto };

      jest.spyOn(service, "findById").mockResolvedValue(existingUser);
      jest.spyOn(repository, "findOne").mockResolvedValue(null); // No conflict
      jest.spyOn(repository, "save").mockResolvedValue(updatedUser);

      expect(await service.update(1, updateUserDto)).toBe(updatedUser);
    });

    it("should throw ConflictException if email is taken by another user", async () => {
      const updateUserDto = { email: "newemail@example.com" };

      // The current user being updated
      const existingUser: User = {
        id: 1,
        username: "John",
        email: "john@example.com",
        password: "password",
        role: UserRole.ADMIN,
        documents: [],
      };

      // Mock the current user found by ID
      jest.spyOn(service, "findById").mockResolvedValue(existingUser);

      // Mock a conflicting user with the same email
      jest.spyOn(repository, "findOne").mockResolvedValue({
        id: 2, // Different ID to simulate conflict
        email: "newemail@example.com", // Same email as in updateUserDto
        username: "Jane",
        password: "password123",
        role: UserRole.ADMIN,
        documents: [],
      });

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const user: User = {
        id: 1,
        username: "John",
        email: "john@example.com",
        password: "password",
        role: UserRole.ADMIN,
        documents: [],
      };

      // Mock findById to return the user
      jest.spyOn(service, "findById").mockResolvedValue(user);

      // Mock repository remove to resolve successfully
      jest.spyOn(repository, "remove").mockResolvedValue(undefined);

      // Call the service remove method
      await expect(service.remove(1)).resolves.toBeUndefined();

      // Verify repository methods were called
      expect(repository.remove).toHaveBeenCalledWith(user);
    });

    it("should throw NotFoundException if user not found", async () => {
      // Mock findById to throw NotFoundException
      jest.spyOn(service, "findById").mockImplementation(() => {
        throw new NotFoundException(`User with id 9999 not found`);
      });

      // Call the service remove method with an invalid id
      await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
    });
  });
});
