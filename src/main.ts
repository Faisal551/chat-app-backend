import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({origin:["http://localhost:3000"]}); // Enable CORS for all routes, including WebSocket
  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();