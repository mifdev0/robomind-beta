import { useState } from 'react';
import { MapPin, ExternalLink, BadgeCheck, Award, Navigation, Search } from 'lucide-react';

const PSIKOLOG_DATA = [
  { nama: "RS PKU Muhammadiyah Surakarta", psikolog: "Moordiningsih", alamat: "RS PKU Muhammadiyah Surakarta, Jl. Ronggowarsito No. 130, Surakarta", telepon: "", jam: "", no_siap: "20050347", siap_status: "Aktif", no_sipp: "20050347-2023-02-3000", sipp_status: "Aktif", layanan: "Klinikal" },
  { nama: "UPTD Pusat Layanan Disabilitas & Pendidikan Inklusif", psikolog: "Kurniasih Ayu Archentari", alamat: "UPTD Pusat Layanan Disabilitas dan Pendidikan Inklusif, Jl. Agung Timur No. 6A, Ngemplak Sutan, Mojosongo, Jebres, Surakarta", telepon: "", jam: "", no_siap: "20180472", siap_status: "Aktif", no_sipp: "20180472-2025-03-0846", sipp_status: "Aktif", layanan: "Pendidikan, Anak, Keluarga, ABK, Klinikal" },
  { nama: "RS Dr. Oen Kandang Sapi Solo", psikolog: "Bernadeth Lestyobudi Novihartanti", alamat: "Rumah Sakit Dr. Oen Kandang Sapi Solo, Jl. Brigjen Katamso 55, Surakarta", telepon: "", jam: "", no_siap: "20161601", siap_status: "Aktif", no_sipp: "20161601-2023-01-0678", sipp_status: "Aktif", layanan: "Klinikal" },
  { nama: "Cindo Consulting", psikolog: "Citra Tyas Laksmadita", alamat: "Cindo Consulting, Jl. Blewah Raya 2 No. 11, Karangasem, Surakarta", telepon: "", jam: "", no_siap: "20181033", siap_status: "Aktif", no_sipp: "20181033-2023-02-1886", sipp_status: "Aktif", layanan: "Pendidikan, Anak, Pernikahan, Industri, Klinikal" },
  { nama: "Smart Solindo Consultama", psikolog: "Nindyo Prasetyo", alamat: "CV. Smart Solindo Consultama, Jl. Bromo No.1, Sendangmulyo, Surakarta", telepon: "", jam: "", no_siap: "20171557", siap_status: "Aktif", no_sipp: "20171557-2023-02-1134", sipp_status: "Aktif", layanan: "Industri & Organisasi" },
  { nama: "Smart Solindo Consultama", psikolog: "Septi Nuzulia Rahmawati", alamat: "CV. Smart Solindo Consultama, Jl. Bromo II, Sendang Mulyo, Kadipiro, Banjarsari, Surakarta", telepon: "", jam: "", no_siap: "20210751", siap_status: "Aktif", no_sipp: "20210751-2025-02-2065", sipp_status: "Aktif", layanan: "Industri & Organisasi" },
  { nama: "Smart Solindo Consultama", psikolog: "Dhanang Setyawan", alamat: "CV. Smart Solindo Consultama, Kadipiro, Banjarsari, Surakarta", telepon: "", jam: "", no_siap: "20190426", siap_status: "Aktif", no_sipp: "20190426-2023-02-3003", sipp_status: "Aktif", layanan: "Industri & Organisasi" },
  { nama: "Kantor CG", psikolog: "Oratri Christy Gloria Sesa", alamat: "Kantor CG (Belakang Batik Soga), Jl. Kabangan 2/2A, Bumi Laweyan, Surakarta", telepon: "", jam: "", no_siap: "20200190", siap_status: "Aktif", no_sipp: "20200190-2024-02-3601", sipp_status: "Aktif", layanan: "Pendidikan, Anak, Keluarga, Dewasa, Industri, Klinikal" },
  { nama: "Jaspi Solo", psikolog: "Dina Alfia Riza", alamat: "Jaspi Solo, Jl. Latar Putih No.5, Sondakan, Laweyan, Surakarta", telepon: "", jam: "", no_siap: "20190355", siap_status: "Aktif", no_sipp: "20190355-2025-02-1611", sipp_status: "Aktif", layanan: "Pendidikan" },
  { nama: "Biro Psikologi JASPI", psikolog: "Dewi Nurhidayati", alamat: "JASPI (Jasa Psikologi Indonesia), Jl. Latar Putih No.5, Mutihan, Sondakan, Laweyan, Surakarta", telepon: "", jam: "", no_siap: "20100408", siap_status: "Aktif", no_sipp: "20100408-2023-02-1974", sipp_status: "Aktif", layanan: "Pendidikan, Anak, Keluarga, ABK, Dewasa, Lansia, Pernikahan, Industri, Klinikal" },
  { nama: "Migunani Consulting", psikolog: "Mohammad Zein Hidayat", alamat: "Migunani Consulting, Jl. Hasanudin No.18, Purwosari, Laweyan, Surakarta", telepon: "", jam: "", no_siap: "20100886", siap_status: "Aktif", no_sipp: "20100886-2021-02-0998", sipp_status: "Aktif", layanan: "Pendidikan, Anak, Dewasa, Industri" },
  { nama: "RSJD Dr. Arif Zainudin", psikolog: "Sonia Natasha Marunduh", alamat: "RSJD Dr. Arif Zainudin, Jl. Ki Hajar Dewantoro No.80, Jebres, Surakarta", telepon: "", jam: "", no_siap: "20150783", siap_status: "Aktif", no_sipp: "20150783-2021-02-1496", sipp_status: "Tidak Aktif", layanan: "Dewasa, Klinikal" },
  { nama: "Biro Psikologi Asa Psikologi", psikolog: "Berliana Widi Scarvanovi", alamat: "Biro Psikologi Asa Psikologi, Jl. A. Yani No. 305, Kerten, Laweyan, Surakarta", telepon: "", jam: "", no_siap: "20181067", siap_status: "Aktif", no_sipp: "20181067-2025-03-1749", sipp_status: "Aktif", layanan: "Klinikal" },
  { nama: "Layanan Konsultasi Psikologi Dyara", psikolog: "Liena Asma' 'Abiedatul Mufiedah", alamat: "Layanan Konsultasi Psikologi Dyara, Jl. Blewah Raya I No. 22, Laweyan, Surakarta", telepon: "", jam: "", no_siap: "20220127", siap_status: "Aktif", no_sipp: "20220127-2023-01-2234", sipp_status: "Tidak Aktif", layanan: "Keluarga, Dewasa, Lansia, Pernikahan" },
  { nama: "Klinik Anak Cerdas Ceria", psikolog: "Rina Jayanti", alamat: "Klinik Anak Cerdas Ceria, Jl. Letjen Suprapto No.89, Banyuanyar, Surakarta", telepon: "", jam: "", no_siap: "20161248", siap_status: "Aktif", no_sipp: "20161248-2025-03-2074", sipp_status: "Aktif", layanan: "Anak, Keluarga, ABK, Dewasa, Pernikahan, Klinikal" },
];

const parsePsikologRekomendasi = (text) => {
  const match = text.match(/REKOMENDASI PSIKOLOG:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)$/m);
  if (!match) return null;
  const [_, psikolog, nama, alamat, telepon] = match;
  return { psikolog: psikolog.trim(), nama: nama.trim(), alamat: alamat.trim(), telepon: telepon.trim(), jam: '' };
};

const cleanPsikologText = (text) => {
  return text.replace(/\n?REKOMENDASI PSIKOLOG:.*$/m, '').trim();
};

const PsikologCard = ({ data }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.alamat)}`;

  return (
    <div className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 text-lg">
          🧑‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-fredoka font-bold text-sm text-gray-800">{data.psikolog}</p>
          {data.nama && <p className="text-xs font-medium text-gray-500 mt-0.5">{data.nama}</p>}

          {data.layanan && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.layanan.split(',').map((l, i) => (
                <span key={i} className="text-[10px] font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                  {l.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 space-y-1.5">
            {data.no_siap && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <BadgeCheck size={14} className="shrink-0 text-green-500" />
                <span>SIAP: <strong>{data.no_siap}</strong> {data.siap_status && <span className={`${data.siap_status === 'Aktif' ? 'text-green-600' : 'text-red-500'}`}>({data.siap_status})</span>}</span>
              </div>
            )}
            {data.no_sipp && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award size={14} className="shrink-0 text-amber-500" />
                <span>SIPP: <strong>{data.no_sipp}</strong> {data.sipp_status && <span className={`${data.sipp_status === 'Aktif' ? 'text-green-600' : 'text-red-500'}`}>({data.sipp_status})</span>}</span>
              </div>
            )}
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
              <span>{data.alamat}</span>
            </div>
          </div>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-2 rounded-xl transition-colors"
          >
            <ExternalLink size={14} />
            Buka di Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

const ALL_KOTA = ['Surakarta', 'Solo', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan', 'Makassar', 'Palembang', 'Denpasar', 'Malang', 'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Pekanbaru', 'Banjarmasin', 'Manado', 'Balikpapan', 'Padang', 'Lampung'];

const PsikologFinder = () => {
  const [mode, setMode] = useState(null);
  const [kota, setKota] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const SURAKARTA = ['surakarta', 'solo'];

  const checkLocation = () => {
    if (!navigator.geolocation) { setMode('manual'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latSolo = -7.556, lngSolo = 110.831;
        const R = 6371;
        const dLat = (latSolo - latitude) * Math.PI / 180;
        const dLng = (lngSolo - longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(latitude * Math.PI / 180) * Math.cos(latSolo * Math.PI / 180) * Math.sin(dLng/2)**2;
        const jarak = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        if (jarak <= 50) setMode('surakarta');
        else setMode('luar');
      },
      () => setMode('manual')
    );
  };

  const handleManualInput = (e) => {
    const val = e.target.value;
    setKota(val);
    setShowDropdown(val.length > 0);
    setFiltered(ALL_KOTA.filter(k => k.toLowerCase().includes(val.toLowerCase())));
  };

  const selectKota = (val) => {
    setKota(val);
    setShowDropdown(false);
    if (SURAKARTA.some(s => val.toLowerCase().includes(s))) setMode('surakarta');
    else setMode('luar');
  };

  if (!mode) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Cari Psikolog</p>
        <button onClick={checkLocation} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors">
          <Navigation size={16} /> Deteksi Lokasi Saya
        </button>
        <div className="flex items-center gap-2 my-3"><span className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">atau</span><span className="flex-1 h-px bg-gray-200" /></div>
        <button onClick={() => setMode('manual')} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition-colors">
          <Search size={16} /> Cari Manual
        </button>
        <p className="mt-3 text-[10px] text-gray-400">Data tersedia untuk Surakarta/Solo. Kota lain diarahkan ke HIMPSI.</p>
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Masukkan Nama Kota</p>
        <div className="relative">
          <input type="text" value={kota} onChange={handleManualInput} placeholder="Ketik nama kota..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" />
          {showDropdown && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
              {filtered.map(k => <button key={k} type="button" onClick={() => selectKota(k)} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50">{k}</button>)}
            </div>
          )}
        </div>
        <button onClick={() => setMode(null)} className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline">Kembali</button>
      </div>
    );
  }

  if (mode === 'luar') {
    return (
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-amber-800">Data belum tersedia</p>
        <p className="text-xs text-amber-700 mt-1">Database saat ini hanya untuk Surakarta/Solo. Silakan cari di direktori HIMPSI.</p>
        <a href="https://himpsi.or.id/cari-psikolog" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-3 py-2 rounded-xl">🔗 Cari di HIMPSI</a>
        <button onClick={() => setMode(null)} className="block mt-2 text-xs text-amber-600 underline">Kembali</button>
      </div>
    );
  }

  if (mode === 'surakarta') {
    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-fredoka font-bold text-sm text-gray-800">Psikolog di Surakarta ({PSIKOLOG_DATA.length})</p>
          <button onClick={() => setMode(null)} className="text-xs text-gray-400 underline">Tutup</button>
        </div>
        {PSIKOLOG_DATA.map((p, i) => <PsikologCard key={i} data={p} />)}
        <p className="text-[10px] text-gray-400">Data bersumber dari HIMPSI. Mohon konfirmasi ulang jadwal praktik.</p>
      </div>
    );
  }

  return null;
};

export default PsikologCard;
export { PSIKOLOG_DATA, PsikologFinder, parsePsikologRekomendasi, cleanPsikologText, ALL_KOTA }; // juga export ALL_KOTA