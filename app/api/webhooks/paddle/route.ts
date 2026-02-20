import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Инициализируем Supabase с правами АДМИНА (Service Role Key)
// Это необходимо, так как запрос делает сервер Paddle, а не авторизованный юзер
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Paddle присылает события. Мы ловим успешную оплату или старт подписки
    if (body.event_type === 'transaction.completed' || body.event_type === 'subscription.activated') {
      
      // Достаем Clerk ID пользователя (мы научим фронтенд передавать его при оплате)
      const userId = body.data?.custom_data?.user_id;

      if (userId) {
        // Записываем в базу: обновляем или создаем профиль со статусом Premium = true
        const { error } = await supabaseAdmin
          .from('users')
          .upsert({ clerk_id: userId, is_premium: true });

        if (error) {
          console.error('Supabase Admin Error:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
        
        console.log(`✅ SUCCESS: User ${userId} is now PREMIUM!`);
      }
    }

    // Всегда возвращаем 200 OK, чтобы Paddle понял, что мы получили сигнал
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
