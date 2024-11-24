import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { User, UserRole } from "./entities/user.entity";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, "findAll").mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe("findOne", () => {
    it("should return a user by ID", async () => {
      const result: User = {
        id: 1,
        username: "John",
        email: "john@example.com",
        password: "password",
        role: UserRole.ADMIN,
        documents: [],
      };
      jest.spyOn(service, "findById").mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
    });

    it("should throw NotFoundException if user not found", async () => {
      jest
        .spyOn(service, "findById")
        .mockRejectedValue(new NotFoundException("User not found"));

      await expect(controller.findOne(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should create and return a new user", async () => {
      const createUserDto: CreateUserDto = {
        username: "Jane",
        email: "jane@example.com",
        password: "password",
        role: UserRole.VIEWER,
      };
      const result: User = { id: 2, ...createUserDto, documents: [] };

      jest.spyOn(service, "create").mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toBe(result);
    });

    it("should throw BadRequestException if user creation fails", async () => {
      const createUserDto: CreateUserDto = {
        username: "Jane",
        email: "jane@example.com",
        password: "password",
        role: UserRole.VIEWER,
      };
      jest
        .spyOn(service, "create")
        .mockRejectedValue(new BadRequestException("Failed to create user"));

      await expect(controller.create(createUserDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("update", () => {
    it("should update and return the updated user", async () => {
      const updateUserDto: UpdateUserDto = { email: "newemail@example.com" };
      const result: User = {
        id: 1,
        username: "John",
        email: "newemail@example.com",
        password: "password",
        role: UserRole.ADMIN,
        documents: [],
      };
      jest.spyOn(service, "update").mockResolvedValue(result);

      expect(await controller.update(1, updateUserDto)).toBe(result);
    });

    it("should throw BadRequestException if update fails", async () => {
      const updateUserDto: UpdateUserDto = { email: "newemail@example.com" };
      jest
        .spyOn(service, "update")
        .mockRejectedValue(new BadRequestException("Failed to update user"));

      await expect(controller.update(1, updateUserDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("remove", () => {
    it("should remove the user", async () => {
      const result = undefined; // No return value expected
      jest.spyOn(service, "remove").mockResolvedValue(result);

      await expect(controller.remove(1)).resolves.not.toThrow();
    });

    it("should throw NotFoundException if user not found", async () => {
      jest
        .spyOn(service, "remove")
        .mockRejectedValue(new NotFoundException("User not found"));

      await expect(controller.remove(9999)).rejects.toThrow(NotFoundException);
    });
  });
});
