import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed verilerini oluşturuyor...');

  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elmalimarket.com' },
    update: {},
    create: {
      email: 'admin@elmalimarket.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '05551234567',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin kullanıcısı oluşturuldu:', admin.email);

  // Test müşterisi oluştur
  const customerPassword = await bcrypt.hash('customer123', 10);
  
  const customer = await prisma.user.upsert({
    where: { email: 'musteri@example.com' },
    update: {},
    create: {
      email: 'musteri@example.com',
      password: customerPassword,
      firstName: 'Test',
      lastName: 'Müşteri',
      phone: '05559876543',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Test müşterisi oluşturuldu:', customer.email);

  // Kategoriler oluştur
  const categories = [
    {
      name: 'Meyve & Sebze',
      description: 'Taze meyve ve sebzeler',
    },
    {
      name: 'Et & Tavuk',
      description: 'Taze et ve tavuk ürünleri',
    },
    {
      name: 'Süt Ürünleri',
      description: 'Süt, peynir, yoğurt ve diğer süt ürünleri',
    },
    {
      name: 'Fırın & Pastane',
      description: 'Ekmek, pasta ve fırın ürünleri',
    },
    {
      name: 'Temel Gıda',
      description: 'Pirinç, makarna, bulgur ve temel gıda maddeleri',
    },
    {
      name: 'İçecekler',
      description: 'Su, meyve suyu, gazlı içecekler',
    },
    {
      name: 'Temizlik',
      description: 'Ev temizlik ürünleri',
    },
    {
      name: 'Kişisel Bakım',
      description: 'Şampuan, sabun ve kişisel bakım ürünleri',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  console.log('✅ Kategoriler oluşturuldu:', createdCategories.length);

  // Ürünler oluştur
  const products = [
    // Meyve & Sebze
    {
      name: 'Elma (1 kg)',
      description: 'Taze ve lezzetli kırmızı elma. Vitamin açısından zengin.',
      price: 15.99,
      stock: 100,
      categoryId: createdCategories[0].id,
      images: JSON.stringify(['/images/products/elma.jpg']),
    },
    {
      name: 'Domates (1 kg)',
      description: 'Taze sera domatesi. Salata ve yemeklik için ideal.',
      price: 12.50,
      stock: 80,
      categoryId: createdCategories[0].id,
      images: JSON.stringify(['/images/products/domates.jpg']),
    },
    {
      name: 'Muz (1 kg)',
      description: 'Taze ve olgun muzlar. Potasyum açısından zengin.',
      price: 18.75,
      stock: 60,
      categoryId: createdCategories[0].id,
      images: JSON.stringify(['/images/products/muz.jpg']),
    },
    
    // Et & Tavuk
    {
      name: 'Tavuk Göğsü (1 kg)',
      description: 'Taze tavuk göğsü. Protein açısından zengin.',
      price: 45.99,
      stock: 25,
      categoryId: createdCategories[1].id,
      images: JSON.stringify(['/images/products/tavuk-gogsu.jpg']),
    },
    {
      name: 'Dana Kıyma (500g)',
      description: 'Taze dana kıyması. Günlük hazırlanır.',
      price: 89.99,
      stock: 15,
      categoryId: createdCategories[1].id,
      images: JSON.stringify(['/images/products/dana-kiyma.jpg']),
    },
    
    // Süt Ürünleri
    {
      name: 'Süt (1 Litre)',
      description: 'Tam yağlı taze süt. Günlük teslim.',
      price: 8.50,
      stock: 50,
      categoryId: createdCategories[2].id,
      images: JSON.stringify(['/images/products/sut.jpg']),
    },
    {
      name: 'Beyaz Peynir (500g)',
      description: 'Taze beyaz peynir. Kahvaltılık.',
      price: 35.99,
      stock: 30,
      categoryId: createdCategories[2].id,
      images: JSON.stringify(['/images/products/beyaz-peynir.jpg']),
    },
    {
      name: 'Yoğurt (500g)',
      description: 'Katkısız doğal yoğurt. Probiyotik içerir.',
      price: 12.99,
      stock: 40,
      categoryId: createdCategories[2].id,
      images: JSON.stringify(['/images/products/yogurt.jpg']),
    },
    
    // Fırın & Pastane
    {
      name: 'Ekmek',
      description: 'Taze günlük ekmek. Sıcak fırından.',
      price: 4.50,
      stock: 100,
      categoryId: createdCategories[3].id,
      images: JSON.stringify(['/images/products/ekmek.jpg']),
    },
    {
      name: 'Simit (6 Adet)',
      description: 'Taze simit. Kahvaltı için ideal.',
      price: 15.00,
      stock: 50,
      categoryId: createdCategories[3].id,
      images: JSON.stringify(['/images/products/simit.jpg']),
    },
    
    // Temel Gıda
    {
      name: 'Pirinç (1 kg)',
      description: 'Kaliteli baldo pirinç. Pilav için ideal.',
      price: 22.99,
      stock: 75,
      categoryId: createdCategories[4].id,
      images: JSON.stringify(['/images/products/pirinc.jpg']),
    },
    {
      name: 'Makarna (500g)',
      description: 'Durum buğdayından makarna. Spagetti.',
      price: 8.99,
      stock: 100,
      categoryId: createdCategories[4].id,
      images: JSON.stringify(['/images/products/makarna.jpg']),
    },
    
    // İçecekler
    {
      name: 'Su (1.5 Litre)',
      description: 'Doğal kaynak suyu. 6\'lı paket.',
      price: 12.99,
      stock: 200,
      categoryId: createdCategories[5].id,
      images: JSON.stringify(['/images/products/su.jpg']),
    },
    {
      name: 'Portakal Suyu (1 Litre)',
      description: 'Taze sıkılmış portakal suyu. Vitamin C açısından zengin.',
      price: 18.50,
      stock: 35,
      categoryId: createdCategories[5].id,
      images: JSON.stringify(['/images/products/portakal-suyu.jpg']),
    },
    
    // Temizlik
    {
      name: 'Bulaşık Deterjanı',
      description: 'Güçlü temizlik etkisi. Limon kokulu.',
      price: 25.99,
      stock: 40,
      categoryId: createdCategories[6].id,
      images: JSON.stringify(['/images/products/bulasik-deterjani.jpg']),
    },
    
    // Kişisel Bakım
    {
      name: 'Şampuan (400ml)',
      description: 'Tüm saç tipleri için şampuan. Doğal içerikli.',
      price: 32.99,
      stock: 25,
      categoryId: createdCategories[7].id,
      images: JSON.stringify(['/images/products/sampuan.jpg']),
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
    createdProducts.push(created);
  }

  console.log('✅ Ürünler oluşturuldu:', createdProducts.length);

  // Test adresi oluştur
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      title: 'Ev',
      firstName: 'Test',
      lastName: 'Müşteri',
      phone: '05559876543',
      address: 'Test Mahallesi, Test Sokak No:1',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      isDefault: true,
    },
  });

  console.log('✅ Test adresi oluşturuldu');

  console.log('🎉 Seed işlemi tamamlandı!');
  console.log('');
  console.log('📧 Admin Giriş Bilgileri:');
  console.log('   Email: admin@elmalimarket.com');
  console.log('   Şifre: admin123');
  console.log('');
  console.log('📧 Test Müşteri Giriş Bilgileri:');
  console.log('   Email: musteri@example.com');
  console.log('   Şifre: customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });