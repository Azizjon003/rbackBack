export interface ErrorMessage {
  uz: string;
  eng: string;
}

const Errors = {
  USER_NOT_FOUND: {
    uz: 'Foydalanuvchi topilmadi',
    eng: 'User not found',
  },
  INVALID_CREDENTIALS: {
    uz: "Email yoki parol noto'g'ri",
    eng: 'Invalid credentials',
  },
  PASSWORDS_DO_NOT_MATCH: {
    uz: 'Parollar mos kelmadi',
    eng: 'Passwords do not match',
  },
  UNAUTHORIZED: {
    uz: "Avtorizatsiyadan o'tilmagan",
    eng: 'Unauthorized',
  },
  TOKEN_NOT_PROVIDED: {
    uz: 'Token taqdim etilmagan',
    eng: 'Token not provided',
  },
  INVALID_OR_EXPIRED_TOKEN: {
    uz: "Token yaroqsiz yoki muddati o'tgan",
    eng: 'Invalid or expired token',
  },
  FORBIDDEN: {
    uz: "Ruxsat yo'q: huquqingiz yetarli emas",
    eng: 'Forbidden: insufficient permission',
  },
  USER_ALREADY_EXISTS: {
    uz: 'Bunday email bilan foydalanuvchi allaqachon mavjud',
    eng: 'User with this email already exists',
  },
  EMAIL_ALREADY_TAKEN: {
    uz: 'Bu email boshqa foydalanuvchiga tegishli',
    eng: 'Another user with this email already exists',
  },
  ROLES_NOT_FOUND: (ids: number[]) => ({
    uz: `Rollar topilmadi: ${ids.join(', ')}`,
    eng: `Roles not found: ${ids.join(', ')}`,
  }),
  PERMISSIONS_NOT_FOUND: (ids: number[]) => ({
    uz: `Ruxsatlar topilmadi: ${ids.join(', ')}`,
    eng: `Permissions not found: ${ids.join(', ')}`,
  }),
  ADMIN_ROLE_RESTRICTED: {
    uz: 'Admin rolini API orqali tayinlash taqiqlangan',
    eng: 'Assigning admin role via API is restricted',
  },
  ADMIN_ROLE_PROTECTED: {
    uz: 'Admin rolini API orqali olib tashlash taqiqlangan',
    eng: 'Removing admin role via API is restricted',
  },
  VALIDATION_ERROR: {
    uz: "Kiritilgan ma'lumotlarda xatolik topildi",
    eng: 'Validation error found in input data',
  },
  INVALID_DATE: (arg: string) => ({
    uz: `Noto'g'ri sana: ${arg}`,
    eng: `Invalid date: ${arg}`,
  }),
} as const;

export default Errors;
