import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "./entities/document.entity";
import { MulterModule } from "@nestjs/platform-express"; // Add MulterModule for file uploads
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    MulterModule.register({
      dest: "./uploads", // Directory where files will be stored
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
