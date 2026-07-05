import { useState } from 'react';
import { MapPin, Phone, ExternalLink, Navigation, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

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

const SURAKARTA_COORDS = { lat: -7.556, lng: 110.831 };

export const parsePsikologRekomendasi = (text) => {
  const match = text.match(/REKOMENDASI PSIKOLOG:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)$/m);
  if (!match) return null;
  const [_, psikolog, nama, alamat, telepon] = match;
  return { psikolog: psikolog.trim(), nama: nama.trim(), alamat: alamat.trim(), telepon: telepon.trim(), jam: '' };
};

export const cleanPsikologText = (text) => {
  return text.replace(/\n?REKOMENDASI PSIKOLOG:.*$/m, '').trim();
};

function sortByDistance(lat, lng) {
  return [...PSIKOLOG_DATA]
    .map(d => ({ ...d, jarak_km: Math.round(haversine(lat, lng, SURAKARTA_COORDS.lat, SURAKARTA_COORDS.lng) * 10) / 10 }))
    .sort((a, b) => a.jarak_km - b.jarak_km);
}

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
          <p className="font-fredoka font-bold text-sm text-gray-800">{data.nama}</p>
          <p className="text-sm font-medium text-primary-600 mt-0.5">{data.psikolog}</p>
          <div className="mt-2 space-y-1.5">
            {alamat && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                <span>{alamat}</span>
              </div>
            )}
            {data.jarak_km != null && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Navigation size={14} className="shrink-0 text-gray-400" />
                <span>{data.jarak_km} km dari Surakarta</span>
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

const PsikologFinder = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setResults({ results: sortByDistance(SURAKARTA_COORDS.lat, SURAKARTA_COORDS.lng), fallback: false });
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const sorted = sortByDistance(pos.coords.latitude, pos.coords.longitude);
        setResults({ results: sorted, fallback: false });
        setLoading(false);
      },
      () => {
        const sorted = sortByDistance(SURAKARTA_COORDS.lat, SURAKARTA_COORDS.lng);
        setResults({ results: sorted, fallback: false });
        setLoading(false);
      }
    );
  };

  if (!results && !loading) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Psikolog Terdekat di Surakarta</p>
        <button
          onClick={fetchByLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Navigation size={16} />
          Tampilkan Psikolog Terdekat
        </button>
        <p className="mt-3 text-[10px] text-gray-400 leading-relaxed">
          Data bersumber dari HIMPSI. Jarak dihitung dari lokasi Anda.
        </p>
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
        <button onClick={() => { setResults(null); setError(null); }} className="mt-2 text-xs text-primary-600 hover:underline flex items-center gap-1">
          <RefreshCw size={12} /> Coba lagi
        </button>
      </div>
    );
  }

  if (results?.results?.length > 0) {
    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-fredoka font-bold text-sm text-gray-800">
            Psikolog di Surakarta ({results.results.length})
          </p>
          <button onClick={() => setResults(null)} className="text-xs text-gray-400 hover:text-gray-600 underline">
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