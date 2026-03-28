import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

// ЖЕСТКИЙ ЗАПРЕТ КЭШИРОВАНИЯ - ЭТО РЕШИТ ПРОБЛЕМУ
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. Подключаем базы 
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
    await redis.set('cron-ping', 'awake', { ex: 10 });

    // --- ПРОБУЖДЕНИЕ SUPABASE (POSTGRESQL) ---
    // Добавим count, чтобы запрос был еще легче, но гарантированно пинговал базу
    await supabase.from('users').select('*', { count: 'exact', head: true });

    console.log('✅ Cron ping successful: DBs are genuinely awake!');

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
