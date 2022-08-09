import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: process.env.CLIENT_URL },
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('fitty')
    .setDescription('Documentation of fitty web app')
    .setVersion('1.0.0')
    .addTag('vanyaadev')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}
bootstrap();
