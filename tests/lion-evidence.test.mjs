import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { lionAssets, lionChapters, lionCopy } from '../lib/lion-case-content.ts';
import { caseStudies } from '../lib/case-study-content.ts';

const publicDir = new URL('../public/projects/lion-fitness/', import.meta.url);
const file = (name) => fileURLToPath(new URL(`${name}.webp`, publicDir));

test('Lion live access uses the owner-supplied HTTPS destination and bilingual account context', () => {
  assert.equal(caseStudies['lion-fitness'].links.liveDemo, 'https://lionfitness-sa.duckdns.org/');
  assert.ok(caseStudies['lion-fitness'].links.sourceCode);
  assert.equal(lionCopy.pt.app, 'Acessar sistema');
  assert.equal(lionCopy.en.app, 'Open the application');
  assert.match(lionCopy.pt.account, /exige uma conta/);
  assert.match(lionCopy.en.account, /requires an account/);
});

test('both languages expose the same four acts and real evidence references', () => {
  assert.deepEqual(lionChapters, ['vision', 'operations', 'training', 'insights']);
  assert.deepEqual(Object.keys(lionCopy.pt), Object.keys(lionCopy.en));
  for (const locale of ['pt', 'en']) {
    assert.deepEqual(Object.keys(lionCopy[locale].chapters), lionChapters);
    for (const step of [...lionCopy[locale].steps, ...lionCopy[locale].trainingSteps]) {
      assert.ok(lionAssets[step.asset]);
      assert.ok(step.body.length > 30);
    }
    for (const asset of Object.values(lionAssets)) {
      assert.ok(asset.title[locale]); assert.ok(asset.alt[locale].length > 30);
    }
  }
});

test('the public evidence directory contains only reviewed raster exports', async () => {
  const names = await readdir(publicDir);
  // TASK 20 introduced the three decorative exports. TASK 20.2 adds the
  // transparent matte of the owner's authentic logo, without changing evidence.
  const showcase = {
    'gym-environment': [1440, 810],
    'lion-mascot': [1100, 863],
    'lion-mascot-sm': [600, 471],
    'lion-mascot-transparent': [1081, 844],
  };
  assert.deepEqual(names.sort(), [...Object.values(lionAssets).map(a => `${a.file}.webp`), 'sign-in.webp', ...Object.keys(showcase).map(n => `${n}.webp`)].sort());
  assert.equal(names.some(n => /\.(pdf|zip|png)$/i.test(n)), false);
  for (const asset of [...Object.values(lionAssets), ...Object.entries(showcase).map(([file, [width, height]]) => ({ file, width, height }))]) {
    const metadata = await sharp(file(asset.file)).metadata();
    assert.equal(metadata.width, asset.width); assert.equal(metadata.height, asset.height);
    assert.equal(metadata.exif, undefined); assert.equal(metadata.xmp, undefined);
  }
  const logo = await sharp(file('lion-mascot-transparent')).metadata();
  assert.equal(logo.hasAlpha, true, 'logo must not depend on a lightening blend');
});

test('the sanitized PIX capture has no decodable payment QR', async () => {
  const { data, info } = await sharp(file('pix-redacted')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height), null);
});

async function assertBlank(name, rect, color) {
  const bytes = await sharp(file(name)).extract(rect).removeAlpha().raw().toBuffer();
  for (let i = 0; i < bytes.length; i += 3) assert.deepEqual([...bytes.subarray(i, i + 3)], color, `${name}: redacted field must contain replacement pixels only`);
}

test('card identity fields and trainer tax-ID columns contain opaque replacement pixels', async () => {
  for (const top of [165, 230, 297, 360]) {
    await assertBlank('card-redacted', { left: 312, top, width: 88, height: 10 }, [255,255,255]);
  }
  for (const top of [280, 346, 411, 477]) {
    await assertBlank('trainer-members', { left: 430, top, width: 115, height: 22 }, [255,255,255]);
  }
});

test('both report previews remove all 20 rows of identification and individual dates', async () => {
  for (const [name, first, columns] of [
    ['report-members', 413, [69, 525, 750]],
    ['report-enrollment', 399, [69, 278, 399, 645]],
  ]) {
    for (let row = 0; row < 20; row++) for (const left of columns) {
      const top = Math.trunc(first + row * 37.6);
      await assertBlank(name, {left: left * 2, top: top * 2, width: 140, height: 20}, [247,249,251]);
    }
    await assertBlank(name, {left: 1260, top: 130, width: 430, height: 64}, [255,255,255]);
  }
});
