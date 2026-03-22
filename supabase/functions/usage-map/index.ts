import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { word } = await req.json();

  if (!word || typeof word !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing word' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  if (!groqApiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error: ${err}`);
    }

    const completion = await response.json();
    const raw: string = completion.choices[0].message.content ?? '';
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const usageMap = JSON.parse(text);

    return new Response(JSON.stringify(usageMap), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Usage map error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
