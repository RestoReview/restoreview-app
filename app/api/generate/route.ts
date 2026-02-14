import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { review } = await req.json();
    
    // Промпт теперь на английском. 
    // Логика: Отвечать на том языке, на котором написан отзыв (Review Language).
    // Это универсально: если вставят иврит - ответит на иврите, если английский - на английском.
    const prompt = `
      You are an expert restaurant reputation manager.
      Task: Write a reply to a customer review.
      Tone: Professional, empathetic, polite, and brand-safe.
      Instructions:
      1. If the review is negative: Apologize for the specific issue, do not be defensive, offer a solution or invite them back to make it right.
      2. If the review is positive: Thank them warmly.
      3. Language: Write the response in the SAME language as the review.
      
      Customer Review: "${review}"
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
