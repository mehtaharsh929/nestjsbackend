import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class IngestionService {
    constructor(private httpService: HttpService) { }

    // Method to trigger ingestion in Python backend
    async triggerIngestion(ingestionData: any): Promise<any> {
        const pythonIngestionUrl = process.env.PYTHON_BACKEND_URL || 'http://python-backend:5000/start-ingestion';  // Python backend URL

        try {
            const response = await this.httpService
                .post(pythonIngestionUrl, ingestionData)
                .toPromise();  // Await the response from Python backend

            // Return the response from the Python backend
            return response.data;
        } catch (error) {
            throw new BadRequestException('Failed to trigger ingestion process');
        }
    }
}
