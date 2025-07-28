
const featuredProducts = [
  {
    id: 1,
    name: 'Taze Salatalık',
    price: '12,90',
    originalPrice: '15,90',
    image: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=🥒',
    discount: '19%',
    badge: 'İndirim'
  },
  {
    id: 2,
    name: 'Organik Domates',
    price: '18,50',
    image: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=🍅',
    badge: 'Yeni'
  },
  {
    id: 3,
    name: 'Taze Marul',
    price: '8,90',
    image: 'https://via.placeholder.com/200x200/8BC34A/FFFFFF?text=🥬'
  },
  {
    id: 4,
    name: 'Taze Soğan',
    price: '6,50',
    image: 'https://via.placeholder.com/200x200/FFC107/FFFFFF?text=🧅'
  },
  {
    id: 5,
    name: 'Organik Havuç',
    price: '14,90',
    image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=🥕'
  }
];

export default function ProductGrid() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Öne Çıkan Ürünler</h2>
        <div className="flex space-x-1">
          <button className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium">Tümü</button>
          <button className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-300">İndirimli</button>
          <button className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-300">Yeni</button>
          <button className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-300">Popüler</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {featuredProducts.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="relative mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-28 object-cover rounded"
              />
              {product.badge && (
                <span className={`absolute top-1 left-1 px-1.5 py-0.5 text-xs rounded font-medium ${product.badge === 'İndirim' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                  {product.badge}
                </span>
              )}
              {product.discount && (
                <span className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 text-xs rounded font-medium">
                  -{product.discount}
                </span>
              )}
            </div>
            <h3 className="text-xs font-medium text-gray-800 mb-2 h-8 line-clamp-2">{product.name}</h3>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-green-600">{product.price} ₺</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">{product.originalPrice} ₺</span>
                )}
              </div>
              <button className="bg-green-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-green-700 w-full transition-colors">
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}