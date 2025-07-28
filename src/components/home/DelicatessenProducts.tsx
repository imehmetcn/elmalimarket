const delicatessenProducts = [
  {
    id: 1,
    name: 'Kaşar Peyniri',
    price: '89,90',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop',
    weight: '500g'
  },
  {
    id: 2,
    name: 'Beyaz Peynir',
    price: '65,90',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
    weight: '500g'
  },
  {
    id: 3,
    name: 'Sucuklu Tost',
    price: '25,90',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
    weight: '200g'
  },
  {
    id: 4,
    name: 'Dana Salam',
    price: '45,90',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
    weight: '250g'
  }
];

export default function DelicatessenProducts() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Şarküteri Ürünleri</h2>
        <button className="text-green-600 text-sm hover:underline">Tümünü Gör</button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {delicatessenProducts.map((product) => (
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