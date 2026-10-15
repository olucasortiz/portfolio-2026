export const FEEDQR_APP_URL = 'https://qrcode-avaliacao.pages.dev/app';
export const FEEDQR_PUBLIC_HOST = 'qrcode-avaliacao.pages.dev';

/** Enable only an allowed public survey explicitly confirmed by its owner. */
export function getFeedqrSurveyUrl(config: { url?: string; verified?: string } = {
  url: process.env.NEXT_PUBLIC_FEEDQR_SURVEY_URL ?? process.env.FEEDQR_PUBLIC_SURVEY_URL,
  verified: process.env.FEEDQR_SURVEY_VERIFIED,
}): string | null {
  if (config.verified !== '1' || !config.url) return null;
  try {
    const url = new URL(config.url);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.port) return null;
    if (host !== FEEDQR_PUBLIC_HOST) return null;
    const match = /^\/p\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(url.pathname);
    if (!match || match[1].length > 200) return null;
    const query = [...url.searchParams];
    if (query.length > 1 || query.some(([key, value]) => key !== 'origem' || !/^[a-zA-Z0-9-]{16,128}$/.test(value))) return null;
    return url.href;
  } catch { return null; }
}

// Compatibility for the older generic case renderer; the system link is separate.
export const getFeedqrDemoUrl = getFeedqrSurveyUrl;
