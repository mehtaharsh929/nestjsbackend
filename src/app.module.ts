import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ingestion/ingestion.module';
@Module({
  imports: [
    DatabaseModule,  // DatabaseModule handles DB connection
    AuthModule,      // Import AuthModule
    UsersModule,     // Import UsersModule for user management
    DocumentsModule, // Import DocumentsModule for Docs management
    IngestionModule  // Import IngestionModule for calling Python Api
    ],
  controllers: [AppController], // Controller that handles incoming requests
  providers: [AppService], // Main application service
})
export class AppModule {} 
