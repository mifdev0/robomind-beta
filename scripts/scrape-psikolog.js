/**
 * Scraper Psikolog dari IPK Indonesia (https://data.ipkindonesia.or.id/layanan-psikologi-klinis/)
 *
 * Usage:
 *   node scripts/scrape-psikolog.js                    # Scrape semua kota
 *   node scripts/scrape-psikolog.js --kota jakarta     # Scrape kota tertentu
 *   node scripts/scrape-psikolog.js --output data.json # Output file kustom
 *
 * Hasil: file JSON + siap di-insert ke Supabase
 */

const BASE_URL = 'https://data.ipkindonesia.or.id';
const INDEX_URL = `${BASE_URL}/layanan-psikologi-klinis/`;

const DELAY_MS = 1500;
const USER_AGENT = 'RoboMindScraper/1.0 (educational platform; contact: admin@robomind.id)';

const args = process.argv.slice(2);
const targetCity = args.includes('--kota') ? args[args.indexOf('--kota') + 1] : null;
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : 'data/psikolog.json';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function extractCityLinks(html) {
  const links = new Map();
  // Index page: <a href=".../layanan-psikologi-klinis/medan/"> Medan</a> [Provinsi]
  const regex = /<a\s+href="([^"]*\/layanan-psikologi-klinis\/[a-z0-9-]+)\/?"[^>]*>\s*([^<]+?)\s*<\/a>\s*\[([^\]]+)\]/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let href = match[1].startsWith('http') ? match[1] : 'https://data.ipkindonesia.or.id' + (match[1].startsWith('/') ? '' : '/') + match[1];
    href = href.replace(/\/+$/, '');
    const name = match[2].trim();
    const provinsi = match[3].trim();
    if (name && name !== '[-na-]' && !links.has(name)) {
      links.set(name, { name, href, provinsi });
    }
  }
  return Array.from(links.values());
}

function extractPsikologLinks(html) {
  const links = [];
  // City page: <a href="https://data.ipkindonesia.or.id/psikolog-klinis/medan/nama--ID">Nama</a>
  const regex = /<a\s+href="([^"]*\/psikolog-klinis\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1].startsWith('http') ? match[1] : 'https://data.ipkindonesia.or.id' + match[1];
    const name = match[2].trim();
    if (!links.find(l => l.href === href)) {
      links.push({ name, href });
    }
  }
  return links;
}

function extractDetailData(html) {
  const data = {};

  const nameMatch = html.match(/<h1>\s*([^<]+?)(?:,\s*)?<\/h1>/i);
  if (nameMatch) data.nama_lengkap = nameMatch[1].trim();

  const strMatch = html.match(/STR[PK]*\s*[:\s]*([^\s<]+)/i);
  if (strMatch) data.no_str = strMatch[1].trim();

  const sippkMatch = html.match(/SIPPK[:\s]*([^\s<]+)/i);
  if (sippkMatch) {
    const raw = sippkMatch[1].trim();
    data.no_sippk = raw.replace(/\(ED\..*$/, '').trim();
    const edMatch = raw.match(/ED\.\s*(\S+)/i);
    if (edMatch) data.sippk_berlaku = edMatch[1].trim();
  }

  const praktikMatch = html.match(/PRAKTIK\s+MANDIRI[^<]*<\s*\/?\s*strong\s*>\s*-\s*([^<]+?)(?:\s*<a\s|$)/i);
  if (praktikMatch) data.alamat_praktik = praktikMatch[1].trim();

  const faskesBlocks = html.match(/<span\s+class=['"]item['"][^>]*>([\s\S]*?)<\/span>/gi);
  if (faskesBlocks) {
    const praktikBlocks = faskesBlocks.filter(b => !b.includes('NIAIPK') && !b.includes('STR') && !b.includes('SIPPK'));
    praktikBlocks.forEach(block => {
      const clean = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length >= 2) {
        if (!data.nama_faskes) data.nama_faskes = lines[0];
        if (!data.alamat_praktik) data.alamat_praktik = lines.slice(1).join(', ');
      }
    });
  }

  return data;
}

async function scrapeCity(city) {
  console.log(`\n=== ${city.name} ===`);
  console.log(`Mengambil daftar psikolog dari ${city.href}`);

  let listHtml;
  try {
    listHtml = await fetchHtml(city.href);
  } catch (err) {
    console.error(`  GAGAL mengambil daftar: ${err.message}`);
    return [];
  }

  const links = extractPsikologLinks(listHtml);
  console.log(`  Ditemukan ${links.length} psikolog`);

  const results = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    await delay(DELAY_MS);

    try {
      const detailHtml = await fetchHtml(link.href);
      const detail = extractDetailData(detailHtml);

      const entry = {
        nama: link.name,
        gelar: detail.gelar || '',
        no_str: detail.no_str || '',
        str_status: detail.status_str?.toLowerCase().includes('aktif') ? 'aktif' : 'tidak_aktif',
        str_berlaku_hingga: detail.str_berlaku_hingga || null,
        no_sippk: detail.no_sippk || '',
        sippk_status: detail.status_sippk?.toLowerCase().includes('aktif') ? 'aktif' : 'tidak_aktif',
        sippk_berlaku_hingga: detail.sippk_berlaku_hingga || null,
        nama_faskes: detail.nama_faskes || '',
        alamat_lengkap: detail.alamat_praktik || '',
        kota: city.name,
        provinsi: '',
        latitude: null,
        longitude: null,
        sumber_data: 'IPK Indonesia',
        url_detail: link.href,
        last_scraped_at: new Date().toISOString(),
        is_verified_manual: false
      };

      results.push(entry);
      console.log(`  [${i + 1}/${links.length}] ${link.name} ✓`);
    } catch (err) {
      console.error(`  [${i + 1}/${links.length}] ${link.name} GAGAL: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('Scraper Psikolog IPK Indonesia');
  console.log('==============================');
  console.log(`Sumber: ${INDEX_URL}`);
  console.log(`Output: ${outputFile}`);
  console.log(`User-Agent: ${USER_AGENT}`);

  // 1. Ambil daftar kota
  console.log('\nMengambil daftar kota...');
  let indexHtml;
  try {
    indexHtml = await fetchHtml(INDEX_URL);
  } catch (err) {
    console.error(`GAGAL mengambil index: ${err.message}`);
    process.exit(1);
  }

  let cities = extractCityLinks(indexHtml);
  console.log(`Ditemukan ${cities.length} kota`);

  if (targetCity) {
    const filtered = cities.filter(c =>
      c.name.toLowerCase().includes(targetCity.toLowerCase())
    );
    if (filtered.length === 0) {
      console.error(`Kota "${targetCity}" tidak ditemukan`);
      process.exit(1);
    }
    cities = filtered;
    console.log(`Filter: ${cities.length} kota sesuai "${targetCity}"`);
  }

  // 2. Scrape tiap kota
  const allData = [];
  for (let i = 0; i < cities.length; i++) {
    const results = await scrapeCity(cities[i]);
    allData.push(...results);
    console.log(`  Total: ${results.length} psikolog dari ${cities[i].name}`);
  }

  // 3. Simpan ke file
  const fs = await import('fs');
  const dir = outputFile.substring(0, outputFile.lastIndexOf('/'));
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
  console.log(`\nSelesai! ${allData.length} psikolog tersimpan ke ${outputFile}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
