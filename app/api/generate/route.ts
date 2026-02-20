import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

// Инициализируем OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Инициализируем Redis для защиты лимитов
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    // Сначала получаем данные из запроса, чтобы узнать имя
    const { review, ownerName, restaurantName, ownerLang } = await req.json();
    const targetLang = ownerLang || 'English';

    // ==========================================
    // 1. ЗАЩИТА ЛИМИТОВ & GOD MODE
    // ==========================================
    const isGodMode = ownerName === 'Nevid_73';

    // Если это не фаундер, проверяем лимиты по IP
    if (!isGodMode) {
      const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const redisKey = `freemium_limit:${ip}`;

      const usageCount = await redis.get<number>(redisKey) || 0;

      if (usageCount >= 3) {
        return NextResponse.json(
          { 
            error: 'Limit reached', 
            message: 'Free generations exhausted. Please upgrade to Premium.' 
          },
          { status: 403 }
        );
      }

      await redis.incr(redisKey);
    }

    // ==========================================
    // 2. ГЕНЕРАЦИЯ ОТВЕТА (Бронебойный Промпт)
    // ==========================================
    const prompt = `
      You are an expert restaurant reputation manager.
      
      CONTEXT:
      - Restaurant Name: "${restaurantName || 'Our Restaurant'}"
      - Owner Name: "${ownerName || 'Management'}"
      - Owner's Native Language: "${targetLang}"
      
      CUSTOMER REVIEW:
      "${review}"
      
      INSTRUCTIONS:
      1. Identify the language of the CUSTOMER REVIEW.
      2. Write a professional, empathetic, and polite reply to the review. 
         CRITICAL REQUIREMENT: The "reply" MUST be written in the EXACT SAME LANGUAGE as the CUSTOMER REVIEW. Do not use the Owner's Native Language for the reply unless the customer also used it.
      3. Sign the reply with the Owner Name and Restaurant Name.
      4. Translate the original CUSTOMER REVIEW into the Owner's Native Language ("${targetLang}").
      5. Translate your generated reply into the Owner's Native Language ("${targetLang}").

      EXPECTED JSON OUTPUT FORMAT:
      {
        "reviewTranslation": "Translation of the CUSTOMER REVIEW into ${targetLang}",
        "reply": "Your professional reply written strictly in the customer's original language",
        "translation": "Translation of your reply into ${targetLang}"
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 700,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}
