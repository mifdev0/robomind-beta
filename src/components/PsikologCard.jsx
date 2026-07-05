import { useState } from 'react';
import { MapPin, Phone, ExternalLink, Navigation, Loader2, AlertCircle, RefreshCw, BadgeCheck, Award } from 'lucide-react';

const PSIKOLOG_DATA = [
  { nama: "RS PKU Muhammadiyah Surakarta", psikolog: "MOORDININGSIH", alamat: "Jl. Ronggowarsito No. 130, Surakarta", telepon: "", jam: "" },
  { nama: "UPTD Pusat Layanan Disabilitas & Pendidikan Inklusif", psikolog: "KURNIASIH AYU ARCHENTARI", alamat: "Jl. Agung Timur No. 6A Ngemplak Sutan, Mojosongo, Jebres, Surakarta", telepon: "", jam: "" },
  { nama: "RS Dr. Oen Kandang Sapi Solo", psikolog: "BERNADETH LESTYOBUDI NOVIHARTANTI", alamat: "Jl. Brigjen Katamso 55, Surakarta", telepon: "", jam: "" },
  { nama: "Cindo Consulting", psikolog: "CITRA TYAS LAKSMADITA", alamat: "Jl. Blewah Raya 2 No. 11 Karangasem, Surakarta", telepon: "", jam: "" },
  { nama: "Smart Solindo Consultama", psikolog: "NINDYO PRASETYO", alamat: "Jl. Bromo No.1 Sendangmulyo, Surakarta", telepon: "", jam: "" },
  { nama: "Smart Solindo Consultama", psikolog: "SEPTI NUZULIA RAHMAWATI", alamat: "Jl. Bromo II, Sendang Mulyo, Kadipiro, Banjarsari, Surakarta", telepon: "", jam: "" },
  { nama: "Smart Solindo Consultama", psikolog: "DHANANG SETYAWAN", alamat: "Kadipiro, Banjarsari, Surakarta", telepon: "", jam: "" },
  { nama: "Kantor CG", psikolog: "ORATRI CHRISTY GLORIA SESA", alamat: "Jl. Kabangan 2/2A, Bumi Laweyan, Surakarta", telepon: "", jam: "" },
  { nama: "Jaspi Solo", psikolog: "DINA ALFIA RIZA", alamat: "Jl. Latar Putih No.5, Sondakan, Laweyan, Surakarta", telepon: "", jam: "" },
  { nama: "Biro Psikologi JASPI", psikolog: "DEWI NURHIDAYATI", alamat: "Jl. Latar Putih No.5, Mutihan, Sondakan, Laweyan, Surakarta", telepon: "", jam: "" },
  { nama: "Migunani Consulting", psikolog: "MOHAMMAD ZEIN HIDAYAT", alamat: "Jl. Hasanudin No.18, Purwosari, Laweyan, Surakarta", telepon: "", jam: "" },
  { nama: "RSJD Dr. Arif Zainudin", psikolog: "SONIA NATASHA MARUNDUH", alamat: "Jl. Ki Hajar Dewantoro No.80, Jebres, Surakarta", telepon: "", jam: "" },
  { nama: "Biro Psikologi Asa Psikologi", psikolog: "Berliana Widi Scarvanovi", alamat: "Jl. A. Yani No. 305, Kerten, Laweyan, Surakarta", telepon: "", jam: "" },
  { nama: "Layanan Konsultasi Psikologi Dyara", psikolog: "LIENA ASMA' 'ABIEDATUL MUFIEDAH", alamat: "Jl. Blewah Raya I No. 22, Laweyan, Surakarta", telepon: "", jam: "" },
  { nama: "Klinik Anak Cerdas Ceria", psikolog: "RINA JAYANTI", alamat: "Jl. Letjen Suprapto No.89, Banyuanyar, Surakarta", telepon: "", jam: "" },
];

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const parsePsikologRekomendasi = (text) => {
  const match = text.match(/REKOMENDASI PSIKOLOG:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)$/m);
  if (!match) return null;
  const [_, psikolog, nama, alamat, telepon] = match;
  return { psikolog: psikolog.trim(), nama: nama.trim(), alamat: alamat.trim(), telepon: telepon.trim(), jam: '' };
};

export const cleanPsikologText = (text) => {
  return text.replace(/\n?REKOMENDASI PSIKOLOG:.*$/m, '').trim();
};

const PsikologCard = ({ data }) => {
  const alamat = data.alamat_lengkap || data.alamat || '';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`;

  return (
    <div className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 text-lg">
          🧑‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          {data.nama && <p className="font-fredoka font-bold text-sm text-gray-800">{data.nama}</p>}
          <p className="text-sm font-semibold text-primary-600 mt-0.5">{data.psikolog}{data.gelar ? `, ${data.gelar}` : ''}</p>

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
            {alamat && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                <span>{alamat}</span>
              </div>
            )}
            {data.jarak_km != null && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Navigation size={14} className="shrink-0 text-gray-400" />
                <span>{data.jarak_km} km dari lokasi Anda</span>
              </div>
            )}
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

const KOTA_DROPDOWN = [
  '', 'Surakarta', 'Solo', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta',
  'Semarang', 'Medan', 'Makassar', 'Palembang', 'Denpasar', 'Malang',
  'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Pekanbaru', 'Banjarmasin',
  'Manado', 'Balikpapan', 'Padang', 'Lampung'
];

const SURAKARTA_ALIASES = ['surakarta', 'solo', 'surakarta solo'];

const PsikologFinder = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kota, setKota] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchByLocation = async () => {
    setShowDropdown(false);
    if (!navigator.geolocation) {
      setShowDropdown(true);
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/psikolog-terdekat?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          const data = await res.json();
          setResults(data);
        } catch { setError('Gagal memuat data'); }
        setLoading(false);
      },
      () => {
        setShowDropdown(true);
        setLoading(false);
      }
    );
  };

  const fetchByCity = async (selectedKota) => {
    const isSurakarta = SURAKARTA_ALIASES.some(a => selectedKota.toLowerCase().includes(a));
    if (!isSurakarta) {
      setResults({ results: [], fallback: true, fallback_url: 'https://www.himpsi.or.id/cari-psikolog' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/psikolog-terdekat');
      const data = await res.json();
      if (data.fallback) {
        setResults(data);
      } else {
        setResults({ results: data.results || data, fallback: false });
      }
    } catch { setError('Gagal memuat data'); }
    setLoading(false);
  };

  const handleCitySelect = (e) => {
    const val = e.target.value;
    setKota(val);
    if (val) fetchByCity(val);
  };

  if (!results && !loading && !showDropdown) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Cari Psikolog Terdekat</p>
        <button
          onClick={fetchByLocation}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Navigation size={16} />
          Deteksi Lokasi Saya
        </button>
        <div className="flex items-center gap-2 my-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <button
          onClick={() => setShowDropdown(true)}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition-colors"
        >
          Pilih Kota Manual
        </button>
        <p className="mt-3 text-[10px] text-gray-400 leading-relaxed">
          Data tersedia untuk Surakarta/Solo. Kota lain akan diarahkan ke HIMPSI.
        </p>
      </div>
    );
  }

  if (showDropdown && !results && !loading) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Pilih Kota</p>
        <select
          value={kota}
          onChange={handleCitySelect}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
        >
          <option value="">-- Pilih Kota --</option>
          {KOTA_DROPDOWN.filter(k => k).map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <button onClick={() => setShowDropdown(false)} className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline">
          Kembali
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-6 shadow-sm flex items-center justify-center gap-2 text-sm text-gray-500">
        <Loader2 size={18} className="animate-spin text-primary-500" />
        Mencari psikolog terdekat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
        <button onClick={() => { setResults(null); setError(null); setShowDropdown(false); }} className="mt-2 text-xs text-primary-600 hover:underline flex items-center gap-1">
          <RefreshCw size={12} /> Coba lagi
        </button>
      </div>
    );
  }

  if (results?.fallback) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="text-sm text-gray-600">
          Belum ada data psikolog di kota Anda. Silakan cari langsung di direktori resmi HIMPSI.
        </p>
        <a
          href={results.fallback_url || 'https://www.himpsi.or.id/cari-psikolog'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
        >
          <ExternalLink size={14} /> Kunjungi HIMPSI
        </a>
        <button onClick={() => { setResults(null); setShowDropdown(false); }} className="block mt-2 text-xs text-gray-400 hover:text-gray-600 underline">
          Coba lagi
        </button>
      </div>
    );
  }

  if (results?.results?.length > 0) {
    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-fredoka font-bold text-sm text-gray-800">
            Psikolog Terdekat di Surakarta ({results.results.length})
          </p>
          <button onClick={() => { setResults(null); setShowDropdown(false); }} className="text-xs text-gray-400 hover:text-gray-600 underline">
            Tutup
          </button>
        </div>
        {results.results.map((p, idx) => (
          <PsikologCard key={idx} data={p} />
        ))}
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Data bersumber dari HIMPSI. Mohon konfirmasi ulang jadwal praktik sebelum berkunjung.
        </p>
      </div>
    );
  }

  return null;
};

export default PsikologCard;
export { PsikologFinder, PSIKOLOG_DATA };