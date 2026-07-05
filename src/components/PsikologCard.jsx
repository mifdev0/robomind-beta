import { MapPin, Phone, ExternalLink, BadgeCheck, Award } from 'lucide-react';

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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.alamat)}`;

  return (
    <div className="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 text-lg">
          🧑‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          {data.nama && <p className="font-fredoka font-bold text-sm text-gray-800">{data.nama}</p>}
          <p className="text-sm font-semibold text-primary-600 mt-0.5">{data.psikolog}</p>

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

export default PsikologCard;
export { PSIKOLOG_DATA };