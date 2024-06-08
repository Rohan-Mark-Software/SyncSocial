import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('SyncSocial API')
      .setDescription('API description for SyncSocial application.')
      .setVersion('1.0')
      .addBearerAuth()
      .addOAuth2()
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, customOptions);
  }

  await app.listen(3000);
}
bootstrap();
