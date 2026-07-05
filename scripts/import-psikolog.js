/**
 * Import data psikolog dari JSON hasil scraper ke Supabase.
 *
 * Usage:
 *   node scripts/import-psikolog.js
 *   node scripts/import-psikolog.js --input data/psikolog-geocoded.json
 *
 * Prerequisites:
 *   1. SQL migration sudah di-run di Supabase
 *   2. GEMINI_API_KEY atau GROQ_API_KEY di .env (optional, cuma untuk geocode)
 */

const SUPABASE_URL = 'https://rmbqodiutuyckuylhlgb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYnFvZGl1dHV5Y2t1eWxobGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTEzOTYsImV4cCI6MjA5Nzk2NzM5Nn0.V3o83hhZd5XBYcNoD-cKGTJGJ71mXVzady0XV35K0dU';

const args = process.argv.slice(2);
const inputFile = args.includes('--input') ? args[args.indexOf('--input') + 1] : 'data/psikolog-geocoded.json';

async function main() {
  const fs = await import('fs');
  const { createClient } = await import('@supabase/supabase-js');

  if (!fs.existsSync(inputFile)) {
    // Fallback ke hasil scrape tanpa geocode
    const fallback = inputFile.replace('geocoded', '');
    if (fs.existsSync(fallback)) {
      console.log(`File ${inputFile} tidak ditemukan. Fallback ke ${fallback}`);
      return importFallback(fallback);
    }
    console.error(`File ${inputFile} tidak ditemukan. Jalankan scrape-psikolog.js dulu.`);
    process.exit(1);
  }

  console.log(`Membaca data dari ${inputFile}...`);
  const raw = fs.readFileSync(inputFile, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    console.error('Format JSON harus array');
    process.exit(1);
  }

  console.log(`Total ${data.length} psikolog akan di-import`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const psikolog = {
      nama: entry.nama || entry.nama_lengkap || '',
      gelar: entry.gelar || '',
      no_str: entry.no_str || '',
      str_status: 'aktif',
      no_sippk: entry.no_sippk || '',
      sippk_status: 'aktif',
      nama_faskes: entry.nama_faskes || '',
      alamat_lengkap: entry.alamat_praktik || entry.alamat_lengkap || '',
      kota: entry.kota || '',
      provinsi: entry.provinsi || '',
      latitude: entry.latitude || null,
      longitude: entry.longitude || null,
      sumber_data: 'IPK Indonesia',
      url_detail: entry.url_detail || '',
      last_scraped_at: new Date().toISOString(),
      is_verified_manual: false
    };

    // Cek duplikat berdasarkan nama + kota
    const { data: existing } = await supabase
      .from('psikolog')
      .select('id')
      .eq('nama', psikolog.nama)
      .eq('kota', psikolog.kota)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update data yang sudah ada
      const { error } = await supabase
        .from('psikolog')
        .update(psikolog)
        .eq('id', existing[0].id);

      if (error) {
        console.error(`  [${i + 1}/${data.length}] ${psikolog.nama} — UPDATE GAGAL: ${error.message}`);
        failed++;
      } else {
        console.log(`  [${i + 1}/${data.length}] ${psikolog.nama} (${psikolog.kota}) — UPDATE ✓`);
        success++;
      }
    } else {
      // Insert baru
      const { error } = await supabase
        .from('psikolog')
        .insert(psikolog);

      if (error) {
        console.error(`  [${i + 1}/${data.length}] ${psikolog.nama} — INSERT GAGAL: ${error.message}`);
        failed++;
      } else {
        console.log(`  [${i + 1}/${data.length}] ${psikolog.nama} (${psikolog.kota}) — INSERT ✓`);
        success++;
      }
    }
  }

  console.log(`\nSelesai! ${success} berhasil, ${failed} gagal, ${skipped} skip`);
}

async function importFallback(file) {
  const fs = await import('fs');
  const { createClient } = await import('@supabase/supabase-js');

  const raw = fs.readFileSync(file, 'utf-8');
  let data = JSON.parse(raw);
  if (!Array.isArray(data)) data = [data];

  console.log(`Fallback: ${data.length} data tanpa koordinat`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const { error } = await supabase.from('psikolog').upsert(
      {
        nama: entry.nama || '',
        gelar: entry.gelar || '',
        no_str: entry.no_str || '',
        str_status: 'aktif',
        no_sippk: entry.no_sippk || '',
        sippk_status: 'aktif',
        nama_faskes: entry.nama_faskes || '',
        alamat_lengkap: entry.alamat_praktik || '',
        kota: entry.kota || '',
        provinsi: entry.provinsi || '',
        latitude: entry.latitude || null,
        longitude: entry.longitude || null,
        sumber_data: 'IPK Indonesia',
        url_detail: entry.url_detail || '',
        last_scraped_at: new Date().toISOString()
      },
      { onConflict: 'nama,kota', ignoreDuplicates: false }
    );

    if (error) {
      console.error(`  [${i + 1}/${data.length}] ${entry.nama} — GAGAL: ${error.message}`);
    } else {
      console.log(`  [${i + 1}/${data.length}] ${entry.nama} ✓`);
    }
  }

  console.log('Selesai!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
