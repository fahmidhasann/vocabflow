import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { UsageMap } from '@/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { word } = await req.json();

  if (!word || typeof word !== 'string') {
    return NextResponse.json({ error: 'Missing word' }, { status: 400 });
  }

  const prompt = `Generate a usage map for the English word "${word}".

Organize the word into semantic domains, and within each domain list the specific syntactic/collocational patterns with their meanings.

Respond with ONLY valid JSON in this exact format:
{
  "word": "${word}",
  "domains": [
    {
      "domain": "Domain Name",
      "patterns": [
        { "pattern": "${word} [structure]", "meaning": "what it means" }
      ]
    }
  ]
}

Rules:
- Include 2–4 domains if the word is polysemous, or 1–2 for simpler words
- Each domain should have 2–5 patterns
- Patterns show real syntactic constructions (e.g., "conceive of X", "conceive X as Y", "conceive that")
- Meanings are short and clear (5–8 words)
- Only output JSON, no markdown or explanation`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content ?? '';
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const usageMap: UsageMap = JSON.parse(text);

    return NextResponse.json(usageMap);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Usage map error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
