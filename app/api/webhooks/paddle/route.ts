import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 🔥 Инициализируем ВНУТРИ функции
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
    
    // Подключаемся с правами Админа
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();

    if (body.event_type === 'transaction.completed' || body.event_type === 'subscription.activated') {
      const userId = body.data?.custom_data?.user_id;

      if (userId) {
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

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
