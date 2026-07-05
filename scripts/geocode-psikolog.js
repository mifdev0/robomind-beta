/**
 * Geocode alamat psikolog di Supabase pake Nominatim (OpenStreetMap) — GRATIS.
 * Usage: node scripts/geocode-psikolog.js
 */
const SUPABASE_URL = 'https://rmbqodiutuyckuylhlgb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYnFvZGl1dHV5Y2t1eWxobGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTEzOTYsImV4cCI6MjA5Nzk2NzM5Nn0.V3o83hhZd5XBYcNoD-cKGTJGJ71mXVzady0XV35K0dU';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function geocode(address) {
  const tryFormats = [
    address,
    address.replace(/^[^,]+,\s*/, '').trim() + ', Surakarta',
    address.replace(/^[^,]+,\s*/, '').trim() + ', Solo',
    'Surakarta, Jawa Tengah'
  ];

  for (const fmt of tryFormats) {
    if (!fmt) continue;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fmt)}&limit=1&countrycodes=id`;
    const res = await fetch(url, { headers: { 'User-Agent': 'RoboMind/1.0' } });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

async function main() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: list, error } = await supabase.from('psikolog').select('id, nama, psikolog, alamat, latitude, longitude');
  if (error) { console.error(error.message); return; }

    const toGeocode = list.filter(d => !d.latitude || !d.longitude);
  console.log(`Total: ${list.length}, perlu geocode: ${toGeocode.length}`);

  for (let i = 0; i < toGeocode.length; i++) {
    const d = toGeocode[i];
    await delay(1100);

    // Coba geocode dengan format: "alamat, Surakarta"
    const jalan = d.alamat.replace(/^[^,]+,\s*/, '').trim(); // hapus nama tempat di depan
    const query = jalan ? `${jalan}, Surakarta` : `Surakarta`;
    const result = await geocode(query);
    if (result) {
      await supabase.from('psikolog').update({ latitude: result.lat, longitude: result.lng }).eq('id', d.id);
      console.log(`[${i + 1}/${toGeocode.length}] ${d.psikolog} → (${result.lat}, ${result.lng})`);
    } else {
      console.log(`[${i + 1}/${toGeocode.length}] ${d.psikolog} — GAGAL`);
    }
  }
  console.log('Selesai!');
}

main().catch(console.error);
