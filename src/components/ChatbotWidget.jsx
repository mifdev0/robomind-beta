import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo! Saya asisten AI Robo Mind. Ingin bertanya tentang perkembangan anak Anda atau tips stimulasi belajar hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const autoResizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const updatedHistory = [...messages, { role: 'user', text: userMsg }];
    
    // Add user message & empty assistant placeholder for real-time typing
    setMessages([...updatedHistory, { role: 'assistant', text: '', isTyping: true }]);
    setLoading(true);

    try {
      const apiMessages = updatedHistory
        .filter(m => m.text && m.text.trim())
        .map(m => ({ role: m.role, content: m.text }));
      const firstUserIdx = apiMessages.findIndex(m => m.role === 'user');
      const validMessages = firstUserIdx !== -1 ? apiMessages.slice(firstUserIdx) : apiMessages;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          messages: validMessages
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let accumulatedText = '';

      if (res.ok && res.body && (contentType.includes('text/event-stream') || contentType.includes('event-stream'))) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;
            if (trimmed === 'data: [DONE]') break;
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  accumulatedText += content;
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastIdx = newMsgs.length - 1;
                    if (lastIdx >= 0 && newMsgs[lastIdx].role === 'assistant') {
                      newMsgs[lastIdx] = {
                        ...newMsgs[lastIdx],
                        text: accumulatedText,
                        isTyping: true
                      };
                    }
                    return newMsgs;
                  });
                }
              } catch {
                // Ignore parse errors on partial JSON chunks
              }
            }
          }
        }
      }

      // If no text was accumulated (non-streaming fallback or error)
      if (!accumulatedText) {
        let fullText = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
        try {
          const data = await res.json();
          if (data.reply) fullText = data.reply;
          else if (data.error) fullText = typeof data.error === 'string' ? data.error : 'Terjadi kesalahan pada server API.';
        } catch {
          if (!res.ok) fullText = 'Maaf, koneksi terputus. Silakan coba lagi.';
        }

        // Animate fallback text char by char like typing
        for (let i = 1; i <= fullText.length; i++) {
          const slicedText = fullText.slice(0, i);
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastIdx = newMsgs.length - 1;
            if (lastIdx >= 0 && newMsgs[lastIdx].role === 'assistant') {
              newMsgs[lastIdx] = {
                ...newMsgs[lastIdx],
                text: slicedText,
                isTyping: true
              };
            }
            return newMsgs;
          });
          await new Promise(r => setTimeout(r, 12));
        }
      }
    } catch {
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (lastIdx >= 0 && newMsgs[lastIdx].role === 'assistant') {
          newMsgs[lastIdx] = {
            ...newMsgs[lastIdx],
            text: 'Maaf, koneksi terputus. Silakan coba lagi.',
            isTyping: false
          };
        }
        return newMsgs;
      });
    } finally {
      // Remove typing flag once done
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (lastIdx >= 0 && newMsgs[lastIdx].role === 'assistant') {
          newMsgs[lastIdx] = {
            ...newMsgs[lastIdx],
            isTyping: false
          };
        }
        return newMsgs;
      });
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-32px)] sm:w-80 md:w-96 max-w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="font-bold font-fredoka text-sm">Robo Assistant</h4>
                  <div className="text-xs text-primary-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="h-72 sm:h-80 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-primary-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-outfit leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 shadow-sm text-gray-700 rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' && !msg.text && msg.isTyping ? (
                      <div className="flex items-center gap-1.5 py-1 px-1">
                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                        {msg.isTyping && (
                          <span className="inline-block w-2 h-4 ml-1 bg-primary-500 rounded-xs animate-pulse align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={autoResizeTextarea}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pertanyaan Anda..." 
                  disabled={loading}
                  rows={1}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pl-4 pr-12 text-sm font-outfit focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 resize-none overflow-hidden"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-primary-500/40 transition-shadow"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;

