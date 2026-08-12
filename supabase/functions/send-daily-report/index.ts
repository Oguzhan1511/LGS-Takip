import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabase client initialize
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users' app states (For now we assume single user or we iterate through all users)
    const { data: appStates, error } = await supabase
      .from('app_state')
      .select('*');

    if (error) {
      throw new Error(`DB Hatası: ${error.message}`);
    }

    if (!appStates || appStates.length === 0) {
      return new Response(JSON.stringify({ message: "Gönderilecek kullanıcı bulunamadı." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    let sentCount = 0;

    for (const state of appStates) {
      const profile = state.lgs_profile || {};
      const program = state.lgs_program || {};
      
      const veliTelefon = profile.veliTelefon;
      if (!veliTelefon) continue;

      // Bugünün programını çıkar
      const today = new Date();
      const gunIsimleri = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
      const gunStr = gunIsimleri[today.getDay()];
      
      const todaysTasks = program[gunStr] || [];
      
      let tamamlanan = 0;
      let toplamSoru = 0;
      let dogruSayisi = 0;
      let yanlisSayisi = 0;

      todaysTasks.forEach((t: any) => {
        toplamSoru += Number(t.hedefSoru) || 0;
        if (t.tamamlandi && t.sonuc) {
          tamamlanan += Number(t.sonuc.cozulen) || 0;
          dogruSayisi += Number(t.sonuc.dogru) || 0;
          yanlisSayisi += Number(t.sonuc.yanlis) || 0;
        }
      });

      const mesaj = `📅 *LGS Karargâhı - Günlük Veli Raporu*\n` +
                    `Öğrenci: ${profile.isim || 'Öğrenci'}\n\n` +
                    `🎯 *Bugünkü Hedef:* ${toplamSoru} Soru\n` +
                    `✍️ *Çözülen Soru:* ${tamamlanan}\n` +
                    `✅ *Doğru:* ${dogruSayisi} | ❌ *Yanlış:* ${yanlisSayisi}\n\n` +
                    `LGS'ye ${profile.hedefOkul || ''} yolunda başarılar!`;

      // Telegram API'ye Gönder
      const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      const telegramChatId = profile.veliTelefon || Deno.env.get('TELEGRAM_CHAT_ID'); 
      // Not: Şimdilik veliTelefon alanına Telegram Chat ID girildiğini varsayıyoruz.
      
      if (telegramToken && telegramChatId) {
        const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: mesaj,
                parse_mode: 'Markdown'
            })
        });
        const result = await res.json();
        console.log(`Mesaj Telegram üzerinden ${telegramChatId} ID'sine gönderildi.`, result);
        sentCount++;
      }
    }

    return new Response(JSON.stringify({ message: "Başarılı", sent: sentCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
