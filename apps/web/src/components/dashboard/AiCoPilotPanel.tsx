'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { useAiCoPilot } from '@/hooks/useAiCoPilot';
import { Sparkles, Send, Radio } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function AiCoPilotPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isStreaming, streamedContent, sendMessage } = useAiCoPilot();
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamedContent]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  return (
    <>
      {/* Floating Sparkles Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <motion.div className="relative">
          {/* Pulsing ring indicator */}
          <span className="absolute inset-0 rounded-full bg-red-600/30 animate-ping" />
          <Button
            onClick={() => setIsOpen(true)}
            variant="secondary"
            className="w-14 h-14 rounded-full flex items-center justify-center p-0 shadow-[0_6px_24px_rgba(220,38,38,0.4)] cursor-pointer bg-gradient-to-r from-red-600 to-rose-600 border border-red-500 hover:scale-105 active:scale-95 transition-transform"
            magnetic={false}
            aria-label="Open AI operational co-pilot"
          >
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </Button>
        </motion.div>
      </div>

      {/* Slide-over Sheet panel */}
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="AI Operational Co-Pilot"
        side="right"
        description="Real-time stadium decision support & incident telemetry parsing."
        footer={
          <form onSubmit={handleSend} className="flex gap-2 w-full items-center">
            <input
              type="text"
              disabled={isStreaming}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crowd density, gates, or incidents..."
              className="glass-input flex-grow text-xs py-2 border-card-border/60 focus:border-secondary focus:ring-secondary/20"
              aria-label="Type your message"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!input.trim() || isStreaming}
              className="h-9 w-9 p-0 flex items-center justify-center bg-secondary"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
        }
      >
        <div className="flex flex-col gap-4 h-full">
          {/* Feed Header status */}
          <div className="flex justify-between items-center bg-secondary/5 border border-secondary/15 rounded-xl p-3 select-none">
            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-secondary animate-pulse" />
              Telemetry Feed Active
            </span>
            <span className="text-[10px] text-muted font-medium">Model: Claude 3.5 Sonnet</span>
          </div>

          {/* Messages Feed list */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={clsx(
                    'flex gap-2.5 max-w-[85%] items-start',
                    isAssistant ? 'self-start' : 'self-end flex-row-reverse'
                  )}
                >
                  <div
                    className={clsx(
                      'p-2.5 rounded-xl border leading-relaxed',
                      isAssistant
                        ? 'bg-foreground/[0.02] border-card-border/40 text-foreground'
                        : 'bg-secondary/10 border-secondary/20 text-foreground'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Render streaming content if active */}
            {isStreaming && streamedContent && (
              <div className="flex gap-2.5 max-w-[85%] items-start self-start">
                <div className="p-2.5 rounded-xl border bg-foreground/[0.02] border-card-border/40 text-foreground leading-relaxed">
                  {streamedContent}
                  <span className="animate-pulse font-bold text-secondary">█</span>
                </div>
              </div>
            )}

            <div ref={feedEndRef} />
          </div>
        </div>
      </Sheet>
    </>
  );
}
