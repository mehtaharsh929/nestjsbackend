import { Controller, Post, Get, Param, Body, Delete, UploadedFile, UseInterceptors, Put, UseGuards, Req } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Document } from './entities/document.entity';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  // Create a document
  @Post()
  @UseInterceptors(FileInterceptor('file')) // File upload handling
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR) // Both admin and editor roles can create documents
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any // Using custom decorator to get the current user
  ): Promise<Document> {
    const filePath = file ? file.path : ''; // Get file path (or URL if using S3, etc.)
    console.log("filePath", filePath);
    const userId = user.id;

    // Pass the file path along with other document data to the service
    return this.documentsService.create(createDocumentDto, filePath, userId);
  }

  // Get all documents
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admin can view all documents
  @Get()
  async findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }

  // Get a single document by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @CurrentUser() user: any // Using custom decorator to get the current user
  ): Promise<Document> {
    const userId = user.id; // User id from JWT token
    const userRole = user.role; // User role from JWT token

    return this.documentsService.findOne(id, userId, userRole); // Pass userId and userRole to service
  }

  // Update a document
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))  // 'file' field name should match
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: any
  ): Promise<Document> {
    const filePath = file ? file.path : '';  // If file exists, store its path, otherwise an empty string
    const userId = request.user.id;  // User id from JWT token
    const userRole = request.user.role;  // User role from JWT token
    return this.documentsService.update(id, { ...updateDocumentDto, filePath }, userId, userRole);
  }


  // Delete a document
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: any // Using custom decorator to get the current user
  ): Promise<void> {
    const userId = user.id; // User id from JWT token
    const userRole = user.role; // User role from JWT token
    return this.documentsService.remove(id, userId, userRole);
  }
}
