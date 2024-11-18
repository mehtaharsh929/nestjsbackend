import * as dotenv from 'dotenv';

// Load environment variables before the application starts
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
  
  async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); 