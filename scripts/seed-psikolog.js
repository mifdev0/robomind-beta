const SUPABASE_URL = 'https://rmbqodiutuyckuylhlgb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYnFvZGl1dHV5Y2t1eWxobGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTEzOTYsImV4cCI6MjA5Nzk2NzM5Nn0.V3o83hhZd5XBYcNoD-cKGTJGJ71mXVzady0XV35K0dU';

const DATA = [
  { nama: "RS PKU Muhammadiyah Surakarta", psikolog: "Moordiningsih", gelar: "", no_siap: "20050347", siap_status: "Aktif", siap_berlaku: "31-12-2026", no_sipp: "20050347-2023-02-3000", sipp_status: "Aktif", sipp_berlaku: "22 Nov 2028", layanan: "Klinikal", alamat: "Jl. Ronggowarsito No. 130, Surakarta", kota: "Surakarta", latitude: -7.566, longitude: 110.821 },
  { nama: "UPTD Pusat Layanan Disabilitas & Pendidikan Inklusif", psikolog: "Kurniasih Ayu Archentari", gelar: "", no_siap: "20180472", siap_status: "Aktif", siap_berlaku: "31-12-2026", no_sipp: "20180472-2025-03-0846", sipp_status: "Aktif", sipp_berlaku: "19 May 2030", layanan: "Pendidikan, Anak, Keluarga, ABK, Klinikal", alamat: "Jl. Agung Timur No. 6A, Ngemplak Sutan, Mojosongo, Jebres, Surakarta", kota: "Surakarta", latitude: -7.549, longitude: 110.846 },
  { nama: "RS Dr. Oen Kandang Sapi Solo", psikolog: "Bernadeth Lestyobudi Novihartanti", gelar: "", no_siap: "20161601", siap_status: "Aktif", siap_berlaku: "23-11-2026", no_sipp: "20161601-2023-01-0678", sipp_status: "Aktif", sipp_berlaku: "26 Aug 2026", layanan: "Klinikal", alamat: "Jl. Brigjen Katamso 55, Surakarta", kota: "Surakarta", latitude: -7.558, longitude: 110.815 },
  { nama: "Cindo Consulting", psikolog: "Citra Tyas Laksmadita", gelar: "", no_siap: "20181033", siap_status: "Aktif", siap_berlaku: "28-09-2026", no_sipp: "20181033-2023-02-1886", sipp_status: "Aktif", sipp_berlaku: "21 Aug 2028", layanan: "Pendidikan, Anak, Pernikahan, Industri, Klinikal", alamat: "Jl. Blewah Raya 2 No. 11, Karangasem, Surakarta", kota: "Surakarta", latitude: -7.554, longitude: 110.825 },
  { nama: "Smart Solindo Consultama", psikolog: "Nindyo Prasetyo", gelar: "", no_siap: "20171557", siap_status: "Aktif", siap_berlaku: "24-10-2026", no_sipp: "20171557-2023-02-1134", sipp_status: "Aktif", sipp_berlaku: "26 May 2028", layanan: "Industri & Organisasi", alamat: "Jl. Bromo No.1, Sendangmulyo, Surakarta", kota: "Surakarta", latitude: -7.548, longitude: 110.828 },
  { nama: "Smart Solindo Consultama", psikolog: "Septi Nuzulia Rahmawati", gelar: "", no_siap: "20210751", siap_status: "Aktif", siap_berlaku: "31-12-2026", no_sipp: "20210751-2025-02-2065", sipp_status: "Aktif", sipp_berlaku: "31 Oct 2030", layanan: "Industri & Organisasi", alamat: "Jl. Bromo II, Sendang Mulyo, Kadipiro, Banjarsari, Surakarta", kota: "Surakarta", latitude: -7.546, longitude: 110.826 },
  { nama: "Smart Solindo Consultama", psikolog: "Dhanang Setyawan", gelar: "", no_siap: "20190426", siap_status: "Aktif", siap_berlaku: "31-08-2026", no_sipp: "20190426-2023-02-3003", sipp_status: "Aktif", sipp_berlaku: "22 Nov 2028", layanan: "Industri & Organisasi", alamat: "Kadipiro, Banjarsari, Surakarta", kota: "Surakarta", latitude: -7.545, longitude: 110.829 },
  { nama: "Kantor CG", psikolog: "Oratri Christy Gloria Sesa", gelar: "", no_siap: "20200190", siap_status: "Aktif", siap_berlaku: "10-08-2026", no_sipp: "20200190-2024-02-3601", sipp_status: "Aktif", sipp_berlaku: "12 Mar 2029", layanan: "Pendidikan, Anak, Keluarga, Dewasa, Industri, Klinikal", alamat: "Jl. Kabangan 2/2A, Bumi Laweyan, Surakarta", kota: "Surakarta", latitude: -7.560, longitude: 110.808 },
  { nama: "Jaspi Solo", psikolog: "Dina Alfia Riza", gelar: "", no_siap: "20190355", siap_status: "Aktif", siap_berlaku: "06-12-2026", no_sipp: "20190355-2025-02-1611", sipp_status: "Aktif", sipp_berlaku: "13 Sep 2030", layanan: "Pendidikan", alamat: "Jl. Latar Putih No.5, Sondakan, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.564, longitude: 110.805 },
  { nama: "Biro Psikologi JASPI", psikolog: "Dewi Nurhidayati", gelar: "", no_siap: "20100408", siap_status: "Aktif", siap_berlaku: "06-06-2027", no_sipp: "20100408-2023-02-1974", sipp_status: "Aktif", sipp_berlaku: "29 Aug 2028", layanan: "Pendidikan, Anak, Keluarga, ABK, Dewasa, Lansia, Pernikahan, Industri, Klinikal", alamat: "Jl. Latar Putih No.5, Mutihan, Sondakan, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.564, longitude: 110.804 },
  { nama: "Migunani Consulting", psikolog: "Mohammad Zein Hidayat", gelar: "", no_siap: "20100886", siap_status: "Aktif", siap_berlaku: "31-12-2026", no_sipp: "20100886-2021-02-0998", sipp_status: "Aktif", sipp_berlaku: "15 Dec 2026", layanan: "Pendidikan, Anak, Dewasa, Industri", alamat: "Jl. Hasanudin No.18, Purwosari, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.557, longitude: 110.802 },
  { nama: "RSJD Dr. Arif Zainudin", psikolog: "Sonia Natasha Marunduh", gelar: "", no_siap: "20150783", siap_status: "Aktif", siap_berlaku: "31-12-2026", no_sipp: "20150783-2021-02-1496", sipp_status: "Tidak Aktif", sipp_berlaku: "30 Apr 2026", layanan: "Dewasa, Klinikal", alamat: "Jl. Ki Hajar Dewantoro No.80, Jebres, Surakarta", kota: "Surakarta", latitude: -7.552, longitude: 110.842 },
  { nama: "Biro Psikologi Asa Psikologi", psikolog: "Berliana Widi Scarvanovi", gelar: "", no_siap: "20181067", siap_status: "Aktif", siap_berlaku: "12-02-2027", no_sipp: "20181067-2025-03-1749", sipp_status: "Aktif", sipp_berlaku: "19 Sep 2030", layanan: "Klinikal", alamat: "Jl. A. Yani No. 305, Kerten, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.559, longitude: 110.812 },
  { nama: "Layanan Konsultasi Psikologi Dyara", psikolog: "Liena Asma' 'Abiedatul Mufiedah", gelar: "", no_siap: "20220127", siap_status: "Aktif", siap_berlaku: "03-08-2026", no_sipp: "20220127-2023-01-2234", sipp_status: "Tidak Aktif", sipp_berlaku: "15 Sep 2025", layanan: "Keluarga, Dewasa, Lansia, Pernikahan", alamat: "Jl. Blewah Raya I No. 22, Laweyan, Surakarta", kota: "Surakarta", latitude: -7.554, longitude: 110.824 },
  { nama: "Klinik Anak Cerdas Ceria", psikolog: "Rina Jayanti", gelar: "", no_siap: "20161248", siap_status: "Aktif", siap_berlaku: "15-01-2027", no_sipp: "20161248-2025-03-2074", sipp_status: "Aktif", sipp_berlaku: "03 Nov 2030", layanan: "Anak, Keluarga, ABK, Dewasa, Pernikahan, Klinikal", alamat: "Jl. Letjen Suprapto No.89, Banyuanyar, Surakarta", kota: "Surakarta", latitude: -7.544, longitude: 110.833 },
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
