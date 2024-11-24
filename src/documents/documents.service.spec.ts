import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { Repository } from "typeorm";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";

const mockDocumentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  remove: jest.fn(),
};

describe("DocumentsService", () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create and save a document", async () => {
      const createDto = { title: "Test", content: "Content" };
      const filePath = "uploads/test.pdf";
      const userId = 1;
      const document = { id: 1, ...createDto, filePath, userId };

      mockDocumentRepository.create.mockReturnValue(document);
      mockDocumentRepository.save.mockResolvedValue(document);

      const result = await service.create(createDto, filePath, userId);
      expect(result).toEqual(document);
      expect(mockDocumentRepository.create).toHaveBeenCalledWith({
        ...createDto,
        filePath,
        userId,
      });
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(document);
    });

    it("should throw a BadRequestException on save error", async () => {
      mockDocumentRepository.save.mockRejectedValue(new Error("Save error"));
      await expect(
        service.create({ content: "Test Content", title: "Test Title" }, "", 1)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should return all documents", async () => {
      const documents = [{ id: 1, title: "Test Document" }];
      mockDocumentRepository.find.mockResolvedValue(documents);

      const result = await service.findAll();
      expect(result).toEqual(documents);
      expect(mockDocumentRepository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should throw a NotFoundException if document doesn't exist", async () => {
      mockDocumentRepository.findOneOrFail.mockRejectedValue({
        name: "EntityNotFoundError",
      });

      await expect(service.findOne(0, 1, "USER")).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw an UnauthorizedException if user doesn't have permission", async () => {
      const document = { id: 1, userId: 2 };
      mockDocumentRepository.findOneOrFail.mockResolvedValue(document);

      await expect(service.findOne(1, 1, "USER")).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("remove", () => {
    it("should remove the document", async () => {
      const document = { id: 1, userId: 1 };
      mockDocumentRepository.findOneOrFail.mockResolvedValue(document);
      mockDocumentRepository.remove.mockResolvedValue(undefined);

      await service.remove(1, 1, "ADMIN");
      expect(mockDocumentRepository.remove).toHaveBeenCalledWith(document);
    });

    it("should throw an UnauthorizedException if user doesn't have permission", async () => {
      const document = { id: 1, userId: 2 };
      mockDocumentRepository.findOneOrFail.mockResolvedValue(document);

      await expect(service.remove(1, 1, "USER")).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw a BadRequestException on remove error", async () => {
      const document = { id: 1, userId: 1 };
      mockDocumentRepository.findOneOrFail.mockResolvedValue(document);
      mockDocumentRepository.remove.mockRejectedValue(
        new Error("Failed to delete document")
      );

      await expect(service.remove(1, 1, "ADMIN")).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
