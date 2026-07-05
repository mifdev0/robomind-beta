/**
 * Geocoding alamat psikolog menggunakan Nominatim (OpenStreetMap) — GRATIS.
 *
 * Usage:
 *   node scripts/geocode-psikolog.js                          # Baca dari psikolog.json hasil scraper
 *   node scripts/geocode-psikolog.js --input data.json        # Input kustom
 *   node scripts/geocode-psikolog.js --output data-geo.json   # Output kustom
 *
 * Batasan Nominatim: 1 request/detik (wajib delay). Untuk produksi > jumlah besar,
 * ganti ke Google Geocoding API (berbayar tapi lebih cepat & akurat).
 */

const DELAY_MS = 1100;
const USER_AGENT = 'RoboMindGeocoder/1.0 (educational platform; contact: admin@robomind.id)';

const args = process.argv.slice(2);
const inputFile = args.includes('--input') ? args[args.indexOf('--input') + 1] : 'data/psikolog.json';
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : 'data/psikolog-geocoded.json';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

async function main() {
  const fs = await import('fs');

  console.log('Geocoding Alamat Psikolog');
  console.log('========================');
  console.log(`Input: ${inputFile}`);
  console.log(`Output: ${outputFile}`);

  if (!fs.existsSync(inputFile)) {
    console.error(`File ${inputFile} tidak ditemukan. Jalankan scrape-psikolog.js dulu.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputFile, 'utf-8');
  let data = JSON.parse(raw);
  if (!Array.isArray(data)) data = [data];

  const total = data.length;
  const toGeocode = data.filter(d => !d.latitude || !d.longitude);
  console.log(`Total: ${total} data, ${toGeocode.length} perlu geocoding`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < toGeocode.length; i++) {
    const entry = toGeocode[i];
    const address = [entry.alamat_lengkap, entry.kota, entry.provinsi]
      .filter(Boolean)
      .join(', ');

    if (!address) {
      console.log(`  [${i + 1}/${toGeocode.length}] ${entry.nama} — alamat kosong, skip`);
      failed++;
      continue;
    }

    await delay(DELAY_MS);

    try {
      const result = await geocode(address);
      if (result) {
        entry.latitude = result.lat;
        entry.longitude = result.lng;
        console.log(`  [${i + 1}/${toGeocode.length}] ${entry.nama} → (${result.lat}, ${result.lng}) ✓`);
        success++;
      } else {
        console.log(`  [${i + 1}/${toGeocode.length}] ${entry.nama} — koordinat tidak ditemukan ✗`);
        failed++;
      }
    } catch (err) {
      console.error(`  [${i + 1}/${toGeocode.length}] ${entry.nama} — error: ${err.message} ✗`);
      failed++;
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`\nSelesai! ${success} berhasil, ${failed} gagal. Tersimpan ke ${outputFile}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
