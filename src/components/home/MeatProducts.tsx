const meatProducts = [
  {
    id: 1,
    name: 'Dana Kuşbaşı',
    price: '189,90',
    image: 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?w=200&h=200&fit=crop',
    weight: '500g'
  },
  {
    id: 2,
    name: 'Tavuk Göğsü',
    price: '45,90',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop',
    weight: '1kg'
  },
  {
    id: 3,
    name: 'Kıyma',
    price: '159,90',
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200&h=200&fit=crop',
    weight: '500g'
  },
  {
    id: 4,
    name: 'Somon Fileto',
    price: '89,90',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=200&h=200&fit=crop',
    weight: '250g'
  }
];

export default function MeatProducts() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Et & Tavuk & Balık</h2>
        <button className="text-green-600 text-sm hover:underline">Tümünü Gör</button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {meatProducts.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md">
            <div className="relative mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-24 object-cover rounded"
              />
            </div>
            <h3 className="text-xs font-medium text-gray-800 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-1">{product.weight}</p>
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