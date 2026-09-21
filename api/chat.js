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
5. JAWAB SELALU DALAM BAHASA YANG SAMA DENGAN PESAN TERAKHIR PENGGUNA. Jika pengguna menulis dalam Bahasa Indonesia, balas dalam Bahasa Indonesia. Jika pengguna menulis dalam English, balas dalam English. Jangan pernah mengganti bahasa sendiri. Nada bicara tetap ramah, hangat, dan santai.
6. Jangan mengaku sebagai psikolog atau dokter — kamu adalah asisten informasi platform.
7. Jawab singkat, padat, jelas (maks 3-4 kalimat).
8. Jika kamu merekomendasikan psikolog untuk kasus ekstrem (aturan 3), tetap akhiri dengan penanda PERSIS ini di baris baru: "REKOMENDASI PSIKOLOG:" diikuti nama, nama praktik, alamat, dan telepon yang dipisahkan tanda "|". Penanda ini wajib ditulis apa adanya (jangan diterjemahkan).`;

const SYSTEM_PROMPT_EN = `You are an AI assistant named Robo Assistant that helps parents understand the Robo Mind platform.

PLATFORM DESCRIPTION:
RoboMind is an intelligent neuropsychological intervention ecosystem designed to optimize children's core executive functions. It integrates science-based neurocognitive games for children with an adaptive progress-monitoring dashboard for parents. By turning clinical intervention approaches into enjoyable gamified activities, this ecosystem systematically drives the development of a child's Prefrontal Cortex (PFC) — the front part of the brain that governs focus, self-control, planning, and cognitive flexibility.

FULL PLATFORM INFORMATION:
${JSON.stringify(landingContext, null, 2)}

RULES:
1. You ONLY answer questions about: Robo Mind, neurocognitive games, children's brain executive functions, Prefrontal Cortex (PFC) development, and light parenting related to cognitive stimulation for children aged 6-12.
2. If a parent shares a MILD concern (child slow to understand games, hard to focus, unmotivated to study, mild normal tantrums), give parenting advice and support. Do NOT immediately recommend a psychologist.
3. RECOMMEND A PSYCHOLOGIST ONLY if the concern is VERY EXTREME, such as: severe trauma, violence, a diagnosed severe developmental disorder, or an emergency. For extreme cases, RESPOND WITH EMPATHY. End the response with this EXACT marker on a new line: "REKOMENDASI PSIKOLOG:" followed by name, practice name, address, and phone separated by "|". This marker must be written as-is (do not translate it).
4. If the question is outside the topic of PFC/brain development/Robo Mind games/cognitive parenting, politely decline.
5. Always answer in the SAME LANGUAGE as the user's latest message.
6. Never claim to be a psychologist or doctor — you are a platform information assistant.
7. Answer briefly, concisely, clearly (max 3-4 sentences).`;

const ID_MARKERS = [' yang ', ' dan ', ' atau ', ' saya ', ' aku ', ' kamu ', ' anda ', ' anak ', ' tidak ', ' gak ', ' nggak ', ' enggak ', ' dengan ', ' untuk ', ' dari ', ' ini ', ' itu ', ' apa ', ' siapa ', ' kenapa ', ' bagaimana ', ' gimana ', ' cara ', ' bisa ', ' sudah ', ' belum ', ' mau ', ' ingin ', ' harus ', ' jangan ', ' kalau ', ' karena ', ' juga ', ' saja ', ' sangat ', ' lebih ', ' paling ', ' orang ', ' waktu ', ' hari ', ' main ', ' bermain ', ' belajar ', ' fokus ', ' tapi ', ' bunda ', ' ayah ', ' tolong ', ' maaf ', ' halo ', ' hai '];
const EN_MARKERS = [' the ', ' and ', ' or ', ' i ', ' you ', ' we ', ' they ', ' my ', ' your ', ' child ', ' children ', ' kid ', ' kids ', ' son ', ' daughter ', ' not ', ' dont ', ' with ', ' for ', ' from ', ' to ', ' this ', ' that ', ' these ', ' those ', ' what ', ' who ', ' why ', ' how ', ' can ', ' could ', ' should ', ' would ', ' want ', ' need ', ' have ', ' has ', ' had ', ' does ', ' did ', ' but ', ' because ', ' also ', ' very ', ' more ', ' most ', ' today ', ' now ', ' please ', ' help ', ' hello ', ' sorry ', ' advice ', ' temper ', ' behavior ', ' behaviour ', ' learning ', ' game ', ' games '];

function detectLanguage(text) {
  if (!text || typeof text !== 'string') return null;
  const normalized = ` ${text.toLowerCase().replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ')} `;
  let idScore = 0;
  let enScore = 0;
  for (const w of ID_MARKERS) if (normalized.includes(w)) idScore++;
  for (const w of EN_MARKERS) if (normalized.includes(w)) enScore++;
  if (idScore === 0 && enScore === 0) return null;
  if (enScore > idScore) return 'en';
  if (idScore > enScore) return 'id';
  return null;
}

function buildLanguageDirective(language) {
  if (language === 'en') {
    return `\n\n=== STRICT LANGUAGE RULE (HIGHEST PRIORITY) ===
The user's latest message is in ENGLISH. You MUST write your ENTIRE reply in ENGLISH ONLY. Do NOT reply in Indonesian under any circumstances, even though the instructions above are written in Indonesian. Translate any platform information you need into English.`;
  }
  return `\n\n=== ATURAN BAHASA MUTLAK (PRIORITAS TERTINGGI) ===
Pesan terakhir pengguna menggunakan BAHASA INDONESIA. Kamu WAJIB membalas SELURUHNYA dalam BAHASA INDONESIA SAJA. Jangan menjawab dalam bahasa Inggris dalam kondisi apa pun.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { message, messages, stream, lang } = req.body || {};

    let lastUserContent = '';
    if (messages && Array.isArray(messages)) {
      const lastUser = [...messages].reverse().find(m => m && m.role === 'user');
      if (lastUser?.content) lastUserContent = lastUser.content;
    } else if (typeof message === 'string') {
      lastUserContent = message;
    }

    const detectedLanguage = detectLanguage(lastUserContent) || (lang === 'en' ? 'en' : 'id');
    const basePrompt = detectedLanguage === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT;
    const systemPrompt = basePrompt + buildLanguageDirective(detectedLanguage);

    let finalMessages = [];
    if (messages && Array.isArray(messages)) {
      const formatted = messages.filter(m => m && m.role && m.content);
      const firstUserIdx = formatted.findIndex(m => m.role === 'user');
      const validHistory = firstUserIdx !== -1 ? formatted.slice(firstUserIdx) : formatted;

      finalMessages = [
        { role: 'system', content: systemPrompt },
        ...validHistory
      ];
    } else if (message && typeof message === 'string') {
      finalMessages = [
        { role: 'system', content: systemPrompt },
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


