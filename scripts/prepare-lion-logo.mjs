// Crops and optimizes the owner-supplied Lion Fitness logo without altering its pixels.
// Transparency keying was rejected: the logo's black outlines and dumbbell plates touch the black
// background, so any key would erase parts of the artwork. The page instead composites the mascot
// with mix-blend-mode: lighten over a dark scene, where the black background becomes the scene.
// Usage: node scripts/prepare-lion-logo.mjs "<source.png>"
import sharp from 'sharp';

const source = process.argv[2];
if (!source) throw new Error('Pass the source logo path.');
const out = (name) => new URL(`../public/projects/lion-fitness/${name}`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const lum = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
let minX = w, minY = h, maxX = 0, maxY = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (lum(y * w + x) > 52) {
  if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
}
const pad = 12;
const left = Math.max(0, minX - pad), top = Math.max(0, minY - pad);
const region = { left, top, width: Math.min(w, maxX + pad + 1) - left, height: Math.min(h, maxY + pad + 1) - top };
const base = sharp(data, { raw: { width: w, height: h, channels: 3 } }).extract(region);
await base.clone().resize({ width: 1100 }).webp({ quality: 90 }).toFile(out('lion-mascot.webp'));
await base.clone().resize({ width: 600 }).webp({ quality: 88 }).toFile(out('lion-mascot-sm.webp'));
console.log('crop', region, 'aspect', (region.width / region.height).toFixed(4));
