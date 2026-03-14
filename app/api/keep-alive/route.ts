import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

// 1. Подключаем базы (используем твои стандартные переменные окружения)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // --- ПРОБУЖДЕНИЕ UPSTASH (REDIS) ---
    // Записываем микро-ключ, который сам удалится через 10 секунд
    await redis.set('cron-ping', 'awake', { ex: 10 });

    // --- ПРОБУЖДЕНИЕ SUPABASE (POSTGRESQL) ---
    // Делаем легкий запрос. Даже если таблица 'users' пустая или называется иначе, 
    // сам факт обращения к API Supabase сбрасывает таймер "засыпания".
    await supabase.from('users').select('id').limit(1);

    console.log('✅ Cron ping successful: DBs are awake!');

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase & Upstash are alive and kicking',
      time: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Cron ping failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to wake up databases' 
    }, { status: 500 });
  }
}
