'use client';

import Script from 'next/script';

export default function ScriptLoader() {
  return (
    <>
      <Script 
        src="https://code.jquery.com/jquery-3.6.0.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="/init-showmar.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="/showmar-theme-fixed.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Showmar theme loaded successfully');
        }}
        onError={(e) => {
          console.log('Showmar theme script error:', e);
        }}
      />
    </>
  );
}