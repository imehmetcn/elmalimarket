export default function AppDownload() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="text-lg font-bold text-green-600 mr-3">SHOWMAR</div>
            <div className="text-sm text-gray-600">Mobil Uygulaması</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">App Store</h3>
              <div className="bg-black text-white px-3 py-1 rounded text-xs text-center">
                📱 İndir
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Google Play</h3>
              <div className="bg-green-600 text-white px-3 py-1 rounded text-xs text-center">
                📱 İndir
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 text-center">
          <div className="bg-gray-100 w-24 h-24 mx-auto rounded-lg flex items-center justify-center mb-2">
            <div className="text-2xl">📱</div>
          </div>
          <p className="text-xs text-gray-600">QR kodu okutarak uygulamayı indirebilirsiniz</p>
        </div>
        
        <div className="flex-1 text-right">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Avantajlar</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Özel indirimler</li>
              <li>• Hızlı alışveriş</li>
              <li>• Anlık bildirimler</li>
              <li>• Kolay ödeme</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}