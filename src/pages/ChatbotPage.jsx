import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Send, ArrowLeft, Loader2, Paperclip, Mic, X, Image as ImageIcon, FileText, Play, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { generateChatResponse, generateVisionChatResponse } from '../services/api';
import PsikologCard, { PSIKOLOG_DATA, parsePsikologRekomendasi, cleanPsikologText } from '../components/PsikologCard';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten AI Robo Mind. Ingin bertanya tentang perkembangan kognitif anak Anda atau tips stimulasi belajar logika hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // New States for Voice & File
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const autoResizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Voice Note Handlers (Real-time Speech-to-Text) ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording -> populate input with transcript
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      const text = transcript.trim();
      if (text) {
        setInput(text);
        setTimeout(() => autoResizeTextarea(), 0);
      }
      setTranscript('');

    } else {
      // Start recording with Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Browser Anda tidak mendukung input suara. Silakan gunakan Chrome atau Edge.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') return;
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
        setTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    clearInterval(recordingIntervalRef.current);
    setRecordingTime(0);
    setTranscript('');

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // --- File Handlers ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    // Reset nilai input agar bisa memilih file yang sama lagi jika dihapus
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    setIsAttachmentMenuOpen(false);
  };

  // --- Text & File Send Handler ---
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    let fileUrl = null;
    let fileType = null;
    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
      fileType = selectedFile.type.startsWith('image/') ? 'image' : 'document';
    }

    const userMessage = { 
      role: 'user', 
      content: input.trim(),
      fileUrl,
      fileType,
      fileName: selectedFile?.name
    };

    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const apiMessages = messages.map(msg => ({ role: msg.role, content: msg.content || '[Media]' }));

    const isImage = selectedFile && selectedFile.type.startsWith('image/');

    if (isImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      const imageDataUrl = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });

      const responseText = await generateVisionChatResponse({
        imageDataUrl,
        text: input.trim(),
        messages: apiMessages
      });

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } else {
      // Text-only or document — use DeepSeek
      let textToSend = input.trim();
      if (selectedFile) {
        textToSend = `[Melampirkan file: ${selectedFile.name}]\n${textToSend}`;
      }

      const finalMessages = apiMessages.concat({ role: 'user', content: textToSend });
      const responseText = await generateChatResponse(finalMessages);

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    }

    setSelectedFile(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-outfit">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-xl text-white shadow-md shadow-primary-500/20">
                <Bot size={24} />
              </div>
              <div>
                <span className="font-fredoka text-xl font-bold text-gray-800 tracking-wide block leading-tight">
                  Robo <span className="text-primary-500">Mind</span> AI
                </span>
                <span className="text-xs text-gray-500 font-medium">Asisten Edukasi Anak</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
           <Bot size={400} />
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pb-4 scroll-smooth z-10 pr-2">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-secondary-500 text-white' : 'bg-primary-100 text-primary-600 border border-primary-200'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-3xl md:text-base text-sm leading-relaxed shadow-sm flex flex-col gap-2 ${msg.role === 'user' ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm shadow-primary-500/20' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'}`}>
                
                {/* Render Attached File */}
                {msg.fileUrl && (
                  msg.fileType === 'image' ? (
                    <div className="max-w-[200px] md:max-w-[250px] overflow-hidden rounded-2xl border border-white/20 mb-1 shadow-sm">
                      <img src={msg.fileUrl} alt="Attachment" className="w-full h-auto object-cover" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-black/10 p-3 rounded-2xl mb-1">
                      <FileText size={20} />
                      <span className="text-sm font-medium truncate max-w-[150px] md:max-w-[200px]">{msg.fileName}</span>
                    </div>
                  )
                )}

                {/* Render Voice Note */}
                {msg.isAudio && (
                  <div className="flex items-center gap-3 bg-black/10 p-2 md:pr-4 rounded-full">
                    <button className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform">
                      <Play size={14} className="ml-0.5 fill-primary-600" />
                    </button>
                    <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden w-24 md:w-32 relative">
                       <div className="absolute left-0 top-0 w-1/3 h-full bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold px-2">{formatTime(msg.duration)}</span>
                  </div>
                )}

                {/* Render Text Content */}
                {msg.content && (() => {
                  const hasRekomendasi = /REKOMENDASI PSIKOLOG:/i.test(msg.content);
                  const cleanText = hasRekomendasi ? cleanPsikologText(msg.content) : msg.content;
                  return (
                    <>
                      <div className="markdown-content">
                        <ReactMarkdown>{cleanText}</ReactMarkdown>
                      </div>
                      {hasRekomendasi && (
                        <div className="mt-3 space-y-3">
                          <p className="font-fredoka font-bold text-sm text-gray-800">Psikolog di Surakarta</p>
                          {PSIKOLOG_DATA.map((p, i) => (
                            <PsikologCard key={i} data={p} />
                          ))}
                          <p className="text-[10px] text-gray-400 leading-relaxed">Data bersumber dari HIMPSI. Mohon konfirmasi ulang jadwal praktik sebelum berkunjung.</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center bg-primary-100 text-primary-600 border border-primary-200">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-gray-100 text-gray-500 rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-primary-500" /> Mengetik balasan...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto relative">
          
          <AnimatePresence>
            {selectedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="mb-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    {selectedFile.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
                  </div>
                  <div className="truncate text-sm font-medium text-gray-700">
                    {selectedFile.name}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {isRecording ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                  <span className="text-red-600 font-bold font-outfit">{formatTime(recordingTime)}</span>
                  <span className="text-red-500/70 text-sm hidden sm:inline font-medium">Mendengarkan...</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={cancelRecording}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <button 
                    type="button"
                    onClick={toggleRecording}
                    disabled={!transcript.trim()}
                    className="w-10 h-10 md:w-11 md:h-11 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/30 transition-all"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              </div>
              {transcript && (
                <div className="mt-3 text-sm text-gray-700 bg-white/70 rounded-xl p-3 leading-relaxed border border-red-100">
                  {transcript}
                </div>
              )}
              {!transcript && (
                <div className="mt-3 text-sm text-gray-400 italic bg-white/50 rounded-xl p-3 text-center">
                  Bicaralah sekarang...
                </div>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSend}>
              <div className="relative">
                
                <div className="absolute left-1.5 md:left-2 top-1/2 -translate-y-1/2 z-20">
                  <button 
                    type="button"
                    onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>

                  <AnimatePresence>
                    {isAttachmentMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-12 left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col py-2"
                      >
                        <button 
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left text-sm text-gray-700 font-medium"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Camera size={16} />
                          </div>
                          Buka Kamera
                        </button>
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left text-sm text-gray-700 font-medium"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <ImageIcon size={16} />
                          </div>
                          Pilih File / Galeri
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx"
                />
                <input 
                  type="file" 
                  ref={cameraInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                  capture="environment"
                />

                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={autoResizeTextarea}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Ketik pesan..." 
                  rows={1}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 md:pl-14 pr-24 md:text-base text-sm font-outfit focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all shadow-inner resize-none overflow-hidden"
                />
                
                <div className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {!input.trim() && !selectedFile ? (
                    <button 
                      type="button"
                      onClick={toggleRecording}
                      className="w-10 h-10 md:w-11 md:h-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                    >
                      <Mic size={20} />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white hover:from-primary-600 hover:to-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/20 duration-200"
                    >
                      <Send size={18} className="ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}

          <div className="text-center mt-3 text-xs text-gray-400 font-outfit px-4">
            AI dapat memberikan informasi yang kurang tepat. Harap pertimbangkan dengan bijak.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
