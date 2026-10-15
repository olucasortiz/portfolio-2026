import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFeedqrQr } from '../lib/feedqr-qr.ts';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { FEEDQR_APP_URL, getFeedqrSurveyUrl } from '../lib/feedqr-demo.ts';
import { feedqrCaseCopy, feedqrPortfolioCopy, feedqrChapters } from '../lib/feedqr-case-content.ts';
import { copy, projects } from '../lib/content.ts';

// Synthetic validation fixture only. Never configured, displayed or requested.
const fixture = 'https://qrcode-avaliacao.pages.dev/p/unit-test-only?origem=00000000-0000-4000-8000-000000000000';

test('homepage and archive describe FeedQR as publicly accessible while retaining verification limits', () => {
  assert.equal(projects.feedqr.status, 'public');
  assert.equal(copy.pt.publicApplication, feedqrCaseCopy.pt.statusTitle);
  assert.equal(copy.en.publicApplication, feedqrCaseCopy.en.statusTitle);
  for (const locale of ['pt', 'en']) {
    assert.doesNotMatch(projects.feedqr.summary[locale], /em desenvolvimento|work in progress|in development/i);
  }
  assert.ok(projects.feedqr.tech.includes('MongoDB'));
  assert.match(projects.feedqr.detail.en, /still require verification/);
});

test('the confirmed app link is independent of the survey configuration', () => {
  assert.equal(FEEDQR_APP_URL, 'https://qrcode-avaliacao.pages.dev/app');
  assert.equal(getFeedqrSurveyUrl({}), null);
  assert.equal(getFeedqrSurveyUrl({ url: fixture, verified: '0' }), null);
});

test('NEXT_PUBLIC configuration takes precedence over the legacy survey variable', () => {
  const names = ['NEXT_PUBLIC_FEEDQR_SURVEY_URL', 'FEEDQR_PUBLIC_SURVEY_URL', 'FEEDQR_SURVEY_VERIFIED'];
  const previous = names.map(name => process.env[name]);
  try {
    process.env.NEXT_PUBLIC_FEEDQR_SURVEY_URL = fixture;
    process.env.FEEDQR_PUBLIC_SURVEY_URL = 'https://invalid.example.invalid/p/legacy';
    process.env.FEEDQR_SURVEY_VERIFIED = '1';
    assert.equal(getFeedqrSurveyUrl(), fixture);
    process.env.NEXT_PUBLIC_FEEDQR_SURVEY_URL = 'https://invalid.example.invalid/p/test';
    process.env.FEEDQR_PUBLIC_SURVEY_URL = fixture;
    assert.equal(getFeedqrSurveyUrl(), null, 'Invalid preferred configuration must not silently fall back.');
    delete process.env.NEXT_PUBLIC_FEEDQR_SURVEY_URL;
    assert.equal(getFeedqrSurveyUrl(), fixture);
  } finally {
    names.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  }
});

test('only verified public surveys on the exact production host are enabled', () => {
  assert.equal(getFeedqrSurveyUrl({ url: fixture, verified: '1' }), fixture);
  assert.equal(getFeedqrSurveyUrl({ url: 'https://qrcode-avaliacao.pages.dev/p/unit-test-only', verified: '1' }),
    'https://qrcode-avaliacao.pages.dev/p/unit-test-only');
  for (const url of [
    FEEDQR_APP_URL, 'http://qrcode-avaliacao.pages.dev/p/test',
    'https://qrcode-avaliacao.pages.dev.evil.invalid/p/test', 'https://evil.invalid/p/test',
    'https://evil.invalid@qrcode-avaliacao.pages.dev/p/test', 'https://qrcode-avaliacao.pages.dev:444/p/test',
    'https://localhost/p/test', 'https://127.0.0.1/p/test', 'javascript:alert(1)',
    'https://qrcode-avaliacao.pages.dev/p/', 'https://qrcode-avaliacao.pages.dev/p/test/edit',
    'https://qrcode-avaliacao.pages.dev/p/%2e%2e/app', 'https://qrcode-avaliacao.pages.dev/p/test#app',
    'https://qrcode-avaliacao.pages.dev/p/test?next=https://evil.invalid',
    'https://qrcode-avaliacao.pages.dev/p/test?origem=short',
    `${fixture}&origem=00000000-0000-4000-8000-000000000001`,
    `https://qrcode-avaliacao.pages.dev/p/${'a'.repeat(201)}`,
  ]) assert.equal(getFeedqrSurveyUrl({ url, verified: '1' }), null, `Unsafe URL accepted: ${url}`);
});

test('the locally generated QR decodes to the complete URL, preserving origem', async () => {
  const data = await createFeedqrQr(fixture);
  const png = PNG.sync.read(Buffer.from(data.split(',')[1], 'base64'));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  assert.equal(decoded?.data, fixture);
  assert.equal(png.width, 640);
});

test('localized copy stays aligned and the four chapters remain intact', () => {
  assert.deepEqual(Object.keys(feedqrCaseCopy.pt), Object.keys(feedqrCaseCopy.en));
  assert.deepEqual(Object.keys(feedqrPortfolioCopy.pt), Object.keys(feedqrPortfolioCopy.en));
  assert.deepEqual(feedqrChapters, ['overview', 'gallery', 'architecture', 'resources']);
  assert.equal(feedqrCaseCopy.pt.app, 'Explorar sistema');
  assert.equal(feedqrCaseCopy.en.app, 'Explore the app');
  assert.equal(feedqrPortfolioCopy.pt.action, 'Avaliar portfólio');
  assert.equal(feedqrPortfolioCopy.en.action, 'Rate this portfolio');
});
