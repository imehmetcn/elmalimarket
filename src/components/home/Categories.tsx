import Link from 'next/link';

const categories = [
  {
    name: 'Meyve Sebze',
    href: '/meyve-sebze',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop'
  },
  {
    name: 'Et Tavuk Balık',
    href: '/et-tavuk-balik',
    image: 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?w=80&h=80&fit=crop'
  },
  {
    name: 'Süt Ürünleri',
    href: '/sut-urunleri',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop'
  },
  {
    name: 'Fırından Taze',
    href: '/firindan-taze',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop'
  },
  {
    name: 'Temel Gıda',
    href: '/temel-gida',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop'
  },
  {
    name: 'Atıştırmalık',
    href: '/atistirmalik',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=80&h=80&fit=crop'
  }
];

export default function Categories() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Popüler Kategoriler</h2>
      <div className="flex justify-center space-x-8">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-gray-200 group-hover:border-green-500 transition-colors">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-700 group-hover:text-green-600 max-w-16 leading-tight text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}