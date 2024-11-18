import { Controller, Post, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private ingestionService: IngestionService) {}

  // POST endpoint to trigger ingestion
  @Post('trigger')
  async triggerIngestion(@Body() ingestionData: any) {
    // Call the service to trigger ingestion in the Python backend
    return this.ingestionService.triggerIngestion(ingestionData);
  }
}
