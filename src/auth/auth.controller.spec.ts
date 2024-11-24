import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should call AuthService.register with correct data", async () => {
      const registerDto = {
        email: "test@example.com",
        username: "testUser",
        password: "password123",
      };

      mockAuthService.register.mockResolvedValue("user");

      const result = await controller.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual("user");
    });
  });

  describe("login", () => {
    it("should call AuthService.login with correct data", async () => {
      const loginDto = { email: "test@example.com", password: "password123" };

      mockAuthService.login.mockResolvedValue({ token: "mockToken" });

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ token: "mockToken" });
    });
  });
});
