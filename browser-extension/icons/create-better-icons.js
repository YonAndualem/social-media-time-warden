// Create better-looking PNG icons with canvas
const fs = require('fs');

// Create an SVG that we can convert to PNG
function createIconSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient circle -->
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bg)" stroke="#312e81" stroke-width="2"/>
  
  <!-- Clock face -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" fill="#ffffff" opacity="0.9"/>
  
  <!-- Clock hands -->
  <line x1="${size/2}" y1="${size/2}" x2="${size/2}" y2="${size/4}" stroke="#1f2937" stroke-width="${Math.max(2, size/32)}" stroke-linecap="round"/>
  <line x1="${size/2}" y1="${size/2}" x2="${size/2 + size/4}" y2="${size/2}" stroke="#1f2937" stroke-width="${Math.max(1, size/48)}" stroke-linecap="round"/>
  
  <!-- Center dot -->
  <circle cx="${size/2}" cy="${size/2}" r="${Math.max(2, size/32)}" fill="#1f2937"/>
  
  <!-- Hour markers -->
  <circle cx="${size/2}" cy="${size/8}" r="${Math.max(1, size/64)}" fill="#6b7280"/>
  <circle cx="${size/2}" cy="${size - size/8}" r="${Math.max(1, size/64)}" fill="#6b7280"/>
  <circle cx="${size/8}" cy="${size/2}" r="${Math.max(1, size/64)}" fill="#6b7280"/>
  <circle cx="${size - size/8}" cy="${size/2}" r="${Math.max(1, size/64)}" fill="#6b7280"/>
  
  <!-- Shield/warden symbol -->
  <path d="M${size/2} ${size - size/4} L${size/2 - size/8} ${size - size/8} L${size/2} ${size - size/16} L${size/2 + size/8} ${size - size/8} Z" fill="#10b981" stroke="#059669" stroke-width="1"/>
</svg>`;
}

// Create SVG files for different sizes
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const svgContent = createIconSVG(size);
  fs.writeFileSync(`icon${size}.svg`, svgContent);
  console.log(`Created icon${size}.svg`);
});

console.log('SVG icon files created! You can convert these to PNG using online tools or ImageMagick.');
