import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Yalnızca POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase credentials missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all users' app states
    const { data: appStates, error } = await supabase
      .from('app_state')
      .select('*');

    if (error) {
      throw new Error(`DB Hatası: ${error.message}`);
    }

    if (!appStates || appStates.length === 0) {
      return res.status(200).json({ message: "Gönderilecek kullanıcı bulunamadı." });
    }

    let sentCount = 0;

    for (const state of appStates) {
      const profile = state.lgs_profile || {};
      const program = state.lgs_program || {};
      
      const telegramChatId = profile.veliTelefon;
      if (!telegramChatId) continue;

      // Bugünün programını çıkar
      const today = new Date();
      const gunIsimleri = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
      const gunStr = gunIsimleri[today.getDay()];
      
      const todaysTasks = program[gunStr] || [];
      
      let tamamlanan = 0;
      let toplamSoru = 0;
      let dogruSayisi = 0;
      let yanlisSayisi = 0;

      todaysTasks.forEach((t) => {
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
      
      if (telegramToken && telegramChatId) {
        const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
        const tRes = await fetch(url, {
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
        const result = await tRes.json();
        console.log(`Mesaj Telegram üzerinden ${telegramChatId} ID'sine gönderildi.`, result);
        sentCount++;
      }
    }

    return res.status(200).json({ message: "Başarılı", sent: sentCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
