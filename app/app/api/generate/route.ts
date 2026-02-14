import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { review } = await req.json();
    
    const prompt = `
      Ты — профессиональный менеджер ресторана. 
      Задача: Написать ответ на отзыв гостя.
      Тон: Вежливый, эмпатичный, профессиональный. 
      Если отзыв негативный: Извинись за конкретную проблему, не оправдывайся, предложи вернуться.
      Если отзыв позитивный: Поблагодари.
      Язык: English (или тот, на котором отзыв).
      Текст отзыва: "${review}"
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
