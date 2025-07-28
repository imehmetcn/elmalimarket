const freshProducts = [
  {
    id: 1,
    name: 'Taze Lahana',
    price: '8,90',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=200&h=200&fit=crop',
    badge: 'Taze'
  },
  {
    id: 2,
    name: 'Taze Salatalık',
    price: '12,90',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=200&h=200&fit=crop',
    badge: 'Taze'
  },
  {
    id: 3,
    name: 'Taze Üzüm',
    price: '24,90',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop',
    badge: 'Taze'
  },
  {
    id: 4,
    name: 'Taze Domates',
    price: '16,50',
    image: 'https://images.unsplash.com/photo-1546470427-e5ac2d7e2e4e?w=200&h=200&fit=crop',
    badge: 'Taze'
  }
];

export default function FreshProducts() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Taze Ürünler</h2>
        <button className="text-green-600 text-sm hover:underline">Tümünü Gör</button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {freshProducts.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md">
            <div className="relative mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-24 object-cover rounded"
              />
              <span className="absolute top-1 left-1 bg-green-500 text-white px-1 py-0.5 text-xs rounded">
                {product.badge}
              </span>
            </div>
            <h3 className="text-xs font-medium text-gray-800 mb-1">{product.name}</h3>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-bold text-green-600">{product.price} ₺</span>
              <button className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 w-full">
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}