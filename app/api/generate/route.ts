import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

// Инициализируем OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Инициализируем Redis (Vercel сам возьмет ключи из Environment Variables)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    // ==========================================
    // 1. ЗАЩИТА ЛИМИТОВ (RATE LIMITING)
    // ==========================================
    // Получаем IP пользователя. На Vercel он всегда в заголовке x-forwarded-for
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const redisKey = `freemium_limit:${ip}`;

    // Проверяем текущее количество генераций для этого IP
    const usageCount = await redis.get<number>(redisKey) || 0;

    // Если 3 генерации исчерпаны — отбиваем запрос (Статус 403)
    if (usageCount >= 3) {
      return NextResponse.json(
        { 
          error: 'Limit reached', 
          message: 'Free generations exhausted. Please upgrade to Premium.' 
        },
        { status: 403 }
      );
    }

    // Если попытки есть — списываем 1 генерацию
    await redis.incr(redisKey);

    // ==========================================
    // 2. ГЕНЕРАЦИЯ ОТВЕТА (Твой код OpenAI)
    // ==========================================
    const { review, ownerName, restaurantName, ownerLang } = await req.json();
    const targetLang = ownerLang || 'English';
    
    const prompt = `
      You are an expert restaurant reputation manager.
      
      CONTEXT:
      Restaurant Name: "${restaurantName || 'Our Restaurant'}"
      Owner Name: "${ownerName || 'Management'}"
      
      TASK:
      1. Analyze the customer review.
      2. Translate the customer's original review into ${targetLang} so the owner fully understands the complaint.
      3. Write a professional, empathetic, and polite reply to the review in the SAME language as the original review.
      4. Sign the reply with the Owner Name and Restaurant Name.
      5. Provide a translation of your reply into ${targetLang}.

      FORMAT:
      Return strictly in JSON format:
      {
        "reviewTranslation": "Translation of the original customer review into ${targetLang}...",
        "reply": "The actual reply text in the customer's language...",
        "translation": "The translation of the reply for the owner in ${targetLang}..."
      }

      Customer Review: "${review}"
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
