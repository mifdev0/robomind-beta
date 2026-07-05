import landingContext from './_landing-context.js';

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
RoboMind adalah ekosistem intervensi neuropsikologis cerdas yang dirancang untuk mengoptimalkan fungsi eksekutif inti pada anak. Platform ini mengintegrasikan game neurokognitif berbasis riset ilmiah untuk anak-anak dengan dashboard pemantauan progres adaptif untuk orang tua.

INFORMASI LENGKAP PLATFORM:
${JSON.stringify(landingContext, null, 2)}

DATA PSIKOLOG ANAK (DUMMY):
${JSON.stringify(PSIKOLOG_DUMMY, null, 2)}

ATURAN:
1. Jika pengguna mengirim **gambar**, analisis dan deskripsikan gambar tersebut dengan ramah dalam bahasa Indonesia.
2. Jika gambar terkait anak/perkembangan ringan, beri saran parenting biasa. JANGAN langsung rekomendasikan psikolog.
3. Rekomendasikan psikolog dari DATA PSIKOLOG ANAK HANYA jika gambar menunjukkan situasi SANGAT EKSTREM (trauma, kekerasan, darurat). Gunakan format: "REKOMENDASI PSIKOLOG: {nama_psikolog} | {nama_tempat} | {alamat} | {telepon}" di akhir respons.
4. Jika gambar tidak relevan, deskripsikan secara umum.
5. Gunakan bahasa Indonesia yang ramah, hangat, dan santai.
6. Jawab singkat, padat, jelas (maks 3-4 kalimat).`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    const { imageDataUrl, text, messages } = req.body;

    let userText = text || '';
    if (messages && Array.isArray(messages)) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg?.content) {
        userText = lastUserMsg.content;
      }
    }

    const userContent = [];
    userContent.push({ type: 'text', text: userText || 'Analisis gambar ini dalam konteks Robo Mind.' });

    if (imageDataUrl) {
      userContent.push({
        type: 'image_url',
        image_url: { url: imageDataUrl }
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json({ error: 'Groq API request failed' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses gambar itu.';

    res.json({ reply });
  } catch (error) {
    console.error('Vision server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
