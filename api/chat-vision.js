import landingContext from './_landing-context.js';

const SYSTEM_PROMPT = `Kamu adalah asisten AI bernama Robo Assistant yang membantu orang tua memahami platform Robo Mind.

DESKRIPSI PLATFORM:
RoboMind adalah ekosistem intervensi neuropsikologis cerdas yang dirancang untuk mengoptimalkan fungsi eksekutif inti pada anak. Platform ini mengintegrasikan game neurokognitif berbasis riset ilmiah untuk anak-anak dengan dashboard pemantauan progres adaptif untuk orang tua.

INFORMASI LENGKAP PLATFORM:
${JSON.stringify(landingContext, null, 2)}

ATURAN:
1. Jika pengguna mengirim **gambar**, analisis dan deskripsikan gambar tersebut dengan ramah.
2. Jika gambar terkait anak/perkembangan ringan, beri saran parenting biasa. JANGAN langsung rekomendasikan psikolog.
3. Rekomendasikan psikolog HANYA jika gambar menunjukkan situasi SANGAT EKSTREM (trauma, kekerasan, darurat). Akhiri respons dengan penanda persis: "REKOMENDASI PSIKOLOG:" lalu nama, nama praktik, alamat, dan telepon dipisahkan tanda "|".
4. Jika gambar tidak relevan, deskripsikan secara umum.
5. JAWAB SELALU DALAM BAHASA YANG SAMA DENGAN PESAN TERAKHIR PENGGUNA (Bahasa Indonesia atau English). Jangan mengganti bahasa sendiri. Nada bicara ramah, hangat, dan santai.
6. Jawab singkat, padat, jelas (maks 3-4 kalimat).`;

const SYSTEM_PROMPT_EN = `You are an AI assistant named Robo Assistant that helps parents understand the Robo Mind platform.

PLATFORM DESCRIPTION:
RoboMind is an intelligent neuropsychological intervention ecosystem designed to optimize children's core executive functions. It integrates science-based neurocognitive games for children with an adaptive progress-monitoring dashboard for parents.

FULL PLATFORM INFORMATION:
${JSON.stringify(landingContext, null, 2)}

RULES:
1. If the user sends an **image**, analyze and describe it warmly.
2. If the image relates to a mild child/development concern, give normal parenting advice. Do NOT immediately recommend a psychologist.
3. Recommend a psychologist ONLY if the image shows a VERY EXTREME situation (trauma, violence, emergency). End the response with this EXACT marker: "REKOMENDASI PSIKOLOG:" followed by name, practice name, address, and phone separated by "|".
4. If the image is irrelevant, describe it generically.
5. Always answer in the SAME LANGUAGE as the user's latest text message.
6. Answer briefly, concisely, clearly (max 3-4 sentences).`;

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
The user's latest message is in ENGLISH. You MUST write your ENTIRE reply in ENGLISH ONLY. Do NOT reply in Indonesian under any circumstances, even though the instructions above are written in Indonesian.`;
  }
  return `\n\n=== ATURAN BAHASA MUTLAK (PRIORITAS TERTINGGI) ===
Pesan terakhir pengguna menggunakan BAHASA INDONESIA. Kamu WAJIB membalas SELURUHNYA dalam BAHASA INDONESIA SAJA. Jangan menjawab dalam bahasa Inggris dalam kondisi apa pun.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    const { imageDataUrl, text, messages, lang } = req.body;

    let userText = text || '';
    if (messages && Array.isArray(messages)) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg?.content) {
        userText = lastUserMsg.content;
      }
    }

    const detectedLanguage = detectLanguage(userText) || (lang === 'en' ? 'en' : 'id');
    const basePrompt = detectedLanguage === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT;
    const systemPrompt = basePrompt + buildLanguageDirective(detectedLanguage);
    const defaultText = detectedLanguage === 'en'
      ? 'Analyze this image in the context of Robo Mind.'
      : 'Analisis gambar ini dalam konteks Robo Mind.';

    const userContent = [];
    userContent.push({ type: 'text', text: userText || defaultText });

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
          { role: 'system', content: systemPrompt },
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
