export default function HeroBanner() {
  return (
    <div className="slick-slider">
      <div className="slick-slide">
        <div style={{
          background: 'linear-gradient(135deg, #e91e63 0%, #f06292 50%, #e53935 100%)',
          height: '300px',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Left Content */}
          <div style={{
            position: 'absolute',
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            zIndex: 10
          }}>
            <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', lineHeight: '1'}}>
              SHOWMAR
            </h1>
            <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '5px', lineHeight: '1'}}>
              SANAL
            </h2>
            <p style={{fontSize: '24px', fontWeight: '500', lineHeight: '1'}}>
              MARKET
            </p>
          </div>
          
          {/* Right Shopping Cart */}
          <div style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '200px',
            height: '200px'
          }}>
            <div style={{
              fontSize: '120px',
              textAlign: 'center',
              lineHeight: '200px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              🛒
            </div>
            
            {/* Floating products */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>🍎</div>
            
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🥛</div>
            
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '10px',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🍞</div>
          </div>
          
          {/* Navigation arrows */}
          <button className="slick-prev" style={{
            position: 'absolute',
            bottom: '20px',
            right: '80px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer'
          }}>‹</button>
          
          <button className="slick-next" style={{
            position: 'absolute',
            bottom: '20px',
            right: '30px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer'
          }}>›</button>
        </div>
      </div>
    </div>
  );
}