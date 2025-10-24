import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { getRandomCharad } from '../data/charadPool';

const Chatbot = () => {
  // Génère ou récupère un sessionId unique persistant dans le localStorage
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('projectview-chat-session');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('projectview-chat-session', id);
    }
    return id;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [currentCharad] = useState(() => getRandomCharad());
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: currentCharad.content,
      timestamp: new Date(),
      charad: {
        id: currentCharad.id,
        type: currentCharad.type,
        content: currentCharad.content,
        category: currentCharad.category,
        difficulty: currentCharad.difficulty
      }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntroPrompt, setShowIntroPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroPrompt(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && showIntroPrompt) {
      setShowIntroPrompt(false);
    }
  }, [isOpen, showIntroPrompt]);

  // Écoute l'événement personnalisé pour ouvrir le chatbot
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);

    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('📤 Envoi du message:', inputMessage);

      const response = await fetch('https://n8n.srv800894.hstgr.cloud/webhook/chat-agenda-Bernard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
          charad: {
            id: currentCharad.id,
            type: currentCharad.type,
            content: currentCharad.content,
            category: currentCharad.category,
            difficulty: currentCharad.difficulty
          },
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            charad: msg.charad
          }))
        })
      });

      console.log('📥 Réponse reçue - Status:', response.status, 'OK:', response.ok);

      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status);
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const responseText = await response.text();
      console.log('📝 Contenu brut de la réponse:', responseText);

      // Vérifie que la réponse n'est pas vide
      if (!responseText || responseText.trim() === '') {
        console.error('❌ Réponse vide');
        throw new Error('Réponse vide du serveur');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ JSON parsé avec succès:', data);
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError, 'Contenu:', responseText);
        throw new Error('Réponse invalide du serveur');
      }

      // Gère différents formats de réponse (n8n renvoie un tableau avec output)
      let botResponseData = null;
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        botResponseData = data[0].output;
      } else if (data.response) {
        botResponseData = data.response;
      } else if (data.message) {
        botResponseData = data.message;
      } else if (data.output) {
        botResponseData = data.output;
      } else {
        botResponseData = 'Je suis désolé, je n\'ai pas pu traiter votre demande.';
      }

      // Essaye de parser en JSON pour détecter les boutons et quick replies
      let botResponse = '';
      let buttons = [];
      let quickReplies = [];
      let parsedContent = null;

      if (typeof botResponseData === 'string') {
        try {
          parsedContent = JSON.parse(botResponseData);
          if (parsedContent && typeof parsedContent === 'object') {
            botResponse = parsedContent.message || '';
            buttons = Array.isArray(parsedContent.buttons) ? parsedContent.buttons : [];
            quickReplies = Array.isArray(parsedContent.quick_replies) ? parsedContent.quick_replies : [];
          }
        } catch (e) {
          // Pas du JSON valide, traite comme du texte simple
          botResponse = botResponseData;
        }
      } else if (typeof botResponseData === 'object' && botResponseData !== null) {
        botResponse = botResponseData.message || '';
        buttons = Array.isArray(botResponseData.buttons) ? botResponseData.buttons : [];
        quickReplies = Array.isArray(botResponseData.quick_replies) ? botResponseData.quick_replies : [];
      } else {
        botResponse = String(botResponseData);
      }

      // Si pas de message, utiliser la réponse brute
      if (!botResponse) {
        botResponse = String(data);
      }

      const assistantMessage = {
        role: 'assistant',
        content: botResponse,
        buttons: buttons.length > 0 ? buttons : undefined,
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer dans quelques instants.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (replyText) => {
    setInputMessage(replyText);
    // Déclencher l'envoi du message
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const event = new Event('submit', { bubbles: true });
        form.dispatchEvent(event);
      }
    }, 0);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {showIntroPrompt && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 animate-fade-in-up">
          <div className="bg-white shadow-2xl border border-[#72B0CC]/30 rounded-2xl px-4 py-3 max-w-xs relative">
            <p className="text-sm text-gray-700 leading-relaxed pr-6 whitespace-pre-line">
              {currentCharad.content}
            </p>
            <button
              onClick={() => setShowIntroPrompt(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-[#72B0CC] transition-colors"
              aria-label="Fermer l'invitation du chat"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute -bottom-3 right-8 w-4 h-4 bg-white border-r border-b border-[#72B0CC]/30 rotate-45"></div>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-gray-700' : 'bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]'
        }`}
        aria-label="Ouvrir le chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border-2 border-[#72B0CC]/20 flex flex-col overflow-hidden min-h-0 animate-slide-up"
          style={{ maxHeight: '60vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Assistant Projectview
              </h3>
              <p className="text-white/80 text-xs">En ligne</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'w-full'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {/* Quick Replies du message assistant */}
                  {message.role === 'assistant' && message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.quickReplies.map((reply, replyIndex) => (
                        <button
                          key={replyIndex}
                          onClick={() => handleQuickReply(reply.text)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md border border-gray-300"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Boutons du message assistant */}
                  {message.role === 'assistant' && message.buttons && message.buttons.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3">
                      {message.buttons.map((button, btnIndex) => (
                        <a
                          key={btnIndex}
                          href={button.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg ${
                            button.type === 'primary'
                              ? 'bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white hover:scale-105'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105'
                          }`}
                        >
                          {button.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#72B0CC]" />
                    <span className="text-sm text-gray-600">En train d'écrire...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#72B0CC] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
