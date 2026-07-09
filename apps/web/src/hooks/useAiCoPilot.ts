'use client';

import { useState } from 'react';
import { EmergencyIncident } from '@aegis/types';
import { useAuth } from './useAuth';
import { useEventStore } from './useEventStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export function useAiCoPilot() {
  const { user } = useAuth();
  const lang = user?.preferredLanguage || 'English';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Welcome to AEGIS Co-Pilot command assistance. I monitor live stadium telemetry and assist in incident dispatching and crowd rerouting.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  // Generate a realistic FIFA stadium operational recommendation based on incident parameters
  const getRecommendationTemplate = (incident: EmergencyIncident): string => {
    const timeStr = new Date().toLocaleTimeString();

    if (lang === 'Spanish') {
      switch (incident.category) {
        case 'Medical':
          return `[COMANDO DE DESPACHO MÉDICO - ${timeStr}]
ACCIÓN RECOMENDADA: Desplegar el Equipo Médico 3 de inmediato.
RUTA: Despacho a través del Túnel VIP 2A para evitar la congestión activa en el pasillo.
ETA: 2.5 minutos.
INSTRUCCIONES: Administrar estabilización inmediata en el lugar.
CONFIDENCIA: 94% (Alta)`;
        case 'Security':
          return `[COMANDO DE REFUERZO DE SEGURIDAD - ${timeStr}]
ACCIÓN RECOMENDADA: Desplegar la Unidad de Patrulla 405 (Equipo de Seguridad B) a la Sección 104.
RUTA: Acceso a la Sección 104 por la Puerta 3 del Sector C.
ETA: 3.0 minutos.
INSTRUCCIONES: Aislar la fricción de la multitud. Monitorear cámara Block 101-105.
CONFIDENCIA: 89% (Media)`;
        case 'Crowd':
          return `[COMANDO DE ENRUTAMIENTO DE MULTITUD - ${timeStr}]
ACCIÓN RECOMENDADA: Abrir las puertas de desbordamiento Noreste.
PLAN DE ACCIÓN:
1. Actualizar pantallas de señalización digital para desviar el flujo.
2. Indicar a voluntarios bloquear el Sector Norte hacia el Este.
CONFIDENCIA: 96% (Alta)`;
        default:
          return `[ASISTENCIA OPERATIVA DEL CO-PILOTO - ${timeStr}]
ACCIÓN RECOMENDADA: Verificar parámetros del incidente con el personal de tierra.
CONFIDENCIA: 75% (Media)`;
      }
    }

    if (lang === 'Portuguese') {
      switch (incident.category) {
        case 'Medical':
          return `[COMANDO DE DESPACHO MÉDICO - ${timeStr}]
AÇÃO RECOMENDADA: Implantar a Equipe Médica 3 da Base Sul imediatamente.
ROTA: Despacho via Túnel VIP 2A para evitar o congestionamento.
ETA: 2.5 minutos.
INSTRUÇÕES: Administrar estabilização imediata no local.
CONFIDENÇA: 94% (Alta)`;
        case 'Security':
          return `[COMANDO DE REFORÇO DE SEGURANÇA - ${timeStr}]
AÇÃO RECOMENDADA: Implantar a Unidade de Patrulha 405 na Seção 104.
ROTA: Acesso à Seção 104 pelo Portão 3 do Concurso Setor C.
ETA: 3.0 minutos.
INSTRUÇÕES: Isolar fricção de multidão. Monitorar câmera local.
CONFIDENÇA: 89% (Média)`;
        case 'Crowd':
          return `[COMANDO DE DIRECIONAMENTO DE MULTIDÃO - ${timeStr}]
AÇÃO RECOMENDADA: Abrir portões de transbordo Nordeste.
CONFIDENÇA: 96% (Alta)`;
        default:
          return `[ASSISTÊNCIA OPERATIVA DO CO-PILOTO - ${timeStr}]
AÇÃO RECOMENDADA: Verificar os parâmetros do incidente.
CONFIDENÇA: 75% (Média)`;
      }
    }

    if (lang === 'Arabic') {
      switch (incident.category) {
        case 'Medical':
          return `[أمر الإرسال الطبي - ${timeStr}]
الإجراء الموصى به: نشر الفريق الطبي 3 من القاعدة الجنوبية فورًا.
المسار: الإرسال عبر النفق VIP 2A لتجنب ازدحام الممر.
الوقت المتوقع: 2.5 دقيقة.
التعليمات: تقديم الاستقرار الفوري في الموقع.
الثقة: 94% (عالية)`;
        case 'Security':
          return `[أمر تعزيز الأمن - ${timeStr}]
الإجراء الموصى به: نشر وحدة الدورية 405 إلى القسم 104.
المسار: الوصول للقسم عبر بوابة قطاع Concourse C 3.
الوقت المتوقع: 3.0 دقائق.
التعليمات: عزل احتكاك الحشود ومراقبة الكاميرا.
الثقة: 89% (متوسطة)`;
        case 'Crowd':
          return `[أمر توجيه الحشود - ${timeStr}]
الإجراء الموصى به: فتح بوابات التدفق الزائد الشمالية الشرقية.
الثقة: 96% (عالية)`;
        default:
          return `[مساعد القيادة التشغيلي - ${timeStr}]
الإجراء الموصى به: التحقق من معلمات الحادث مع الموظفين الميدانيين.
الثقة: 75% (متوسطة)`;
      }
    }

    // Default English
    switch (incident.category) {
      case 'Medical':
        return `[MEDICAL DISPATCH COMMAND - ${timeStr}]
RECOMMENDED ACTION: Deploy Medical Team 3 from South Base immediately.
ROUTE: Dispatch via VIP Tunnel 2A to bypass the active concourse queue congestion.
ETA: 2.5 minutes.
INSTRUCTIONS: Administer immediate stabilization on-site. Sec. 104 is reported to have active pedestrian flow; redirect surrounding fans to adjacent escalators to clear responders access path.
CONFIDENCE: 94% (High)`;

      case 'Security':
        return `[SECURITY REINFORCEMENT COMMAND - ${timeStr}]
RECOMMENDED ACTION: Deploy Patrol Unit 405 (Security Team B) to Section 104.
ROUTE: Access Section 104 through Concourse Sector C Gate 3.
ETA: 3.0 minutes.
INSTRUCTIONS: Isolate crowd friction. Monitor local camera feed Block 101-105. Maintain active communication with North Gate accessibility coordinators as a crowd flow redirect may affect accessibility ramps.
CONFIDENCE: 89% (Medium)`;

      case 'Crowd':
        return `[CROWD ROUTING COMMAND - ${timeStr}]
RECOMMENDED ACTION: Open North-East Overflow bypass gates.
ACTION PLAN:
1. Update digital directional signage panels to route incoming visitors to gate Sector 4.
2. Direct ground volunteers to establish physical barriers diverting queue flow from North Concourse to East tunnels.
3. Pause ticket processing at Gate 3 for 90 seconds to allow density to dissipate.
CONFIDENCE: 96% (High)`;

      default:
        return `[OPERATIONAL CO-PILOT ASSISTANCE - ${timeStr}]
RECOMMENDED ACTION: Verify incident parameters with ground staff.
INSTRUCTIONS: Dispatch general stadium stewards to investigate the reported location: "${incident.location}".
CONFIDENCE: 75% (Medium)`;
    }
  };

  // Simulates a word-by-word streaming generation
  const streamText = (text: string, callback: (chunk: string) => void, onComplete?: () => void) => {
    setIsStreaming(true);
    const words = text.split(' ');
    let currentIdx = 0;
    let currentText = '';

    const timer = setInterval(() => {
      if (currentIdx < words.length) {
        currentText += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        callback(currentText);
        currentIdx++;
      } else {
        clearInterval(timer);
        setIsStreaming(false);
        if (onComplete) onComplete();
      }
    }, 45); // ~45ms per word for premium streaming visualization
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamedContent('');

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          telemetry: {
            zones: useEventStore.getState().zones,
            alerts: useEventStore.getState().alerts,
            incidents: useEventStore.getState().incidents,
            tasks: useEventStore.getState().tasks,
            routes: useEventStore.getState().routes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const data = JSON.parse(dataStr);
                const content = data.choices?.[0]?.delta?.content || data.delta?.text || '';
                if (content) {
                  assistantText += content;
                  setStreamedContent(assistantText);
                }
              } catch {
                // Ignore partial JSON parsing errors
              }
            }
          }
        }
        
        const assistantMessage: ChatMessage = {
          id: `msg-${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: assistantText,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamedContent('');
        setIsStreaming(false);
      } else {
        throw new Error('No stream reader');
      }
    } catch (err) {
      console.warn('[AEGIS Co-Pilot] Real AI streaming failed. Falling back to local simulated response.', err);
      
      // Fallback local simulated response
      const isIncidentQuery = text.toLowerCase().includes('incident') || text.toLowerCase().includes('emergency') || text.toLowerCase().includes('medical');
      const isCrowdQuery = text.toLowerCase().includes('density') || text.toLowerCase().includes('crowd') || text.toLowerCase().includes('concourse');
      
      let responseText = "I'm analyzing the telemetry feed. Please clarify which gate or seating sector you'd like me to query.";
      if (isIncidentQuery) {
        responseText = "[AI SECURE MONITOR] I am analyzing active emergency incident logs. For Medical dispatches, I recommend routing responders through vip corridors. For security dispatches, check Section 104 camera feeds.";
      } else if (isCrowdQuery) {
        responseText = "[AI CROWD ASSISTANT] Concourse density is currently at 88% near South concession stalls. Recommend triggering overflow signage immediately to divert traffic toward East Stands.";
      }

      streamText(
        responseText,
        (chunk) => {
          setStreamedContent(chunk);
        },
        () => {
          const assistantMessage: ChatMessage = {
            id: `msg-${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setStreamedContent('');
        }
      );
    }
  };

  const getIncidentRecommendationStream = async (
    incident: EmergencyIncident,
    onChunk: (text: string) => void,
    onDone: () => void
  ) => {
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: `Generate an operational plan for the following active incident:\nCategory: ${incident.category}\nLocation: ${incident.location}\nDescription: ${incident.description}\nSeverity: ${incident.severity}` 
            }
          ],
          telemetry: {
            zones: useEventStore.getState().zones,
            alerts: useEventStore.getState().alerts,
            incidents: useEventStore.getState().incidents,
            tasks: useEventStore.getState().tasks,
            routes: useEventStore.getState().routes,
          },
        }),
      });

      if (!response.ok) throw new Error('API error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      if (reader) {
        setIsStreaming(true);
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const data = JSON.parse(dataStr);
                const content = data.choices?.[0]?.delta?.content || data.delta?.text || '';
                if (content) {
                  assistantText += content;
                  onChunk(assistantText);
                }
              } catch {
                // Ignore parsing errors
              }
            }
          }
        }
        setIsStreaming(false);
        onDone();
      } else {
        throw new Error('No reader');
      }
    } catch (err) {
      console.warn('[AEGIS Co-Pilot] Real incident recommendation streaming failed. Falling back to local template.', err);
      // Fallback local simulated response
      const text = getRecommendationTemplate(incident);
      streamText(text, onChunk, onDone);
    }
  };

  return {
    messages,
    isStreaming,
    streamedContent,
    sendMessage,
    getIncidentRecommendationStream,
  };
}
