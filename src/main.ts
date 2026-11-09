import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
  );

  const config = new DocumentBuilder()
      .setTitle('Wypożyczalnia Płyt Muzycznych API')
      .setDescription('System do zarządzania katalogiem wydań muzycznych, nośnikami i wypożyczeniami')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 80;
  await app.listen(port);
  console.log(`Serwer działa pod adresem: http://localhost:${port}`);
  console.log(`Dokumentacja Swagger: http://localhost:${port}/api`);
}
bootstrap();