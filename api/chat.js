const PSIKOLOG_DUMMY = [
  { nama: "Psikolog Anak & Keluarga", psikolog: "Dr. Rina Wijaya, M.Psi., Psikolog", alamat: "Jl. Simprug Golf No.12, Jakarta Selatan", telepon: "(021) 7234-5678", jam: "Sen-Jum 09:00-17.00" },
  { nama: "Klinik Tumbuh Kembang Anak", psikolog: "Dr. Andi Pratama, M.Psi., Psikolog", alamat: "Jl. Diponegoro No.45, Bandung", telepon: "(022) 8234-9101", jam: "Sen-Sab 08:00-16.00" },
  { nama: "Lembaga Psikologi Terapan", psikolog: "Dr. Maya Sari, M.Psi., Psikolog", alamat: "Jl. Manyar Kertoajo No.78, Surabaya", telepon: "(031) 8456-7890", jam: "Sen-Jum 09:00-18.00" },
  { nama: "Pusat Konsultasi Psikologi", psikolog: "Dr. Budi Hartono, M.Psi., Psikolog", alamat: "Jl. Kaliurang KM 5.5 No.23, Yogyakarta", telepon: "(0274) 8567-1234", jam: "Sen-Sab 08:30-16.30" },
  { nama: "Klinik Psikologi Anak & Remaja", psikolog: "Dr. Dina Nuraini, M.Psi., Psikolog", alamat: "Jl. Sudirman No.67, Medan", telepon: "(061) 8123-4567", jam: "Sen-Jum 09:00-17.00" },
  { nama: "Biro Psikologi Permata Hati", psikolog: "Dr. Fitriani Lubis, M.Psi., Psikolog", alamat: "Jl. Boulevard Raya Blok A No.15, Makassar", telepon: "(0411) 8789-0123", jam: "Sen-Jum 08:00-16.00" },
  { nama: "Psikolog Anak & Perkembangan", psikolog: "Dr. Agus Wibowo, M.Psi., Psikolog", alamat: "Jl. Pemuda No.88, Semarang", telepon: "(024) 8567-8901", jam: "Sen-Sab 09:00-17.00" },
  { nama: "Klinik Psikologi Bunda", psikolog: "Dr. Siti Aisyah, M.Psi., Psikolog", alamat: "Jl. Ahmad Yani No.34, Palembang", telepon: "(0711) 8234-5678", jam: "Sen-Jum 08:00-16.00" }
];

const SYSTEM_PROMPT = `Kamu adalah asisten AI bernama Robo Assistant yang membantu orang tua memahami platform Robo Mind.

DESKRIPSI PLATFORM:
RoboMind adalah ekosistem intervensi neuropsikologis cerdas yang dirancang untuk mengoptimalkan fungsi eksekutif inti pada anak. Platform ini mengintegrasikan game neurokognitif berbasis riset ilmiah untuk anak-anak dengan dashboard pemantauan progres adaptif untuk orang tua. Dengan mengubah pendekatan intervensi klinis menjadi aktivitas gamifikasi yang menyenangkan, ekosistem ini secara sistematis mendorong perkembangan Korteks Prefrontal (PFC) anak — bagian otak depan yang mengatur fokus, kontrol diri, perencanaan, dan fleksibilitas kognitif.

INFORMASI LENGKAP PLATFORM:
${JSON.stringify(landingContext, null, 2)}

DATA PSIKOLOG ANAK (DUMMY):
${JSON.stringify(PSIKOLOG_DUMMY, null, 2)}

ATURAN:
1. Kamu HANYA menjawab pertanyaan seputar: Robo Mind, game neurokognitif, fungsi eksekutif otak anak, perkembangan Korteks Prefrontal (PFC), parenting ringan terkait stimulasi kognitif anak usia 6-12 tahun.
2. Jika orang tua curhat tentang KELUHAN RINGAN (anak lambat paham game, susah fokus, malas belajar, tantrum ringan wajar), beri saran parenting dan dukungan. JANGAN langsung rekomendasikan psikolog.
3. REKOMENDASIKAN PSIKOLOG HANYA jika keluhannya sudah SANGAT EKSTREM, seperti: trauma berat, kekerasan, gangguan perkembangan parah yang sudah didiagnosis, atau situasi darurat. Untuk kasus ekstrem, RESPON DENGAN EMPATI lalu sertakan rekomendasi dari DATA PSIKOLOG ANAK di atas (boleh pilih salah satu). Gunakan format: "REKOMENDASI PSIKOLOG: {nama_psikolog} | {nama_tempat} | {alamat} | {telepon}" di akhir respons.
4. Jika pertanyaan di luar topik PFC/perkembangan otak/game Robo Mind/parenting kognitif, tolak dengan sopan.
5. Gunakan bahasa Indonesia yang ramah, hangat, dan santai.
6. Jangan mengaku sebagai psikolog atau dokter — kamu adalah asisten informasi platform.
7. Jawab singkat, padat, jelas (maks 3-4 kalimat).`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { message, messages } = req.body;

    let finalMessages;
    if (messages && Array.isArray(messages)) {
      finalMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ];
    } else if (message && typeof message === 'string') {
      finalMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ];
    } else {
      return res.status(400).json({ error: 'Message or messages required' });
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: finalMessages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      return res.status(response.status).json({ error: 'API request failed' });
    }

    const reply = data.choices[0]?.message?.content || 'Maaf, saya tidak bisa menjawab pertanyaan itu.';

    res.json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
