export default function DailyDeals() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">HALK GÜNLERİ</h2>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-red-600 text-white text-center py-2 rounded font-bold text-sm">
          PAZARTESI
        </div>
        <div className="bg-green-600 text-white text-center py-2 rounded font-bold text-sm">
          PERŞEMBE
        </div>
        <div className="bg-blue-600 text-white text-center py-2 rounded font-bold text-sm">
          CUMARTESI
        </div>
        <div className="bg-purple-600 text-white text-center py-2 rounded font-bold text-sm">
          PAZAR
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-orange-500 text-white text-center py-2 rounded font-bold text-sm">
          MEYVE SEBZE
        </div>
        <div className="bg-teal-600 text-white text-center py-2 rounded font-bold text-sm">
          ET BALIK
        </div>
        <div className="bg-indigo-600 text-white text-center py-2 rounded font-bold text-sm">
          GIDA
        </div>
        <div className="bg-pink-600 text-white text-center py-2 rounded font-bold text-sm">
          TEMIZLIK
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <span className="text-lg">📱</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">UYGULAMA</h3>
          <p className="text-xs text-gray-600">Mobil uygulama</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <span className="text-lg">💳</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">KART AVANTAJI</h3>
          <p className="text-xs text-gray-600">Özel indirimler</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <span className="text-lg">🎯</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">KAMPANYA</h3>
          <p className="text-xs text-gray-600">Güncel kampanyalar</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <span className="text-lg">🚚</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">HIZLI TESLİMAT</h3>
          <p className="text-xs text-gray-600">Aynı gün teslimat</p>
        </div>
      </div>
    </div>
  );
}