import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    // Получаем не только отзыв, но и настройки владельца
    const { review, ownerName, restaurantName, ownerLang } = await req.json();
    
    // Определяем язык для перевода владельцу (по умолчанию Английский, если не выбран)
    const targetLang = ownerLang || 'English';
    
    const prompt = `
      You are an expert restaurant reputation manager.
      
      CONTEXT:
      Restaurant Name: "${restaurantName || 'Our Restaurant'}"
      Owner Name: "${ownerName || 'Management'}"
      
      TASK:
      1. Analyze the customer review.
      2. Write a professional reply in the SAME language as the review.
      3. Sign the reply with the Owner Name and Restaurant Name.
      4. Provide a translation of your reply into ${targetLang} so the owner understands what was written.

      FORMAT:
      Return the response in JSON format:
      {
        "reply": "The actual reply text in the customer's language...",
        "translation": "The translation for the owner in ${targetLang}..."
      }

      Customer Review: "${review}"
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Заставляем ИИ отвечать строго в JSON
      max_tokens: 500,
    });

    // Парсим ответ ИИ
    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}
