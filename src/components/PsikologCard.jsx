import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

const PSIKOLOG_DATA = [
  { nama: "Psikolog Anak & Keluarga", psikolog: "Dr. Rina Wijaya, M.Psi., Psikolog", alamat: "Jl. Simprug Golf No.12, Jakarta Selatan", telepon: "(021) 7234-5678", jam: "Sen-Jum 09:00-17.00" },
  { nama: "Klinik Tumbuh Kembang Anak", psikolog: "Dr. Andi Pratama, M.Psi., Psikolog", alamat: "Jl. Diponegoro No.45, Bandung", telepon: "(022) 8234-9101", jam: "Sen-Sab 08:00-16.00" },
  { nama: "Lembaga Psikologi Terapan", psikolog: "Dr. Maya Sari, M.Psi., Psikolog", alamat: "Jl. Manyar Kertoajo No.78, Surabaya", telepon: "(031) 8456-7890", jam: "Sen-Jum 09:00-18.00" },
  { nama: "Pusat Konsultasi Psikologi", psikolog: "Dr. Budi Hartono, M.Psi., Psikolog", alamat: "Jl. Kaliurang KM 5.5 No.23, Yogyakarta", telepon: "(0274) 8567-1234", jam: "Sen-Sab 08:30-16.30" },
  { nama: "Klinik Psikologi Anak & Remaja", psikolog: "Dr. Dina Nuraini, M.Psi., Psikolog", alamat: "Jl. Sudirman No.67, Medan", telepon: "(061) 8123-4567", jam: "Sen-Jum 09:00-17.00" },
  { nama: "Biro Psikologi Permata Hati", psikolog: "Dr. Fitriani Lubis, M.Psi., Psikolog", alamat: "Jl. Boulevard Raya Blok A No.15, Makassar", telepon: "(0411) 8789-0123", jam: "Sen-Jum 08:00-16.00" },
  { nama: "Psikolog Anak & Perkembangan", psikolog: "Dr. Agus Wibowo, M.Psi., Psikolog", alamat: "Jl. Pemuda No.88, Semarang", telepon: "(024) 8567-8901", jam: "Sen-Sab 09:00-17.00" },
  { nama: "Klinik Psikologi Bunda", psikolog: "Dr. Siti Aisyah, M.Psi., Psikolog", alamat: "Jl. Ahmad Yani No.34, Palembang", telepon: "(0711) 8234-5678", jam: "Sen-Jum 08:00-16.00" }
];

export const parsePsikologRekomendasi = (text) => {
  const match = text.match(/REKOMENDASI PSIKOLOG:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)$/m);
  if (!match) return null;

  const [_, namaPsikolog, namaTempat, alamat, telepon] = match;

  const found = PSIKOLOG_DATA.find(
    p => p.psikolog === namaPsikolog.trim() || p.nama === namaTempat.trim()
  );
  return found || { nama: namaTempat.trim(), psikolog: namaPsikolog.trim(), alamat: alamat.trim(), telepon: telepon.trim(), jam: '' };
};

export const cleanPsikologText = (text) => {
  return text.replace(/\n?REKOMENDASI PSIKOLOG:.*$/m, '').trim();
};

const PsikologCard = ({ data }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.alamat)}`;

  return (
    <div className="mt-3 bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 text-lg">
          🧑‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-fredoka font-bold text-sm text-gray-800">{data.nama}</p>
          <p className="text-sm font-medium text-primary-600 mt-0.5">{data.psikolog}</p>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
              <span>{data.alamat}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone size={14} className="shrink-0 text-gray-400" />
              <a href={`tel:${data.telepon}`} className="text-primary-600 hover:underline font-medium">{data.telepon}</a>
            </div>
            {data.jam && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={14} className="shrink-0 text-gray-400" />
                <span>{data.jam}</span>
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

export default PsikologCard;