import { useState } from 'react';
import { MapPin, Phone, ExternalLink, Navigation, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const parsePsikologRekomendasi = (text) => {
  const match = text.match(/REKOMENDASI PSIKOLOG:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)$/m);
  if (!match) return null;
  const [_, psikolog, namaTempat, alamat, telepon] = match;
  return { psikolog: psikolog.trim(), nama: namaTempat.trim(), alamat_lengkap: alamat.trim(), telepon: telepon.trim(), jarak_km: null };
};

export const cleanPsikologText = (text) => {
  return text.replace(/\n?REKOMENDASI PSIKOLOG:.*$/m, '').trim();
};

const PsikologCard = ({ data }) => {
  const alamat = data.alamat_lengkap || data.alamat || '';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`;
  const nama = data.nama_tempat || data.nama || '';
  const psikolog = data.psikolog || data.nama || '';
  const telepon = data.telepon || '';

  return (
    <div className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 text-lg">
          🧑‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          {nama && <p className="font-fredoka font-bold text-sm text-gray-800">{nama}</p>}
          <p className="text-sm font-medium text-primary-600 mt-0.5">{psikolog}</p>

          {data.is_verified_manual && (
            <span className="inline-block mt-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              Terverifikasi IPK Indonesia
            </span>
          )}

          <div className="mt-2 space-y-1.5">
            {alamat && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                <span>{alamat}</span>
              </div>
            )}
            {telepon && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone size={14} className="shrink-0 text-gray-400" />
                <a href={`tel:${telepon}`} className="text-primary-600 hover:underline font-medium">{telepon}</a>
              </div>
            )}
            {data.jarak_km != null && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Navigation size={14} className="shrink-0 text-gray-400" />
                <span>{data.jarak_km} km dari lokasi Anda</span>
              </div>
            )}
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
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

const KOTA_LIST = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang',
  'Medan', 'Makassar', 'Palembang', 'Denpasar', 'Malang',
  'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Pekanbaru',
  'Banjarmasin', 'Manado', 'Balikpapan', 'Padang', 'Lampung'
];

const PsikologFinder = ({ onClose }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kotaManual, setKotaManual] = useState('');
  const [mode, setMode] = useState(null);

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser Anda tidak mendukung geolokasi. Silakan cari berdasarkan kota.');
      setMode('kota');
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
        } catch (err) {
          setError('Gagal memuat data psikolog. Coba lagi nanti.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Izin lokasi ditolak. Silakan cari berdasarkan kota.');
        setMode('kota');
        setLoading(false);
      }
    );
  };

  const fetchByCity = async () => {
    if (!kotaManual.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/psikolog-terdekat?kota=${encodeURIComponent(kotaManual.trim())}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('Gagal memuat data psikolog. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResults(null);
    setError(null);
    setMode(null);
  };

  if (!mode && !results) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Cari Psikolog Terdekat</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { setMode('lokasi'); fetchByLocation(); }}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Navigation size={16} />
            Gunakan Lokasi Saya
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />
            <span>atau</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            onClick={() => setMode('kota')}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Search size={16} />
            Cari Berdasarkan Kota
          </button>
        </div>
        <p className="mt-3 text-[10px] text-gray-400 leading-relaxed">
          Data bersumber dari IPK Indonesia. Mohon konfirmasi ulang jadwal praktik sebelum berkunjung.
        </p>
      </div>
    );
  }

  if (mode === 'kota' && !results) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="font-fredoka font-bold text-sm text-gray-800 mb-3">Cari Berdasarkan Kota</p>
        <div className="flex gap-2">
          <input
            list="kota-list"
            value={kotaManual}
            onChange={(e) => setKotaManual(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchByCity()}
            placeholder="Masukkan nama kota..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
          />
          <datalist id="kota-list">
            {KOTA_LIST.map(k => <option key={k} value={k} />)}
          </datalist>
          <button
            onClick={fetchByCity}
            disabled={loading || !kotaManual.trim()}
            className="flex items-center justify-center gap-1 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 px-4 py-2 rounded-xl transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
        <button onClick={handleRetry} className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline">
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
        <button onClick={handleRetry} className="mt-2 text-xs text-primary-600 hover:underline flex items-center gap-1">
          <RefreshCw size={12} /> Coba lagi
        </button>
      </div>
    );
  }

  if (results?.fallback) {
    return (
      <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
        <p className="text-sm text-gray-600">
          Belum ada data psikolog terdekat. Silakan cek langsung di direktori resmi IPK Indonesia.
        </p>
        <a
          href={results.fallback_url || 'https://data.ipkindonesia.or.id/cari-psikolog/'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
        >
          <ExternalLink size={14} /> Buka Direktori IPK Indonesia
        </a>
        <button onClick={handleRetry} className="block mt-2 text-xs text-gray-400 hover:text-gray-600 underline">
          Coba pencarian lain
        </button>
      </div>
    );
  }

  if (results?.results?.length > 0) {
    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-fredoka font-bold text-sm text-gray-800">
            Psikolog Terdekat ({results.results.length})
          </p>
          <button onClick={handleRetry} className="text-xs text-gray-400 hover:text-gray-600 underline">
            Cari ulang
          </button>
        </div>
        {results.results.map((p, idx) => (
          <PsikologCard key={p.id || idx} data={p} />
        ))}
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Data bersumber dari IPK Indonesia. Mohon konfirmasi ulang jadwal praktik sebelum berkunjung.
        </p>
      </div>
    );
  }

  return null;
};

export default PsikologCard;
export { PsikologFinder };
