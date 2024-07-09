import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from './env';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [
      env.CLIENT_URL,
      'http://0.0.0.0:8011',
      'http://localhost:8011',
      'http://localhost:5173',
      'https://praise-pal.com',
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
  await app.listen(env.PORT || 3000, () =>
    console.log(`Server is running on port ${env.PORT}`),
  );
}
bootstrap();
