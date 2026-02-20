import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 🔥 Инициализируем сервисы ВНУТРИ функции, чтобы избежать ошибки Vercel Build
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Добавляем заглушку, чтобы Next.js не ругался при компиляции
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { review, ownerName, restaurantName, ownerLang } = await req.json();
    const targetLang = ownerLang || 'English';

    // ==========================================
    // ЭТАП A: ПРОВЕРКА GOD MODE
    // ==========================================
    const isGodMode = ownerName === 'Nevid_73';

    // ==========================================
    // ЭТАП B: ПРОВЕРКА АВТОРИЗАЦИИ И ПОДПИСКИ (Clerk + Supabase)
    // ==========================================
    const { userId } = auth();
    let isPremium = false;

    if (userId) {
      const { data, error } = await supabase
        .from('users')
        .select('is_premium')
        .eq('clerk_id', userId)
        .single();
      
      if (data && data.is_premium) {
        isPremium = true;
      }
    }

    // ==========================================
    // ЭТАП C: ЗАЩИТА ЛИМИТОВ ПО IP (Для бесплатных)
    // ==========================================
    if (!isGodMode && !isPremium) {
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
    // ЭТАП D: ГЕНЕРАЦИЯ ОТВЕТА ИИ
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
    
    return NextResponse.json({ ...result, isPremium });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}
