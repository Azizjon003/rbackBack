# RBAC Backend

Ushbu loyiha foydalanuvchilar, rollar va ruxsatlarni boshqarish uchun yaratilgan backend ilova hisoblanadi. Tizimda JWT orqali autentifikatsiya va RBAC (Role-Based Access Control) asosida avtorizatsiya amalga oshirilgan.

## Texnologiyalar

- **Node.js** (>=16)
- **Express.js** 5
- **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL**
- **JWT** (autentifikatsiya)
- **Zod** (validatsiya)
- **bcrypt** (parol xeshlash)

## Ishga tushirish

### 1. Dependency o'rnatish

```bash
npm install
```

### 2. .env faylni sozlash

`config/` papkasida `.env.development` nomli fayl yarating va quyidagi ma'lumotlarni kiriting:

```env
NODE_ENV=development
PORT=3000
HOST=localhost
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/rbac?schema=public
JWT_SECRET=your-secret-key
```

### 3. Bazani migrate qilish

```bash
npx prisma migrate dev
```

### 4. Seed ishga tushirish

Rollar, permissionlar va default admin foydalanuvchini bazaga kiritish uchun:

```bash
npm run seed
```

Seed tugagandan keyin tizimga quyidagi ma'lumotlar bilan kirish mumkin:

- **Email:** `admin@admin.com`
- **Parol:** `admin123`

### 5. Serverni yoqish

```bash
npm run dev
```

Ilova `http://localhost:3000` portida ishga tushadi.

## API

### Auth

| Method | URL | Himoya | Izoh |
|--------|-----|--------|------|
| POST | `/api/auth/login` | Yo'q | Login |
| POST | `/api/auth/register` | Yo'q | Registratsiya |
| GET | `/api/auth/me` | JWT | Joriy foydalanuvchi haqida ma'lumot |

### Foydalanuvchilar

Quyidagi barcha so'rovlar uchun `Authorization: Bearer <token>` header kerak.

| Method | URL | Ruxsat | Izoh |
|--------|-----|--------|------|
| GET | `/api/users/all` | READ:USERS | Foydalanuvchilar ro'yxati |
| POST | `/api/users/add` | WRITE:USERS | Yangi foydalanuvchi qo'shish |
| PUT | `/api/users/update` | WRITE:USERS | Foydalanuvchini tahrirlash (parolsiz) |
| DELETE | `/api/users/delete/:id` | DELETE:USERS | Foydalanuvchini o'chirish |
| GET | `/api/users/roles` | JWT | Rollar ro'yxati |
| POST | `/api/users/role/add` | WRITE:ROLES | Foydalanuvchiga rol berish |
| POST | `/api/users/role/delete` | WRITE:ROLES | Foydalanuvchidan rol olish |
| GET | `/api/users/permissions` | JWT | Permissionlar ro'yxati |
| POST | `/api/users/permission/add` | WRITE:ROLES | Permission qo'shish |
| POST | `/api/users/permission/delete` | WRITE:ROLES | Permission o'chirish |

### To'lovlar

| Method | URL | Ruxsat | Izoh |
|--------|-----|--------|------|
| GET | `/api/payments/all` | READ:PAYMENTS | Mock to'lov ma'lumotlari |

### Hisobotlar

| Method | URL | Ruxsat | Izoh |
|--------|-----|--------|------|
| GET | `/api/reports/all` | READ:REPORTS | Mock hisobot ma'lumotlari |

## Rollar

| Rol | Nimaga ruxsat berilgan |
|-----|------------------------|
| ADMIN | Hamma narsaga to'liq ruxsat |
| USER | Foydalanuvchilarni, to'lovlarni va hisobotlarni ko'rish |
| MODERATOR | Foydalanuvchilarni ko'rish va tahrirlash, rollarni ko'rish |
| PAYMENT | To'lovlar bo'limi ustidan to'liq boshqaruv |
| REPORTS | Hisobotlar bo'limi ustidan to'liq boshqaruv |

## Baza tuzilishi

Loyihada 6 ta jadval mavjud:

- **users** — foydalanuvchilar (ism, familiya, email, parol)
- **roles** — rollar (nomi, tavsifi)
- **permissions** — ruxsatlar (action + resource kombinatsiyasi)
- **user_roles** — foydalanuvchi qaysi rollarga ega (many-to-many)
- **role_permissions** — rolga qaysi ruxsatlar biriktirilgan (many-to-many)
- **user_permissions** — foydalanuvchiga to'g'ridan-to'g'ri berilgan ruxsatlar (many-to-many)

## Xatolik formati

Xatoliklar o'zbek va ingliz tillarida qaytariladi:

```json
{
  "success": false,
  "message": {
    "uz": "Foydalanuvchi topilmadi",
    "eng": "User not found"
  }
}
```

## Mavjud skriptlar

- `npm run dev` — development rejimda ishga tushirish
- `npm run dev:watch` — hot reload bilan ishlash
- `npm run build` — production build
- `npm start` — production rejimda ishga tushirish
- `npm run seed` — bazaga boshlang'ich ma'lumotlar kiritish
- `npm run lint` — kod sifatini tekshirish
- `npm run format` — kodni formatlash
- `npm test` — testlarni ishga tushirish
- `npm run type-check` — TypeScript tekshiruvi
