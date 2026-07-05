/**
 * Seed data psikolog Surakarta dari HIMPSI ke Supabase.
 * Jalanin setelah tabel dibuat.
 *
 * Usage: node scripts/seed-psikolog.js
 */

const SUPABASE_URL = 'https://rmbqodiutuyckuylhlgb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYnFvZGl1dHV5Y2t1eWxobGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTEzOTYsImV4cCI6MjA5Nzk2NzM5Nn0.V3o83hhZd5XBYcNoD-cKGTJGJ71mXVzady0XV35K0dU';

const DATA = [
  { nama: "RS PKU Muhammadiyah Surakarta", psikolog: "Moordiningsih", alamat: "Jl. Ronggowarsito No. 130, Surakarta", kota: "Surakarta", latitude: -7.566, longitude: 110.821 },
  { nama: "UPTD Pusat Layanan Disabilitas & Pendidikan Inklusif", psikolog: "Kurniasih Ayu Archentari", alamat: "Jl. Agung Timur No. 6A, Ngemplak Sutan, Mojosongo, Jebres, Surakarta", kota: "Surakarta", latitude: -7.549, longitude: 110.846 },
  { nama: "RS Dr. Oen Kandang Sapi Solo", psikolog: "Bernadeth Lestyobudi Novihartanti", alamat: "Jl. Brigjen Katamso 55, Surakarta", kota: "Surakarta", latitude: -7.558, longitude: 110.815 },
  { nama: "Cindo Consulting", psikolog: "Citra Tyas Laksmadita", alamat: "Jl. Blewah Raya 2 No. 11, Karangasem, Surakarta", kota: "Surakarta", latitude: -7.554, longitude: 110.825 },
  { nama: "Smart Solindo Consultama", psikolog: "Nindyo Prasetyo", alamat: "Jl. Bromo No.1, Sendangmulyo, Surakarta", kota: "Surakarta", latitude: -7.548, longitude: 110.828 },
  { nama: "Smart Solindo Consultama", psikolog: "Septi Nuzulia Rahmawati", alamat: "Jl. Bromo II, Sendang Mulyo, Kadipiro, Banjarsari, Surakarta", kota: "Surakarta", latitude: -7.546, longitude: 110.826 },
  { nama: "Smart Solindo Consultama", psikolog: "Dhanang Setyawan", alamat: "Kadipiro, Banjarsari, Surakarta", kota: "Surakarta", latitude: -7.545, longitude: 110.829 },
  { nama: "Kantor CG", psikolog: "Oratri Christy Gloria Sesa", alamat: "Jl. Kabangan 2/2A, Bumi Laweyan, Surakarta", kota: "Surakarta", latitude: -7.560, longitude: 110.808 },
  { nama: "Jaspi Solo", psikolog: "Dina Alfia Riza", alamat: "Jl. Latar Putih No.5, Sondakan, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.564, longitude: 110.805 },
  { nama: "Biro Psikologi JASPI", psikolog: "Dewi Nurhidayati", alamat: "Jl. Latar Putih No.5, Mutihan, Sondakan, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.564, longitude: 110.804 },
  { nama: "Migunani Consulting", psikolog: "Mohammad Zein Hidayat", alamat: "Jl. Hasanudin No.18, Purwosari, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.557, longitude: 110.802 },
  { nama: "RSJD Dr. Arif Zainudin", psikolog: "Sonia Natasha Marunduh", alamat: "Jl. Ki Hajar Dewantoro No.80, Jebres, Surakarta", kota: "Surakarta", latitude: -7.552, longitude: 110.842 },
  { nama: "Biro Psikologi Asa Psikologi", psikolog: "Berliana Widi Scarvanovi", alamat: "Jl. A. Yani No. 305, Kerten, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.559, longitude: 110.812 },
  { nama: "Layanan Konsultasi Psikologi Dyara", psikolog: "Liena Asma' 'Abiedatul Mufiedah", alamat: "Jl. Blewah Raya I No. 22, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.554, longitude: 110.824 },
  { nama: "Klinik Anak Cerdas Ceria", psikolog: "Rina Jayanti", alamat: "Jl. Letjen Suprapto No.89, Banyuanyar, Surakarta", kota: "Surakarta", latitude: -7.544, longitude: 110.833 },
];

async function main() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let success = 0;
  for (const d of DATA) {
    const { error } = await supabase.from('psikolog').upsert(d, { onConflict: 'nama,psikolog' });
    if (error) {
      console.error(`GAGAL: ${d.psikolog} — ${error.message}`);
    } else {
      console.log(`OK: ${d.psikolog}`);
      success++;
    }
  }
  console.log(`\nSelesai! ${success}/${DATA.length} berhasil`);
}

main().catch(console.error);
