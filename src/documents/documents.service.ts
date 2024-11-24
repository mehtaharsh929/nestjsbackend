import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
    ) { }

    // Helper method for checking permissions
    private hasPermission(userRole: string, documentUserId: number, userId: number): boolean {
        return userRole === UserRole.ADMIN || documentUserId === userId;
    }

    async create(createDocumentDto: CreateDocumentDto, filePath: string, userId: number): Promise<Document> {
        const { title, content } = createDocumentDto;

        try {
            // Create a new document entity, including the file path
            const document = this.documentRepository.create({
                userId,
                title,
                content,   // You can use the 'content' as a description, metadata, or actual content
                filePath,  // Store the file path or URL (e.g., if using S3)
            });

            // Save the document to the database
            return await this.documentRepository.save(document);
        } catch (error) {
            // Provide more meaningful error message
            throw new BadRequestException(`Error while creating document: ${error.message}`);
        }
    }

    async findAll(): Promise<Document[]> {
        try {
            return await this.documentRepository.find();
        } catch (error) {
            throw new BadRequestException(`Error fetching documents: ${error.message}`);
        }
    }

    async findOne(id: number, userId: number, userRole: string): Promise<Document> {
        try {
            const document = await this.documentRepository.findOneOrFail({ where: { id: id } });

            if (!this.hasPermission(userRole, document.userId, userId)) {
                throw new UnauthorizedException('You do not have permission to access this document');
            }

            return document;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Document not found');
            }
            throw new UnauthorizedException('You do not have permission to access this document');
        }
    }

    async update(id: number, updateDocumentDto: UpdateDocumentDto, userId: number, userRole: string): Promise<Document> {
        try {
            const document = await this.documentRepository.findOneOrFail({ where: { id: id } });

            if (!this.hasPermission(userRole, document.userId, userId)) {
                throw new UnauthorizedException('You do not have permission to update this document');
            }

            // Merge updated fields into the existing document object
            Object.assign(document, updateDocumentDto);

            return await this.documentRepository.save(document);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Document not found');
            }
            throw new BadRequestException('Failed to update document: ' + error.message);
        }
    }

    async remove(id: number, userId: number, userRole: string): Promise<void> {
        try {
            const document = await this.documentRepository.findOneOrFail({ where: { id: id } });

            if (!this.hasPermission(userRole, document.userId, userId)) {
                throw new UnauthorizedException('You do not have permission to delete this document');
            }

            await this.documentRepository.remove(document);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Document not found');
            }
            throw new BadRequestException('Failed to delete document: ' + error.message);
        }
    }
}
