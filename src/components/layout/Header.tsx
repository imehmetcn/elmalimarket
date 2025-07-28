'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  return (
    <>
      {/* Header Top */}
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <p><b>Ücretsiz kargo</b> 150 TL ve üzeri alışverişlerde</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Top 2 */}
      <div className="header-top-2">
        <div className="container">
          <div className="row">
            <div className="col">
              <ul className="menu-items-row1">
                <li><Link href="/kargo-bilgi">Kargo Bilgileri</Link></li>
                <li><Link href="/iade-degisim">İade & Değişim</Link></li>
              </ul>
            </div>
            <div className="col-auto">
              <ul className="menu-items-row2">
                <li><Link href="/yardim">Yardım</Link></li>
                <li><Link href="/iletisim">İletişim</Link></li>
                <li><Link href="/magazalar">Mağazalar</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Header Middle */}
      <div className="header-middle">
        <div className="header-middle-inner">
          <div className="container">
            <div className="row">
              <div className="col-auto">
                <div className="header-middle-left">
                  <div className="logo">
                    <Link href="/">
                      <div style={{fontSize: '24px', fontWeight: 'bold', color: '#00A34E'}}>
                        SHOWMAR
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="search">
                  <form>
                    <input type="text" placeholder="Ürün, kategori veya marka ara..." />
                    <button type="submit"></button>
                  </form>
                </div>
              </div>

              <div className="col-auto">
                <div className="header-middle-right">
                  <div className="user-menu">
                    <div className="user-menu-wrap">
                      <i><div style={{fontSize: '20px'}}>👤</div></i>
                      <div className="user-inner">
                        <Link href="/giris">Giriş</Link>
                        <Link href="/uyelik">Üyelik</Link>
                      </div>
                    </div>
                  </div>

                  <div className="cart-menu">
                    <Link href="/sepet">
                      <i><div style={{fontSize: '20px'}}>🛒</div></i>
                      <div className="cart-inner">
                        <span>Sepetim</span>
                        <div data-selector="cart-total-price">0,00 ₺</div>
                      </div>
                      <span className="cart-amount" data-selector="cart-item-count" style={{ display: 'none' }}>0</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}