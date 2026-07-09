import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Edge runtime for low latency

export async function POST(request: NextRequest) {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!openaiKey && !anthropicKey) {
      return NextResponse.json(
        { error: 'AI API Key is not configured on this host. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY.' },
        { status: 500 }
      );
    }

    const { messages, telemetry } = await request.json();

    const systemPrompt = `You are the AEGIS Smart Stadium Operational AI Co-Pilot, designed for FIFA World Cup 2026 venue operations.
You reason over live telemetry data to assist organizers, security personnel, and medical responders.

Current Live Telemetry State:
- Zones: ${JSON.stringify(telemetry?.zones || [])}
- Alerts: ${JSON.stringify(telemetry?.alerts || [])}
- Incidents: ${JSON.stringify(telemetry?.incidents || [])}
- Tasks: ${JSON.stringify(telemetry?.tasks || [])}
- Transport Routes: ${JSON.stringify(telemetry?.routes || [])}

Instructions:
1. Provide actionable, concise operational commands.
2. Recommend specific tunnels, gates, or dispatch units based on live locations and crowd levels.
3. If an incident or alert is referenced, detail response times (ETA) and confidence.
4. Respond in a highly professional, military-grade operational command style.
5. Translate your response automatically to match the user's active language if requested or implied.`;

    // 1. Anthropic Claude API Route (if Anthropic key is present)
    if (anthropicKey) {
      // Map OpenAI messages role to Anthropic role
      const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          messages: anthropicMessages,
          system: systemPrompt,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!apiResponse.ok) {
        const errText = await apiResponse.text();
        return new NextResponse(errText, { status: apiResponse.status });
      }

      // Transform Anthropic SSE format into OpenAI choices/delta format for client parsing
      const transformStream = new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          const text = new TextDecoder().decode(chunk);
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                continue;
              }
              try {
                const data = JSON.parse(dataStr);
                let content = '';
                if (data.type === 'content_block_delta') {
                  content = data.delta?.text || '';
                } else if (data.type === 'message_start') {
                  content = '';
                }
                if (content) {
                  const openaiSSE = `data: ${JSON.stringify({
                    choices: [{ delta: { content } }]
                  })}\n\n`;
                  controller.enqueue(new TextEncoder().encode(openaiSSE));
                }
              } catch {
                // Ignore partial JSON parsing errors
              }
            }
          }
        }
      });

      return new NextResponse(apiResponse.body?.pipeThrough(transformStream), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // 2. OpenAI GPT-4o API Route (if OpenAI key is present)
    if (openaiKey) {
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.15,
          stream: true,
        }),
      });

      if (!apiResponse.ok) {
        const errText = await apiResponse.text();
        return new NextResponse(errText, { status: apiResponse.status });
      }

      return new NextResponse(apiResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported state' }, { status: 500 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
