import i18n from '../i18n';

const isEn = () => i18n.language === 'en';

export const generateChatResponse = async (messages) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data.error);
      throw new Error(isEn() ? 'Failed to get a response from the API' : 'Gagal mengambil respon dari API');
    }

    return data.reply || (isEn() ? "Sorry, I can't answer that question." : 'Maaf, saya tidak bisa menjawab pertanyaan itu.');
  } catch (error) {
    console.error('API Request Error:', error);
    return isEn()
      ? 'Sorry, I am having a network issue or the API server is busy. Please try again later.'
      : 'Maaf, saya sedang mengalami kendala jaringan atau server API sedang sibuk. Silakan coba lagi nanti ya.';
  }
};

export const generateVisionChatResponse = async ({ imageDataUrl, text, messages }) => {
  try {
    const response = await fetch('/api/chat-vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUrl, text, messages })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Vision API Error:', data.error);
      throw new Error(isEn() ? 'Failed to process the image' : 'Gagal memproses gambar');
    }

    return data.reply || (isEn() ? "Sorry, I can't process that image." : 'Maaf, saya tidak bisa memproses gambar itu.');
  } catch (error) {
    console.error('Vision API Request Error:', error);
    return isEn()
      ? 'Sorry, I am having a network issue or the API server is busy. Please try again later.'
      : 'Maaf, saya sedang mengalami kendala jaringan atau server API sedang sibuk. Silakan coba lagi nanti ya.';
  }
};
