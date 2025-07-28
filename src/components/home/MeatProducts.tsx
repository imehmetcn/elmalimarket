const meatProducts = [
  {
    id: 1,
    name: 'Dana Kuşbaşı',
    price: '189,90',
    image: 'https://via.placeholder.com/200x200/8D6E63/FFFFFF?text=🥩',
    weight: '500g'
  },
  {
    id: 2,
    name: 'Tavuk Göğsü',
    price: '45,90',
    image: 'https://via.placeholder.com/200x200/FFC107/FFFFFF?text=🍗',
    weight: '1kg'
  },
  {
    id: 3,
    name: 'Kıyma',
    price: '159,90',
    image: 'https://via.placeholder.com/200x200/795548/FFFFFF?text=🍖',
    weight: '500g'
  },
  {
    id: 4,
    name: 'Somon Fileto',
    price: '89,90',
    image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=🐟',
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