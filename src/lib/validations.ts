import { z } from 'zod';

// Kullanıcı validasyonları
export const userCreateSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir'
    ),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: z
    .string()
    .regex(/^(\+90|0)?[5][0-9]{9}$/, 'Geçerli bir telefon numarası giriniz')
    .optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(1, 'Şifre gereklidir'),
});

// Ürün validasyonları
export const productCreateSchema = z.object({
  name: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  price: z.number().positive('Fiyat pozitif bir sayı olmalıdır'),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'Stok negatif olamaz'),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir'),
  images: z.string().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

// Kategori validasyonları
export const categoryCreateSchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// Adres validasyonları
export const addressCreateSchema = z.object({
  title: z.string().min(2, 'Adres başlığı en az 2 karakter olmalıdır'),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: z
    .string()
    .regex(/^(\+90|0)?[5][0-9]{9}$/, 'Geçerli bir telefon numarası giriniz'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir adı en az 2 karakter olmalıdır'),
  district: z.string().min(2, 'İlçe adı en az 2 karakter olmalıdır'),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, 'Posta kodu 5 haneli olmalıdır'),
  isDefault: z.boolean().optional(),
});

// Sepet validasyonları
export const cartAddItemSchema = z.object({
  productId: z.string().min(1, 'Ürün ID gereklidir'),
  quantity: z.number().int().min(1, 'Miktar en az 1 olmalıdır').max(99, 'Miktar en fazla 99 olabilir'),
});

export const cartUpdateItemSchema = z.object({
  quantity: z.number().int().min(1, 'Miktar en az 1 olmalıdır').max(99, 'Miktar en fazla 99 olabilir'),
});

// Sipariş validasyonları
export const orderCreateSchema = z.object({
  shippingAddressId: z.string().min(1, 'Teslimat adresi gereklidir'),
  paymentMethod: z.string().min(1, 'Ödeme yöntemi gereklidir'),
  notes: z.string().optional(),
});

// Arama ve filtreleme validasyonları
export const productSearchSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Tip çıkarımları
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type AddressCreateInput = z.infer<typeof addressCreateSchema>;
export type CartAddItemInput = z.infer<typeof cartAddItemSchema>;
export type CartUpdateItemInput = z.infer<typeof cartUpdateItemSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type ProductSearchInput = z.infer<typeof productSearchSchema>;