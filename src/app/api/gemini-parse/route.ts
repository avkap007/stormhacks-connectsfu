import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Parse this event search query into structured filters as JSON only (no markdown): ${query}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Attempt to extract JSON if fenced
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const json = JSON.parse(cleaned);
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to parse' }, { status: 500 });
  }
}


