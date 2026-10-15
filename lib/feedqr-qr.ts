/** Encode the complete validated URL locally, including its collection origin. */
export async function createFeedqrQr(url: string): Promise<string> {
  const qr = await import('qrcode');
  return qr.toDataURL(url, {
    width: 640, margin: 4, errorCorrectionLevel: 'M',
    color: { dark: '#101216', light: '#F2F4F5' },
  });
}
