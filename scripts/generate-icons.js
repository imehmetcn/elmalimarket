// Simple script to generate placeholder PWA icons
const fs = require('fs');
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create simple SVG icon template
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2D5A27"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#FF8C42"/>
  <text x="${size/2}" y="${size/2 + 8}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size/8}" font-weight="bold">EM</text>
</svg>
`;

// Generate icons
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated ${filename}`);
});

// Create additional icons
const additionalIcons = [
  { name: 'products-96x96.svg', content: createSVGIcon(96).replace('EM', 'P') },
  { name: 'cart-96x96.svg', content: createSVGIcon(96).replace('EM', 'C') },
  { name: 'orders-96x96.svg', content: createSVGIcon(96).replace('EM', 'O') },
  { name: 'badge-72x72.svg', content: createSVGIcon(72).replace('EM', 'B') },
];

additionalIcons.forEach(({ name, content }) => {
  const filepath = path.join(iconsDir, name);
  fs.writeFileSync(filepath, content.trim());
  console.log(`Generated ${name}`);
});

console.log('All PWA icons generated successfully!');