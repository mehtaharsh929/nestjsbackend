import { Test, TestingModule } from "@nestjs/testing";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { UserRole } from "../users/entities/user.entity";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

describe("DocumentsController", () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument = {
    id: 1,
    title: "Test Document",
    content: "Test Content",
    filePath: "test/path/to/file",
    userId: 1,
  };

  const mockCreateDocumentDto: CreateDocumentDto = {
    title: "Test Document",
    content: "Test Content",
  };

  const mockUpdateDocumentDto: UpdateDocumentDto = {
    title: "Updated Test Document",
  };

  const mockUser = {
    id: 1,
    role: UserRole.ADMIN,
  };

  const mockFile = {
    fieldname: "file",
    originalname: "test-file.pdf",
    encoding: "7bit",
    mimetype: "application/pdf",
    size: 1024,
    buffer: Buffer.from("mock file content"),
    path: "test/path/to/file",
  } as Express.Multer.File; // Explicitly cast to the correct type

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDocument),
            findAll: jest.fn().mockResolvedValue([mockDocument]),
            findOne: jest.fn().mockResolvedValue(mockDocument),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  describe("create", () => {
    it("should create a document", async () => {
      const result = await controller.create(
        mockCreateDocumentDto,
        mockFile,
        mockUser
      );
      expect(result).toEqual(mockDocument);
      expect(service.create).toHaveBeenCalledWith(
        mockCreateDocumentDto,
        mockFile.path,
        mockUser.id
      );
    });

    it("should throw an error if document creation fails", async () => {
      jest
        .spyOn(service, "create")
        .mockRejectedValueOnce(
          new BadRequestException("Error while creating document")
        );
      try {
        await controller.create(mockCreateDocumentDto, mockFile, mockUser);
      } catch (e) {
        expect(e.response.message).toBe("Error while creating document");
      }
    });
  });

  describe("findAll", () => {
    it("should return all documents", async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockDocument]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it("should throw an error if fetching documents fails", async () => {
      jest
        .spyOn(service, "findAll")
        .mockRejectedValueOnce(
          new BadRequestException("Error fetching documents")
        );
      try {
        await controller.findAll();
      } catch (e) {
        expect(e.response.message).toBe("Error fetching documents");
      }
    });
  });

  describe("findOne", () => {
    it("should return a document by ID", async () => {
      const result = await controller.findOne(mockDocument.id, mockUser);
      expect(result).toEqual(mockDocument);
      expect(service.findOne).toHaveBeenCalledWith(
        mockDocument.id,
        mockUser.id,
        mockUser.role
      );
    });

    it("should throw an error if document not found", async () => {
      jest
        .spyOn(service, "findOne")
        .mockRejectedValueOnce(new NotFoundException("Document not found"));
      try {
        await controller.findOne(mockDocument.id, mockUser);
      } catch (e) {
        expect(e.response.message).toBe("Document not found");
      }
    });

    it("should throw an error if user does not have permission", async () => {
      jest
        .spyOn(service, "findOne")
        .mockRejectedValueOnce(
          new UnauthorizedException(
            "You do not have permission to access this document"
          )
        );
      try {
        await controller.findOne(mockDocument.id, mockUser);
      } catch (e) {
        expect(e.response.message).toBe(
          "You do not have permission to access this document"
        );
      }
    });
  });

  describe("remove", () => {
    it("should remove a document", async () => {
      await controller.remove(mockDocument.id, mockUser);
      expect(service.remove).toHaveBeenCalledWith(
        mockDocument.id,
        mockUser.id,
        mockUser.role
      );
    });

    it("should throw an error if document removal fails", async () => {
      jest
        .spyOn(service, "remove")
        .mockRejectedValueOnce(
          new BadRequestException("Failed to delete document")
        );
      try {
        await controller.remove(mockDocument.id, mockUser);
      } catch (e) {
        expect(e.response.message).toBe("Failed to delete document");
      }
    });
  });
});
