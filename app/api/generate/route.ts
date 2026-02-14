import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { review, tone, businessType } = await req.json();

    const prompt = `
      Ты — опытный менеджер по репутации для ${businessType || 'ресторана'}.
      Твоя задача: Написать ответ на отзыв клиента.
      
      Отзыв клиента: "${review}"
      
      Требования к ответу:
      1. Тональность: ${tone || 'Вежливая и профессиональная'}.
      2. Если отзыв негативный: извинись, прояви эмпатию, не оправдывайся агрессивно, предложи решение.
      3. Если отзыв позитивный: поблагодари, пригласи снова.
      4. Язык ответа: English (или язык отзыва).
      5. Кратко (не более 3-4 предложений).
      
      Ответ:
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}
