import landingContext from './_landing-context.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { message, messages, stream } = req.body || {};

    let finalMessages = [];
    if (messages && Array.isArray(messages)) {
      const formatted = messages.filter(m => m && m.role && m.content);
      const firstUserIdx = formatted.findIndex(m => m.role === 'user');
      const validHistory = firstUserIdx !== -1 ? formatted.slice(firstUserIdx) : formatted;

      finalMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...validHistory
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
        max_tokens: 500,
        stream: !!stream
      })
    });

    if (stream) {
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('DeepSeek API error:', data);
        return res.status(response.status).json({ error: data.error?.message || data.error || 'API request failed' });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
        if (typeof res.flush === 'function') res.flush();
      }
      res.end();
    } else {
      // Non-streaming JSON mode
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('DeepSeek API error:', data);
        return res.status(response.status).json({ error: data.error?.message || data.error || 'API request failed' });
      }
      const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa menjawab pertanyaan itu.';
      res.json({ reply });
    }
  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.end();
    }
  }
}


