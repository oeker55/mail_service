import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarları
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // API prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  console.log(`🚀 Email Template Service running on http://localhost:${port}`);
  console.log(`📧 API Endpoints:`);
  console.log(`   POST /api/send-mail - Mail gönder`);
  console.log(`   POST /api/mail/send-test - Test mail gönder`);
  console.log(`   GET  /api/templates - Template listesi`);
  console.log(`   GET  /api/templates/:id - Template detay`);
  console.log(`   POST /api/templates - Yeni template`);
  console.log(`   PUT  /api/templates/:id - Template güncelle`);
  console.log(`   DELETE /api/templates/:id - Template sil`);
}
bootstrap();
