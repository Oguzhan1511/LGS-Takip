// Gamification Logic: XP, Levels and Badges

export const LEVELS = [
  { level: 1, title: "LGS Çırağı", minXP: 0, maxXP: 250, color: "#64748B", icon: "GraduationCap" },
  { level: 2, title: "Soru Avcısı", minXP: 250, maxXP: 600, color: "#3B82F6", icon: "Target" },
  { level: 3, title: "Net Mimarı", minXP: 600, maxXP: 1200, color: "#10B981", icon: "TrendingUp" },
  { level: 4, title: "Deneme Ustası", minXP: 1200, maxXP: 2200, color: "#F59E0B", icon: "Award" },
  { level: 5, title: "Konu Fatihi", minXP: 2200, maxXP: 3600, color: "#8B5CF6", icon: "BookOpen" },
  { level: 6, title: "LGS Karargâh Komutanı", minXP: 3600, maxXP: 5500, color: "#EC4899", icon: "Shield" },
  { level: 7, title: "Fen Lisesi Adayı", minXP: 5500, maxXP: 8000, color: "#06B6D4", icon: "Zap" },
  { level: 8, title: "LGS Efsanesi & Şampiyon", minXP: 8000, maxXP: 15000, color: "#EAB308", icon: "Crown" },
];

export const BADGES = [
  {
    id: "b_erken_2027",
    title: "Erken Başlayan Öncü",
    desc: "LGS 2027 hazırlığına erken başlayarak avantaj kazandı.",
    category: "Başlangıç",
    icon: "Sparkles",
    color: "#2563EB",
    check: () => ({ unlocked: true, current: 1, max: 1 })
  },
  {
    id: "b_streak_7",
    title: "Ateş Serisi (7 Gün)",
    desc: "7 gün boyunca her gün aralıksız çalışma kaydı girdi.",
    category: "Disiplin",
    icon: "Flame",
    color: "#F59E0B",
    check: (data) => {
      const s = Number(data.streak) || 0;
      return { unlocked: s >= 7, current: Math.min(s, 7), max: 7 };
    }
  },
  {
    id: "b_soru_500",
    title: "500 Soru Kulübü",
    desc: "Sistemde toplam 500'den fazla soru çözdü.",
    category: "Soru Hacmi",
    icon: "Target",
    color: "#10B981",
    check: (data) => {
      const q = Number(data.totalQuestions) || 0;
      return { unlocked: q >= 500, current: Math.min(q, 500), max: 500 };
    }
  },
  {
    id: "b_soru_1500",
    title: "1500 Soru Canavarı",
    desc: "Toplamda 1500 soru barajını aştı.",
    category: "Soru Hacmi",
    icon: "Zap",
    color: "#8B5CF6",
    check: (data) => {
      const q = Number(data.totalQuestions) || 0;
      return { unlocked: q >= 1500, current: Math.min(q, 1500), max: 1500 };
    }
  },
  {
    id: "b_deneme_3",
    title: "Deneme Çaylağı (3 Deneme)",
    desc: "3 farklı LGS deneme sınavı sonucunu sisteme işledi.",
    category: "Deneme",
    icon: "TrendingUp",
    color: "#06B6D4",
    check: (data) => {
      const c = Number(data.denemeCount) || (data.denemeler || []).length || 0;
      return { unlocked: c >= 3, current: Math.min(c, 3), max: 3 };
    }
  },
  {
    id: "b_deneme_8",
    title: "Deneme Maratoncusu (8 Deneme)",
    desc: "8 farklı LGS deneme sınavı tamamladı.",
    category: "Deneme",
    icon: "Award",
    color: "#EC4899",
    check: (data) => {
      const c = Number(data.denemeCount) || (data.denemeler || []).length || 0;
      return { unlocked: c >= 8, current: Math.min(c, 8), max: 8 };
    }
  },
  {
    id: "b_hata_5",
    title: "Hata Avcısı (5 Pekiştirme)",
    desc: "Yanlış defterindeki en az 5 soruyu tekrar edip pekiştirdi.",
    category: "Öğrenme",
    icon: "CheckCircle2",
    color: "#10B981",
    check: (data) => {
      const p = (data.yanlislar || []).filter((y) => y.tekrarEdildi).length;
      return { unlocked: p >= 5, current: Math.min(p, 5), max: 5 };
    }
  },
  {
    id: "b_mat_15",
    title: "Matematik Yıldızı (15+ Net)",
    desc: "Bir denemede Matematik dersinden 15 veya üzeri net yaptı.",
    category: "Ders Başarısı",
    icon: "Compass",
    color: "#2563EB",
    check: (data) => {
      let maxNet = 0;
      (data.denemeler || []).forEach((d) => {
        const mat = d.results?.matematik;
        if (mat) {
          const net = Math.max(0, (Number(mat.dogru) || 0) - (Number(mat.yanlis) || 0) / 3);
          if (net > maxNet) maxNet = net;
        }
      });
      const has = maxNet >= 15;
      return { unlocked: has, current: Math.min(Math.round(maxNet), 15), max: 15 };
    }
  },
  {
    id: "b_turkce_18",
    title: "Türkçe Ustası (18+ Net)",
    desc: "Bir denemede Türkçe dersinden 18 veya üzeri net yaptı.",
    category: "Ders Başarısı",
    icon: "BookOpen",
    color: "#EF4444",
    check: (data) => {
      let maxNet = 0;
      (data.denemeler || []).forEach((d) => {
        const tr = d.results?.turkce;
        if (tr) {
          const net = Math.max(0, (Number(tr.dogru) || 0) - (Number(tr.yanlis) || 0) / 3);
          if (net > maxNet) maxNet = net;
        }
      });
      const has = maxNet >= 18;
      return { unlocked: has, current: Math.min(Math.round(maxNet), 18), max: 18 };
    }
  },
  {
    id: "b_odak_5",
    title: "Odak Ustası (5 Pomodoro)",
    desc: "En az 5 Pomodoro çalışma seansını başarıyla tamamladı.",
    category: "Odak",
    icon: "Clock",
    color: "#F59E0B",
    check: (data) => {
      const p = data.profile?.pomodoroStats?.completedSessions || 0;
      return { unlocked: p >= 5, current: Math.min(p, 5), max: 5 };
    }
  },
  {
    id: "b_kaynak_1",
    title: "Kitap Kurdu (1 Kaynak Bitti)",
    desc: "Eklediği soru bankalarından en az birini %100 tamamladı.",
    category: "Kaynak",
    icon: "Bookmark",
    color: "#8B5CF6",
    check: (data) => {
      let maxPct = 0;
      (data.kaynaklar || []).forEach((k) => {
        if (k.toplamTest > 0) {
          const pct = Math.min(100, Math.round(((Number(k.cozulenTest) || 0) / Number(k.toplamTest)) * 100));
          if (pct > maxPct) maxPct = pct;
        }
      });
      const done = maxPct >= 100;
      return { unlocked: done, current: maxPct, max: 100 };
    }
  },
  {
    id: "b_net_75",
    title: "LGS Şampiyonu (75+ Net)",
    desc: "Genel denemede 75 net barajını aştı.",
    category: "Zirve",
    icon: "Crown",
    color: "#EAB308",
    check: (data) => {
      let maxTotalNet = 0;
      (data.denemeler || []).forEach((d) => {
        const tot = Object.values(d.results || {}).reduce((acc, curr) => {
          const net = Math.max(0, (Number(curr.dogru) || 0) - (Number(curr.yanlis) || 0) / 3);
          return acc + net;
        }, 0);
        if (tot > maxTotalNet) maxTotalNet = tot;
      });
      const has = maxTotalNet >= 75;
      return { unlocked: has, current: Math.min(Math.round(maxTotalNet), 75), max: 75 };
    }
  }
];

export function calculateGamification({
  profile = {},
  denemeler = [],
  program = {},
  yanlislar = [],
  soruGecmisi = [],
  haftalikGecmis = [],
  kaynaklar = [],
  streak = 0
}) {
  // Toplam Çözülen Soru
  let totalQuestions = 0;
  let totalCorrect = 0;

  // 1. Haftalık Aktif Programdan gelen sorular
  Object.values(program || {}).forEach((dayList) => {
    (dayList || []).forEach((it) => {
      if (it.tamamlandi && it.sonuc) {
        totalQuestions += Number(it.sonuc.cozulen) || 0;
        totalCorrect += Number(it.sonuc.dogru) || 0;
      }
    });
  });

  // 2. Serbest Soru Giriş Geçmişi
  (soruGecmisi || []).forEach((e) => {
    totalQuestions += Number(e.cozulen) || 0;
    totalCorrect += Number(e.dogru) || 0;
  });

  // 3. Geçmiş Haftaların Arşivi
  (haftalikGecmis || []).forEach((w) => {
    totalQuestions += Number(w.toplamSoru) || 0;
    totalCorrect += Number(w.dogru) || 0;
  });

  // 4. Deneme Sınavlarında Çözülen Sorular (LGS Sınavı 90 Soru)
  (denemeler || []).forEach((d) => {
    if (d.results) {
      Object.values(d.results).forEach((r) => {
        const dogru = Number(r.dogru) || 0;
        const yanlis = Number(r.yanlis) || 0;
        totalQuestions += (dogru + yanlis);
        totalCorrect += dogru;
      });
    }
  });

  const denemeCount = (denemeler || []).length;
  const pekisenHata = (yanlislar || []).filter((y) => y.tekrarEdildi).length;
  const pomodoroSessions = profile?.pomodoroStats?.completedSessions || 0;

  // XP Hesabı
  // - Doğru Soru: +2 XP
  // - Deneme Sınavı: +60 XP
  // - Pekiştirilen Hata: +25 XP
  // - Pomodoro Seansı: +20 XP
  // - Seri Günü: +25 XP
  const xp = (totalCorrect * 2) +
    (denemeCount * 60) +
    (pekisenHata * 25) +
    (pomodoroSessions * 20) +
    (streak * 25) + 50; // +50 hoş geldin puanı

  // Seviye Belirleme
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
    }
  }

  const levelProgress = nextLevel
    ? Math.min(100, Math.round(((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100))
    : 100;

  const xpToNextLevel = nextLevel ? nextLevel.minXP - xp : 0;

  // Rozet Kontrolleri
  const badgeData = {
    streak,
    totalQuestions,
    denemeCount,
    denemeler,
    yanlislar,
    profile,
    kaynaklar
  };

  const badgeResults = BADGES.map((b) => {
    const res = b.check(badgeData);
    return {
      ...b,
      unlocked: res.unlocked,
      current: res.current,
      max: res.max,
      pct: res.max > 0 ? Math.round((res.current / res.max) * 100) : (res.unlocked ? 100 : 0)
    };
  });

  const unlockedCount = badgeResults.filter((b) => b.unlocked).length;

  return {
    xp,
    currentLevel,
    nextLevel,
    levelProgress,
    xpToNextLevel,
    badges: badgeResults,
    unlockedCount,
    totalBadges: BADGES.length,
    totalQuestions,
    totalCorrect
  };
}
