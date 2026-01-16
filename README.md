# Email Template Service (NestJS + MongoDB)

Email Template editörü için NestJS backend servisi. MongoDB üzerinde template CRUD işlemleri ve mail gönderimi yapar.

## Kurulum

```bash
cd serviceDocs
npm install
```

## Çalıştırma

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri ayarlayın:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/email_templates

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
```

## API Endpoints

### Mail

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api` | Health check |
| POST | `/api/send-mail` | Mail gönder (eski format - geriye uyumlu) |
| POST | `/api/mail/send-test` | Test maili gönder |
| GET | `/api/mail/test-connection` | SMTP bağlantı testi |

### Templates

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/templates?fcode=XXX` | Template listesi (fcode opsiyonel) |
| GET | `/api/templates/:id` | Template detay |
| POST | `/api/templates` | Yeni template oluştur |
| PUT | `/api/templates/:id` | Template güncelle |
| DELETE | `/api/templates/:id` | Template sil |
| POST | `/api/templates/:id/send` | Template ile mail gönder |

## Request/Response Örnekleri

### Template Oluştur
```json
POST /api/templates
{
  "fcode": "DEMO_COMPANY",
  "name": "Hoş Geldiniz Maili",
  "elements_json": [...],
  "html_content": "<html>...</html>"
}
```

### Template ile Mail Gönder
```json
POST /api/templates/:id/send
{
  "recipients": ["user1@email.com", "user2@email.com"],
  "subject": "Özel Konu (opsiyonel)",
  "replacements": {
    "userName": "Ahmet",
    "companyName": "ABC Ltd."
  }
}
```

### Eski Format Mail Gönder (Geriye Uyumlu)
```json
POST /api/send-mail
{
  "to": "alici@email.com",
  "subject": "Mail Konusu",
  "html": "<html>...</html>"
}
```

## MongoDB Schema

```javascript
Template {
  _id: ObjectId,
  fcode: String,      // Firma kodu
  name: String,       // Template adı
  elements_json: [],  // Canvas elementleri (düzenleme için)
  html_content: String, // Oluşturulan HTML (mail gönderme için)
  createdAt: Date,
  updatedAt: Date
}
```

## Proje Yapısı

```
serviceDocs/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── mail/
│   │   ├── mail.module.ts
│   │   ├── mail.service.ts
│   │   ├── mail.controller.ts
│   │   └── dto/
│   │       └── send-mail.dto.ts
│   └── templates/
│       ├── templates.module.ts
│       ├── templates.service.ts
│       ├── templates.controller.ts
│       ├── schemas/
│       │   └── template.schema.ts
│       └── dto/
│           ├── create-template.dto.ts
│           ├── update-template.dto.ts
│           └── send-with-template.dto.ts
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```
