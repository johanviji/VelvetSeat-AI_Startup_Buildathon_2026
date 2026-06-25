import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Crown, Send, Sparkles, Heart, Leaf, Scissors } from 'lucide-react';
import { supabase } from "../lib/supabase";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const promptChips = [
  'Bridal makeup under ₹5000',
  'Relaxing hair spa in Indiranagar',
  'Best balayage in Bangalore',
  'Quick haircut near Koramangala',
];

export default function AIConcierge() {
  const location = useLocation();
  const initialPrompt = location.state?.prompt || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: 'Welcome to VelvetSeat AI Concierge! I am your personal beauty advisor for Bangalore. Tell me about your perfect salon experience, and I will find the ideal match for you.',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    const query = userMessage.toLowerCase();

    const { data: salons } = await supabase
      .from("salons")
      .select("*");

    const { data: services } = await supabase
      .from("services")
      .select("*");

    if (!salons || !services)
      return "I couldn't access the salon database.";

    const scored = salons.map((salon) => {
      let score = salon.rating * 10;

      const salonServices = services.filter(
        (s) => s.salon_id === salon.id
      );

      //-----------------------------------
      // CATEGORY
      //-----------------------------------

      if (query.includes("hair")) {
        if (salonServices.some((s) => s.category === "hair"))
          score += 40;
      }

      if (query.includes("bridal") || query.includes("wedding")) {
        if (salonServices.some((s) => s.category === "bridal"))
          score += 40;
      }

      if (query.includes("skin") || query.includes("facial")) {
        if (salonServices.some((s) => s.category === "skin"))
          score += 40;
      }

      if (query.includes("nail")) {
        if (salonServices.some((s) => s.category === "nail"))
          score += 40;
      }

      //-----------------------------------
      // LOCATION
      //-----------------------------------

      if (
        salon.neighborhood &&
        query.includes(salon.neighborhood.toLowerCase())
      )
        score += 25;

      //-----------------------------------
      // BUDGET
      //-----------------------------------

      const prices = salonServices.map((s) => s.price);

      if (prices.length) {
        const avg =
          prices.reduce((a, b) => a + b, 0) /
          prices.length;

        const budget =
          query.match(/\d+/)?.[0];

        if (budget) {
          if (avg <= Number(budget))
            score += 20;
        }
      }

    return {
      salon,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3);

  let response = `✨ Based on your preferences, I found these salons for you.\n`;

  top.forEach((item) => {
    const salonServices = services
      .filter((s) => s.salon_id === item.salon.id)
      .slice(0, 3);
    response += `
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⭐ ${item.salon.name}
  📍 Location: ${item.salon.neighborhood}
  ⭐ Rating: ${item.salon.rating} ★
  💎 Why I recommend it
  ${item.salon.ai_summary}
  ✨ Popular Services
  ${salonServices
    .map((s) => `• ${s.name} — ₹${s.price}`)
    .join("\n")}
  `;
  });
  response += `
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  💬 Would you like recommendations for a different budget, location, or service?
  `;
  return response;

    
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const reply = await generateResponse(text);
      const response: Message = {
          role: "assistant",
          content: reply,
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-24">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-[#1A0A0F] border-b border-[#C9A84C]/20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-[#C9A84C]" />
            <h1 className="font-display text-xl text-[#C9A84C]">
              VelvetSeat AI Concierge
            </h1>
          </div>
          <p className="text-[#C4847A] text-sm">Your personal beauty advisor</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#C9A84C] text-[#1A0A0F] animate-slide-in-right'
                    : 'bg-[#2D1B25] text-[#F5E6C8] animate-slide-in-left'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="text-[#C9A84C] text-xs font-medium">AI</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-bounce-in">
              <div className="bg-[#2D1B25] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A0A0F] via-[#1A0A0F] to-transparent pt-6 z-40">
        <div className="max-w-3xl mx-auto px-4">
          {/* Prompt chips */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 text-sm border border-[#C4847A] text-[#C4847A] rounded-full hover:bg-[#C4847A]/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-center gap-2 bg-[#2D1B25] border border-[#C4847A]/30 rounded-full px-4 py-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your perfect salon experience..."
              className="flex-1 bg-transparent text-[#F5E6C8] placeholder-[#C4847A]/50 outline-none text-sm"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <Send className="w-5 h-5 text-[#1A0A0F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
