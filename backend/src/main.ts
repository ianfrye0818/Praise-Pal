import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from './env';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: [
      env.CLIENT_URL,
      'http://0.0.0.0:8011',
      'http://localhost:8011',
      'http://localhost:5174',
      'http://localhost:5173',
      'https://praise-pal.com',
      'https://localhost:3000',
      'https://www.praise-pal.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  await app.listen(env.PORT || 3000, () =>
    console.log(`Server is running on port ${env.PORT}`),
  );
}
bootstrap();
