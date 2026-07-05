import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import landingContext from './api/_landing-context.js'

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

ATURAN:
1. Kamu HANYA menjawab pertanyaan seputar: Robo Mind, game neurokognitif, fungsi eksekutif otak anak, perkembangan Korteks Prefrontal (PFC), parenting ringan terkait stimulasi kognitif anak usia 6-12 tahun.
2. Jika orang tua curhat tentang KELUHAN RINGAN (anak lambat paham game, susah fokus, malas belajar, tantrum ringan wajar), beri saran parenting dan dukungan. JANGAN langsung rekomendasikan psikolog.
3. REKOMENDASIKAN PSIKOLOG HANYA jika keluhannya sudah SANGAT EKSTREM, seperti: trauma berat, kekerasan, gangguan perkembangan parah yang sudah didiagnosis, atau situasi darurat. Untuk kasus ekstrem, RESPON DENGAN EMPATI. Akhiri respons dengan: "REKOMENDASI PSIKOLOG: Silakan gunakan fitur Psikolog Terdekat di bawah untuk menemukan psikolog di Surakarta."
4. Jika pertanyaan di luar topik PFC/perkembangan otak/game Robo Mind/parenting kognitif, tolak dengan sopan.
5. Gunakan bahasa Indonesia yang ramah, hangat, dan santai.
6. Jangan mengaku sebagai psikolog atau dokter — kamu adalah asisten informasi platform.
7. Jawab singkat, padat, jelas (maks 3-4 kalimat).`;

const VISION_SYSTEM_PROMPT = `Kamu adalah asisten AI bernama Robo Assistant yang membantu orang tua memahami platform Robo Mind.

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'chat-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { message, messages } = JSON.parse(body);

                const apiKey = env.DEEPSEEK_API_KEY || '';
                if (!apiKey) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'API key not configured' }));
                  return;
                }

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
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Message or messages required' }));
                  return;
                }

                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
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
                  console.error('DeepSeek error:', data);
                  res.statusCode = response.status;
                  res.end(JSON.stringify({ error: 'API request failed' }));
                  return;
                }

                const reply = data.choices[0]?.message?.content || 'Maaf, saya tidak bisa menjawab pertanyaan itu.';
                res.end(JSON.stringify({ reply }));
              } catch (err) {
                console.error('Chat error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal server error' }));
              }
            });
          });

          server.middlewares.use('/api/chat-vision', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { imageDataUrl, text, messages } = JSON.parse(body);

                const groqKey = env.GROQ_API_KEY || '';
                if (!groqKey) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Groq API key not configured' }));
                  return;
                }

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
                    'Authorization': `Bearer ${groqKey}`
                  },
                  body: JSON.stringify({
                    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                    messages: [
                      { role: 'system', content: VISION_SYSTEM_PROMPT },
                      { role: 'user', content: userContent }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                  })
                });

                const data = await response.json();

                if (!response.ok) {
                  console.error('Groq error:', data);
                  res.statusCode = response.status;
                  res.end(JSON.stringify({ error: 'Groq API request failed' }));
                  return;
                }

                const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses gambar itu.';
                res.end(JSON.stringify({ reply }));
              } catch (err) {
                console.error('Vision error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal server error' }));
              }
            });
          });

          server.middlewares.use('/api/psikolog-terdekat', async (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }
            try {
              const url = new URL(req.url, `http://${req.headers.host}`);
              const lat = url.searchParams.get('lat');
              const lng = url.searchParams.get('lng');

              const { createClient } = await import('@supabase/supabase-js');
              const supabaseUrl = env.VITE_SUPABASE_URL || '';
              const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';

              if (!supabaseUrl || !supabaseKey) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Supabase not configured' }));
                return;
              }

              const supabase = createClient(supabaseUrl, supabaseKey);
              const { data, error } = await supabase.from('psikolog').select('*');

              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Database error' }));
                return;
              }

              if (!data || data.length === 0) {
                res.end(JSON.stringify({ results: [], fallback: true, fallback_url: 'https://www.himpsi.or.id/cari-psikolog' }));
                return;
              }

              let results;
              if (lat && lng) {
                const userLat = parseFloat(lat);
                const userLng = parseFloat(lng);
                const haversine = (a, b, c, d) => {
                  const R = 6371;
                  const dLat = (c - a) * Math.PI / 180;
                  const dLng = (d - b) * Math.PI / 180;
                  return R * 2 * Math.atan2(Math.sqrt(Math.sin(dLat / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLng / 2) ** 2), Math.sqrt(1 - (Math.sin(dLat / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLng / 2) ** 2)));
                };
                results = data
                  .map(d => ({ ...d, jarak_km: Math.round(haversine(userLat, userLng, d.latitude || -7.556, d.longitude || 110.831) * 10) / 10 }))
                  .sort((a, b) => a.jarak_km - b.jarak_km);
              } else {
                results = data;
              }

              const minDistance = results.length > 0 ? (results[0].jarak_km || 0) : Infinity;
              res.end(JSON.stringify({
                results: minDistance <= 50 ? results.slice(0, 15) : [],
                fallback: minDistance > 50 || results.length === 0,
                fallback_url: 'https://www.himpsi.or.id/cari-psikolog'
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Internal error' }));
            }
          });
        }
      }
    ],
    server: {
      port: 3000,
      strictPort: true,
    }
  };
})
