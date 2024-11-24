import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { HttpModule } from '@nestjs/axios';  // For HTTP requests to Python backend

@Module({
  imports: [HttpModule],  // Import HttpModule to use HttpService
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
