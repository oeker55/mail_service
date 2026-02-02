"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
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
//# sourceMappingURL=main.js.map