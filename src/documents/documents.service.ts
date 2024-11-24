import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Document } from "./entities/document.entity";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { UserRole } from "../users/entities/user.entity";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>
  ) {}

  // Helper method for checking permissions
  private hasPermission(
    userRole: string,
    documentUserId: number,
    userId: number
  ): boolean {
    return userRole === UserRole.ADMIN || documentUserId === userId;
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    filePath: string,
    userId: number
  ): Promise<Document> {
    const { title, content } = createDocumentDto;

    try {
      const document = this.documentRepository.create({
        userId,
        title,
        content,
        filePath,
      });

      return await this.documentRepository.save(document);
    } catch (error) {
      throw new BadRequestException(
        `Error while creating document: ${error.message}`
      );
    }
  }

  async findAll(): Promise<Document[]> {
    try {
      return await this.documentRepository.find();
    } catch (error) {
      throw new BadRequestException(
        `Error fetching documents: ${error.message}`
      );
    }
  }

  async findOne(
    id: number,
    userId: number,
    userRole: string
  ): Promise<Document> {
    try {
      const document = await this.documentRepository.findOneOrFail({
        where: { id },
      });

      if (!document) {
        console.log("ewewewewewewew");
        throw new NotFoundException("Document Not Found");
      }

      if (!this.hasPermission(userRole, document.userId, userId)) {
        throw new UnauthorizedException(
          "You do not have permission to access this document"
        );
      }

      return document;
    } catch (error) {
      if (error.name === "EntityNotFoundError") {
        throw new NotFoundException("Document not found");
      } else if (error instanceof UnauthorizedException) {
        throw error; // Explicitly rethrow UnauthorizedException
      } else {
        throw new BadRequestException();
      }
    }
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    userId: number,
    userRole: string
  ): Promise<Document> {
    try {
      const document = await this.documentRepository.findOneOrFail({
        where: { id },
      });

      if (!this.hasPermission(userRole, document.userId, userId)) {
        throw new UnauthorizedException(
          "You do not have permission to update this document"
        );
      }

      Object.assign(document, updateDocumentDto);

      return await this.documentRepository.save(document);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Document not found");
      }
      throw new BadRequestException(
        `Failed to update document: ${error.message}`
      );
    }
  }

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    try {
      const document = await this.documentRepository.findOneOrFail({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException("Document Not Found");
      }

      if (!this.hasPermission(userRole, document.userId, userId)) {
        throw new UnauthorizedException(
          "You do not have permission to delete this document"
        );
      }

      await this.documentRepository.remove(document);
    } catch (error) {
      if (error.name === "EntityNotFoundError") {
        throw new NotFoundException("Document not found");
      } else if (error instanceof UnauthorizedException) {
        throw error; // Explicitly rethrow UnauthorizedException
      } else {
        throw new BadRequestException(
          `Failed to delete document: ${error.message}`
        );
      }
    }
  }
}
