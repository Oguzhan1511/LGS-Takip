import React, { useState, useEffect, useMemo } from "react";
import {
  Printer, X, Award, CheckCircle2, TrendingUp, AlertTriangle,
  GraduationCap, Calendar, Clock, Target, BookOpen, Flame, Sparkles,
  Layers, CheckSquare, BarChart2, ArrowUpRight, ChevronRight, FileText, ArrowLeft,
  BookMarked, HelpCircle, Activity
} from "lucide-react";

export function VeliRaporContent({
  profile = {},
  denemeler = [],
  haftalikGecmis = [],
  program = {},
  soruGecmisi = [],
  konular = {},
  topMissedTopics = [],
  streak = 0,
  daysLeft,
  gamificationData,
  subjects = [],
  reportType = "haftalik",
  setReportType,
  customStart = "",
  customEnd = "",
  setCustomStart,
  setCustomEnd,
}) {
  const todayStr = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Hafta Başlangıç ve Bitiş Tarihini Hesapla
  const weekDateRangeStr = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date().setDate(diffToMon));
    const sunday = new Date(new Date().setDate(diffToMon + 6));
    const fmt = (d) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
    return `${fmt(monday)} - ${fmt(sunday)} ${sunday.getFullYear()}`;
  }, []);

  // Özel aralık dönem string'i
  const customDateRangeStr = useMemo(() => {
    if (!customStart || !customEnd) return "Tarih aralığı seçilmedi";
    const fmt = (s) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
    return `${fmt(customStart)} – ${fmt(customEnd)}`;
  }, [customStart, customEnd]);

  // Özel aralık geçerlilik kontrolü
  const isCustomRangeValid = useMemo(() => {
    if (!customStart || !customEnd) return false;
    return customStart <= customEnd;
  }, [customStart, customEnd]);

  // 1. HAFTALIK DERS BAZLI VE KONU BAZLI DETAYLI İSTATİSTİKLER
  const haftalikDersDetay = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.key] = {
        key: s.key,
        name: s.name,
        color: s.color,
        hedefSoru: 0,
        cozulenSoru: 0,
        dogru: 0,
        yanlis: 0,
        konularDetay: {}, // { [konuAdi]: { hedef, cozulen, dogru, yanlis } }
      };
    });

    // Programdaki günleri tara
    Object.values(program || {}).forEach((dayTasks) => {
      (dayTasks || []).forEach((t) => {
        const sKey = t.ders;
        if (map[sKey]) {
          map[sKey].hedefSoru += Number(t.hedefSoru) || 0;
          if (t.konu) {
            if (!map[sKey].konularDetay[t.konu]) {
              map[sKey].konularDetay[t.konu] = { hedef: 0, cozulen: 0, dogru: 0, yanlis: 0 };
            }
            map[sKey].konularDetay[t.konu].hedef += Number(t.hedefSoru) || 0;
          }
          if (t.tamamlandi && t.sonuc) {
            map[sKey].cozulenSoru += Number(t.sonuc.cozulen) || 0;
            map[sKey].dogru += Number(t.sonuc.dogru) || 0;
            map[sKey].yanlis += Number(t.sonuc.yanlis) || 0;
            if (t.konu) {
              if (!map[sKey].konularDetay[t.konu]) {
                map[sKey].konularDetay[t.konu] = { hedef: 0, cozulen: 0, dogru: 0, yanlis: 0 };
              }
              map[sKey].konularDetay[t.konu].cozulen += Number(t.sonuc.cozulen) || 0;
              map[sKey].konularDetay[t.konu].dogru += Number(t.sonuc.dogru) || 0;
              map[sKey].konularDetay[t.konu].yanlis += Number(t.sonuc.yanlis) || 0;
            }
          }
        }
      });
    });

    // soruGecmisi'ndeki ek soru girişlerini de dahil et
    (soruGecmisi || []).forEach((entry) => {
      const sKey = entry.ders;
      if (map[sKey] && entry.konu) {
        if (!map[sKey].konularDetay[entry.konu]) {
          map[sKey].konularDetay[entry.konu] = { hedef: 0, cozulen: 0, dogru: 0, yanlis: 0 };
        }
        map[sKey].konularDetay[entry.konu].cozulen += Number(entry.cozulen) || 0;
        map[sKey].konularDetay[entry.konu].dogru += Number(entry.dogru) || 0;
        map[sKey].konularDetay[entry.konu].yanlis += Number(entry.yanlis) || 0;
        map[sKey].cozulenSoru += Number(entry.cozulen) || 0;
        map[sKey].dogru += Number(entry.dogru) || 0;
        map[sKey].yanlis += Number(entry.yanlis) || 0;
      }
    });

    return Object.values(map).map((d) => ({
      ...d,
      konularDetay: Object.entries(d.konularDetay)
        .map(([konu, s]) => ({
          konu,
          ...s,
          bos: Math.max(0, s.cozulen - (s.dogru + s.yanlis)),
          basari: s.cozulen > 0 ? Math.round((s.dogru / s.cozulen) * 100) : 0,
        }))
        .filter((k) => k.cozulen > 0 || k.hedef > 0)
        .sort((a, b) => b.cozulen - a.cozulen),
      bos: Math.max(0, d.cozulenSoru - (d.dogru + d.yanlis)),
      basari: d.cozulenSoru > 0 ? Math.round((d.dogru / d.cozulenSoru) * 100) : 0,
      tamamlanma: d.hedefSoru > 0 ? Math.round((d.cozulenSoru / d.hedefSoru) * 100) : 0
    }));
  }, [program, subjects, soruGecmisi]);


  const haftalikToplam = useMemo(() => {
    let hedef = 0, cozulen = 0, dogru = 0, yanlis = 0;
    haftalikDersDetay.forEach((d) => {
      hedef += d.hedefSoru;
      cozulen += d.cozulenSoru;
      dogru += d.dogru;
      yanlis += d.yanlis;
    });
    return {
      hedef,
      cozulen,
      dogru,
      yanlis,
      bos: Math.max(0, cozulen - (dogru + yanlis)),
      basari: cozulen > 0 ? Math.round((dogru / cozulen) * 100) : 0,
      tamamlanma: hedef > 0 ? Math.round((cozulen / hedef) * 100) : 0
    };
  }, [haftalikDersDetay]);

  // Bu hafta girilen denemeler (Son 7 gün)
  const haftalikDenemeler = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isoLimit = sevenDaysAgo.toISOString().split("T")[0];

    const filtered = (denemeler || []).filter((d) => d.tarih >= isoLimit);
    if (filtered.length > 0) return filtered;
    // Eğer son 7 günde yoksa en son 1 denemeyi örnek olarak göster
    return (denemeler || []).slice(0, 1);
  }, [denemeler]);

  // 2. AYLIK DERS BAZLI VE HAFTALIK TREND İSTATİSTİKLERİ
  const aylikDersDetay = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.key] = {
        key: s.key,
        name: s.name,
        color: s.color,
        toplamSoru: 0,
        dogru: 0,
        yanlis: 0,
        konularDetay: {} // konu bazlı D/Y — bu haftanın verilerinden
      };
    });

    // 1) Bu haftanın programı (konu detayıyla birlikte)
    haftalikDersDetay.forEach((hd) => {
      if (map[hd.key]) {
        map[hd.key].toplamSoru += hd.cozulenSoru;
        map[hd.key].dogru += hd.dogru;
        map[hd.key].yanlis += hd.yanlis;
        // Konu detaylarını aktar
        hd.konularDetay.forEach((k) => {
          if (!map[hd.key].konularDetay[k.konu]) {
            map[hd.key].konularDetay[k.konu] = { cozulen: 0, dogru: 0, yanlis: 0 };
          }
          map[hd.key].konularDetay[k.konu].cozulen += k.cozulen;
          map[hd.key].konularDetay[k.konu].dogru += k.dogru;
          map[hd.key].konularDetay[k.konu].yanlis += k.yanlis;
        });
      }
    });

    // 2) Geçmiş arşivlenmiş son 4 hafta (konu bazlı veri yok, sadece toplam)
    (haftalikGecmis || []).slice(-4).forEach((w) => {
      subjects.forEach((s) => {
        const dersSoru = w.dersler?.[s.key] || 0;
        if (map[s.key]) {
          map[s.key].toplamSoru += dersSoru;
          const ratio = w.toplamSoru > 0 ? dersSoru / w.toplamSoru : 0;
          map[s.key].dogru += Math.round((w.dogru || 0) * ratio);
          map[s.key].yanlis += Math.round((w.yanlis || 0) * ratio);
        }
      });
    });

    // 3) Konularda 'pekisti' veya 'tekrar' olanları konularDetay'a ekle (sadece ad olarak)
    Object.entries(konular || {}).forEach(([sKey, topicMap]) => {
      if (map[sKey]) {
        Object.entries(topicMap || {}).forEach(([topic, status]) => {
          if ((status === "pekisti" || status === "tekrar") && !map[sKey].konularDetay[topic]) {
            map[sKey].konularDetay[topic] = { cozulen: 0, dogru: 0, yanlis: 0 };
          }
        });
      }
    });

    return Object.values(map).map((d) => ({
      ...d,
      konularDetay: Object.entries(d.konularDetay)
        .map(([konu, s]) => ({
          konu,
          ...s,
          bos: Math.max(0, s.cozulen - (s.dogru + s.yanlis)),
          basari: s.cozulen > 0 ? Math.round((s.dogru / s.cozulen) * 100) : 0,
        }))
        .filter((k) => k.cozulen > 0)
        .sort((a, b) => b.cozulen - a.cozulen),
      bos: Math.max(0, d.toplamSoru - (d.dogru + d.yanlis)),
      basari: d.toplamSoru > 0 ? Math.round((d.dogru / d.toplamSoru) * 100) : 0
    }));
  }, [subjects, haftalikDersDetay, haftalikGecmis, konular]);

  const aylikToplam = useMemo(() => {
    let toplamSoru = 0, dogru = 0, yanlis = 0;
    aylikDersDetay.forEach((d) => {
      toplamSoru += d.toplamSoru;
      dogru += d.dogru;
      yanlis += d.yanlis;
    });
    return {
      toplamSoru,
      dogru,
      yanlis,
      bos: Math.max(0, toplamSoru - (dogru + yanlis)),
      basari: toplamSoru > 0 ? Math.round((dogru / toplamSoru) * 100) : 0,
      haftalikOrtalama: Math.round(toplamSoru / Math.max(1, (haftalikGecmis.length + 1)))
    };
  }, [aylikDersDetay, haftalikGecmis]);

  // Aylık denemeler (Son 30 gün)
  const aylikDenemeler = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isoLimit = thirtyDaysAgo.toISOString().split("T")[0];

    const filtered = (denemeler || []).filter((d) => d.tarih >= isoLimit);
    return filtered.length > 0 ? filtered : (denemeler || []).slice(0, 4);
  }, [denemeler]);

  // Aylık Net Ortalaması
  const aylikOrtalamaNet = useMemo(() => {
    if (aylikDenemeler.length === 0) return "—";
    const total = aylikDenemeler.reduce((acc, d) => {
      const net = Object.values(d.results || {}).reduce((s, c) => {
        return s + Math.max(0, (Number(c.dogru) || 0) - (Number(c.yanlis) || 0) / 3);
      }, 0);
      return acc + net;
    }, 0);
    return (total / aylikDenemeler.length).toFixed(1);
  }, [aylikDenemeler]);

  // ─── ÖZEL ARALIK: denemeler filtresi ─────────────────────────────────────
  const ozelDenemeler = useMemo(() => {
    if (!isCustomRangeValid) return [];
    return (denemeler || []).filter(
      (d) => d.tarih >= customStart && d.tarih <= customEnd
    );
  }, [denemeler, customStart, customEnd, isCustomRangeValid]);

  // ÖZEL ARALIK: program görevleri filtresi
  const ozelDersDetay = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.key] = {
        key: s.key,
        name: s.name,
        color: s.color,
        hedefSoru: 0,
        cozulenSoru: 0,
        dogru: 0,
        yanlis: 0,
        konularDetay: {},
      };
    });

    if (isCustomRangeValid) {
      // Bu haftanın günlerini gerçek ISO tarihlerine eşle
      const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
      const now = new Date();
      const currentDay = now.getDay();
      const diffToMon = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      
      const weekDates = {};
      dayNames.forEach((d, idx) => {
        const dateObj = new Date(now.getFullYear(), now.getMonth(), diffToMon + idx);
        // ISO string formatına çevir (YYYY-MM-DD), yerel saate göre düzeltilmiş
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
        weekDates[d] = dateObj.toISOString().split("T")[0];
      });

      Object.entries(program || {}).forEach(([dayName, dayTasks]) => {
        const dateKey = weekDates[dayName];
        if (dateKey && dateKey >= customStart && dateKey <= customEnd) {
          (dayTasks || []).forEach((t) => {
            const sKey = t.ders;
            if (map[sKey]) {
              map[sKey].hedefSoru += Number(t.hedefSoru) || 0;
              if (t.konu) {
                if (!map[sKey].konularDetay[t.konu]) {
                  map[sKey].konularDetay[t.konu] = { hedef: 0, cozulen: 0, dogru: 0, yanlis: 0 };
                }
                map[sKey].konularDetay[t.konu].hedef += Number(t.hedefSoru) || 0;
              }
              if (t.tamamlandi && t.sonuc) {
                map[sKey].cozulenSoru += Number(t.sonuc.cozulen) || 0;
                map[sKey].dogru += Number(t.sonuc.dogru) || 0;
                map[sKey].yanlis += Number(t.sonuc.yanlis) || 0;
                if (t.konu) {
                  if (!map[sKey].konularDetay[t.konu]) {
                    map[sKey].konularDetay[t.konu] = { hedef: 0, cozulen: 0, dogru: 0, yanlis: 0 };
                  }
                  map[sKey].konularDetay[t.konu].cozulen += Number(t.sonuc.cozulen) || 0;
                  map[sKey].konularDetay[t.konu].dogru += Number(t.sonuc.dogru) || 0;
                  map[sKey].konularDetay[t.konu].yanlis += Number(t.sonuc.yanlis) || 0;
                }
              }
            }
          });
        }
      });


      // soruGecmisi: tarih filtresi uygulanabilen kayıtlar
      (soruGecmisi || []).forEach((entry) => {
        const sKey = entry.ders;
        // soruGecmisi'nde tarih alanı varsa filtrele, yoksa dahil etme
        if (entry.tarih && (entry.tarih < customStart || entry.tarih > customEnd)) return;
        if (map[sKey] && entry.konu && !entry.tarih) {
          // tarihi olmayan kayıtları dahil etme (özel aralık modunda belirsiz)
          return;
        }
        if (map[sKey] && entry.konu && entry.tarih) {
          if (!map[sKey].konularDetay[entry.konu]) {
            map[sKey].konularDetay[entry.konu] = { hedef: 0, cozulen: 0, dogru: 0, yanlis: 0 };
          }
          map[sKey].konularDetay[entry.konu].cozulen += Number(entry.cozulen) || 0;
          map[sKey].konularDetay[entry.konu].dogru += Number(entry.dogru) || 0;
          map[sKey].konularDetay[entry.konu].yanlis += Number(entry.yanlis) || 0;
          map[sKey].cozulenSoru += Number(entry.cozulen) || 0;
          map[sKey].dogru += Number(entry.dogru) || 0;
          map[sKey].yanlis += Number(entry.yanlis) || 0;
        }
      });

      // haftalikGecmis: arşivlenmiş geçmiş verileri dahil et (tarih aralığı kesişiyorsa)
      const parseTarih = (str, currentYear) => {
        if (!str) return null;
        const months = {
          "ocak": 0, "oca": 0, "şubat": 1, "şub": 1, "mart": 2, "mar": 2,
          "nisan": 3, "nis": 3, "mayıs": 4, "may": 4, "haziran": 5, "haz": 5,
          "temmuz": 6, "tem": 6, "ağustos": 7, "ağu": 7, "eylül": 8, "eyl": 8,
          "ekim": 9, "eki": 9, "kasım": 10, "kas": 10, "aralık": 11, "ara": 11
        };
        const words = str.toLowerCase().replace(/[^a-z0-9çğıöşü\s-]/g, "").split(/\s+/);
        const numbers = words.filter(w => !isNaN(parseInt(w))).map(w => parseInt(w));
        if (numbers.length === 0) return null;
        
        const foundMonths = words.map(w => months[w]).filter(m => m !== undefined);
        const m = foundMonths.length > 0 ? foundMonths[foundMonths.length - 1] : new Date().getMonth();
        const y = numbers.find(n => n > 2000) || currentYear;
        
        const startDay = numbers[0];
        const endDay = numbers.length > 1 && numbers[1] < 32 ? numbers[1] : startDay;
        
        let startMonth = m;
        let endMonth = m;
        if (foundMonths.length >= 2) {
          startMonth = foundMonths[0];
          endMonth = foundMonths[1];
        } else if (startDay > endDay) {
          // If days cross month boundary and only one month given, assume start is previous month
          startMonth = (m - 1 + 12) % 12;
        }
        
        const dStart = new Date(y, startMonth, startDay);
        const dEnd = new Date(y, endMonth, endDay);
        dStart.setMinutes(dStart.getMinutes() - dStart.getTimezoneOffset());
        dEnd.setMinutes(dEnd.getMinutes() - dEnd.getTimezoneOffset());
        
        return {
          start: dStart.toISOString().split("T")[0],
          end: dEnd.toISOString().split("T")[0]
        };
      };

      const cYear = new Date().getFullYear();
      (haftalikGecmis || []).forEach((w) => {
        if (!w.tarihAraligi) return;
        const parsed = parseTarih(w.tarihAraligi, cYear);
        if (!parsed) return;
        
        // Kesişim kontrolü: (w.start <= customEnd) && (w.end >= customStart)
        if (parsed.start <= customEnd && parsed.end >= customStart) {
          const s1 = new Date(parsed.start).getTime();
          const e1 = new Date(parsed.end).getTime();
          const s2 = new Date(customStart).getTime();
          const e2 = new Date(customEnd).getTime();
          
          const intersectionStart = Math.max(s1, s2);
          const intersectionEnd = Math.min(e1, e2);
          
          const intersectionDays = (intersectionEnd - intersectionStart) / (1000 * 60 * 60 * 24) + 1;
          const totalDays = (e1 - s1) / (1000 * 60 * 60 * 24) + 1;
          const overlapRatio = Math.max(0, Math.min(1, intersectionDays / Math.max(1, totalDays)));

          subjects.forEach((s) => {
            const dersSoru = w.dersler?.[s.key] || 0;
            if (map[s.key] && dersSoru > 0) {
              const allocatedDersSoru = Math.round(dersSoru * overlapRatio);
              map[s.key].cozulenSoru += allocatedDersSoru;
              
              const subjectRatio = w.toplamSoru > 0 ? dersSoru / w.toplamSoru : 0;
              map[s.key].dogru += Math.round((w.dogru || 0) * subjectRatio * overlapRatio);
              map[s.key].yanlis += Math.round((w.yanlis || 0) * subjectRatio * overlapRatio);
              map[s.key].hedefSoru += Math.round((w.hedefSoru || 0) * subjectRatio * overlapRatio);
            }
          });
        }
      });
    }

    return Object.values(map).map((d) => ({
      ...d,
      konularDetay: Object.entries(d.konularDetay)
        .map(([konu, s]) => ({
          konu,
          ...s,
          bos: Math.max(0, s.cozulen - (s.dogru + s.yanlis)),
          basari: s.cozulen > 0 ? Math.round((s.dogru / s.cozulen) * 100) : 0,
        }))
        .filter((k) => k.cozulen > 0 || k.hedef > 0)
        .sort((a, b) => b.cozulen - a.cozulen),
      bos: Math.max(0, d.cozulenSoru - (d.dogru + d.yanlis)),
      basari: d.cozulenSoru > 0 ? Math.round((d.dogru / d.cozulenSoru) * 100) : 0,
      tamamlanma: d.hedefSoru > 0 ? Math.round((d.cozulenSoru / d.hedefSoru) * 100) : 0,
    }));
  }, [program, subjects, customStart, customEnd, isCustomRangeValid, soruGecmisi, haftalikGecmis]);

  const ozelToplam = useMemo(() => {
    let hedef = 0, cozulen = 0, dogru = 0, yanlis = 0;
    ozelDersDetay.forEach((d) => {
      hedef += d.hedefSoru;
      cozulen += d.cozulenSoru;
      dogru += d.dogru;
      yanlis += d.yanlis;
    });
    return {
      hedef,
      cozulen,
      dogru,
      yanlis,
      bos: Math.max(0, cozulen - (dogru + yanlis)),
      basari: cozulen > 0 ? Math.round((dogru / cozulen) * 100) : 0,
      tamamlanma: hedef > 0 ? Math.round((cozulen / hedef) * 100) : 0,
    };
  }, [ozelDersDetay]);

  const ozelOrtalamaNet = useMemo(() => {
    if (ozelDenemeler.length === 0) return "—";
    const total = ozelDenemeler.reduce((acc, d) => {
      const net = Object.values(d.results || {}).reduce((s, c) => {
        return s + Math.max(0, (Number(c.dogru) || 0) - (Number(c.yanlis) || 0) / 3);
      }, 0);
      return acc + net;
    }, 0);
    return (total / ozelDenemeler.length).toFixed(1);
  }, [ozelDenemeler]);

  // Koçluk Yorumları
  const getCoachComment = () => {
    if (reportType === "haftalik") {
      if (haftalikToplam.cozulen === 0) {
        return "Öğrencimiz bu hafta için planlanan çalışma hedeflerine henüz soru girişi yapmamıştır. Haftalık programdaki görevlerin günlük olarak tamamlanması LGS 2027 maratonunda disiplin kazanmak için çok değerlidir.";
      }
      if (haftalikToplam.basari >= 80) {
        return `Öğrencimiz bu hafta çözdüğü ${haftalikToplam.cozulen} soruda %${haftalikToplam.basari} gibi yüksek bir doğruluk oranına ulaşmıştır. Çalışılan konulardaki kazanımlar güçlüdür. Haftalık denemelerle zaman yönetimini pekiştirmeye devam etmelidir.`;
      }
      return `Öğrencimiz bu hafta ${haftalikToplam.cozulen} soru çözerek çalışmalarını sürdürmüştür. Hata yapılan derslerde yanlış defteri tekrarlarının yapılması ve eksik tespit edilen konulara odaklanılması önerilir.`;
    } else if (reportType === "aylik") {
      if (aylikToplam.toplamSoru === 0) {
        return "Aylık gelişim takibinde henüz yeterli soru kaydı bulunmamaktadır. Düzenli soru çözümü ve deneme katılımları ile aylık net artış grafiği takip edilecektir.";
      }
      return `Öğrencimiz geride kalan 1 aylık süreçte toplam ${aylikToplam.toplamSoru} soru çözmüş ve %${aylikToplam.basari} genel başarı ortalaması yakalamıştır. Deneme sınavlarında ${aylikOrtalamaNet} net ortalamasına ulaşılmıştır. Önümüzdeki ay için hedef soru temposunun korunması ve süre yönetiminin geliştirilmesi hedeflenmektedir.`;
    } else {
      // Özel aralık
      if (!isCustomRangeValid) {
        return "Lütfen geçerli bir başlangıç ve bitiş tarihi seçin.";
      }
      if (ozelToplam.cozulen === 0 && ozelDenemeler.length === 0) {
        return `Seçilen tarih aralığında (${customDateRangeStr}) kayıtlı soru çözümü veya deneme sınavı bulunmamaktadır. Bu döneme ait veriler sisteme girilmemişse ilgili aralıktaki görev ve denemeler kaydedilmelidir.`;
      }
      return `Öğrencimiz ${customDateRangeStr} tarih aralığında toplam ${ozelToplam.cozulen} soru çözmüş ve %${ozelToplam.basari} başarı oranı yakalamıştır.${ozelDenemeler.length > 0 ? ` ${ozelDenemeler.length} deneme sınavında ${ozelOrtalamaNet} net ortalamasına ulaşmıştır.` : ""} Seçilen dönemdeki performans verileri tabloda ayrıntılı olarak görüntülenmektedir.`;
    }
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 text-slate-900 bg-white">
      
      {/* RAPOR BAŞLIĞI VE RAPOR TÜRÜ SEÇİCİSİ */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
              LGS 2027 KARARGÂHI
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
              {reportType === "haftalik" ? "📅 HAFTALIK GELİŞİM RAPORU" : reportType === "aylik" ? "🗓️ AYLIK KAPSAMLI KARNE" : "📆 ÖZEL ARALIK RAPORU"}
            </span>
            <span className="text-xs text-slate-400 font-medium">{todayStr}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            {profile.isim || "Öğrenci"} — {reportType === "haftalik" ? "Haftalık Takip Raporu" : reportType === "aylik" ? "Aylık Akademik Karne" : "Özel Aralık Raporu"}
          </h1>

          <div className="text-xs text-slate-600 mt-2 flex items-center gap-2.5 flex-wrap">
            <span>Dönem: <b className="text-slate-900">
              {reportType === "haftalik" ? weekDateRangeStr : reportType === "aylik" ? "Son 30 Günlük Süreç" : customDateRangeStr}
            </b></span>
            <span>•</span>
            <span>Hedef Okul: <b className="text-slate-900">{profile.hedefOkul || "LGS Hedef Lisesi"}</b></span>
            <span>•</span>
            <span>Hedef Net: <b className="text-slate-900">{profile.hedefNet || "85"} Net</b></span>
            <span>•</span>
            <span>LGS 2027: <b className="text-slate-900">{daysLeft ? `${daysLeft} Gün Kaldı` : "2027"}</b></span>
          </div>
        </div>

        {/* EKRANDA GÖRÜNEN SEKME BUTONLARI (YAZDIRMADA GİZLENİR) */}
        {setReportType && (
          <div className="no-print flex flex-col items-end gap-2 self-start sm:self-start">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setReportType("haftalik")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  reportType === "haftalik"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar size={14} />
                <span>Haftalık</span>
              </button>
              <button
                onClick={() => setReportType("aylik")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  reportType === "aylik"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers size={14} />
                <span>Aylık</span>
              </button>
              <button
                onClick={() => setReportType("ozel")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  reportType === "ozel"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText size={14} />
                <span>Özel Aralık</span>
              </button>
            </div>

            {/* ÖZEL ARALIK TARİH SEÇİCİLERİ */}
            {reportType === "ozel" && (
              <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 shadow-2xs animate-fade-in">
                <span className="text-[11px] font-bold text-purple-700 whitespace-nowrap">Başlangıç:</span>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart?.(e.target.value)}
                  max={customEnd || undefined}
                  className="text-xs rounded-lg border border-purple-200 bg-white px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-purple-700 whitespace-nowrap">Bitiş:</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd?.(e.target.value)}
                  min={customStart || undefined}
                  className="text-xs rounded-lg border border-purple-200 bg-white px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                />
                {!isCustomRangeValid && customStart && customEnd && (
                  <span className="text-[10px] font-bold text-rose-600">⚠ Geçersiz aralık</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>


      {/* ========================================================================= */}
      {/* 1. HAFTALIK RAPOR GÖRÜNÜMÜ                                               */}
      {/* ========================================================================= */}
      {reportType === "haftalik" && (
        <div className="animate-fade-in">
          
          {/* HAFTALIK 4 TEMEL ÖZET KARTI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                <Target size={13} className="text-blue-600" />
                Haftalık Çözülen
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-950 mt-1">
                {haftalikToplam.cozulen} <span className="text-xs font-sans font-semibold text-blue-700">/ {haftalikToplam.hedef}</span>
              </div>
              <div className="text-[11px] font-medium text-blue-700 mt-0.5">
                %{haftalikToplam.tamamlanma} Hedef Ulaşımı
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Doğru / Yanlış
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-950 mt-1">
                {haftalikToplam.dogru}D <span className="text-base text-rose-600 font-extrabold">{haftalikToplam.yanlis}Y</span>
              </div>
              <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                %{haftalikToplam.basari} Haftalık Başarı Oranı
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Flame size={13} className="text-amber-600" />
                Çalışma Serisi
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-950 mt-1">
                {streak} Gün
              </div>
              <div className="text-[11px] font-medium text-amber-700 mt-0.5">
                Aralıksız Çalışma Disiplini
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80">
              <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={13} className="text-purple-600" />
                Bu Haftaki Deneme
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-purple-950 mt-1">
                {haftalikDenemeler.length > 0 ? haftalikDenemeler.length : 0} Adet
              </div>
              <div className="text-[11px] font-medium text-purple-700 mt-0.5 truncate">
                {haftalikDenemeler.length > 0 ? haftalikDenemeler[0].isim : "Deneme girilmedi"}
              </div>
            </div>
          </div>

          {/* HAFTALIK DERS BAZLI SORU & DOĞRU/YANLIŞ DAĞILIMI */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckSquare size={16} className="text-blue-600" />
                Bu Hafta Ders & Konu Bazlı Soru Sayıları ve Başarı Oranları
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Haftalık görevler ve çözülen sorular</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 whitespace-nowrap">Ders / Konu</th>
                    <th className="py-3 px-3 text-center w-20 whitespace-nowrap">Hedef</th>
                    <th className="py-3 px-3 text-center w-24 whitespace-nowrap">Çözülen</th>
                    <th className="py-3 px-3 text-center w-16 whitespace-nowrap text-emerald-700">Doğru</th>
                    <th className="py-3 px-3 text-center w-16 whitespace-nowrap text-rose-700">Yanlış</th>
                    <th className="py-3 px-3 text-center w-14 whitespace-nowrap text-slate-500">Boş</th>
                    <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Başarı</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {haftalikDersDetay.map((d) => (
                    <React.Fragment key={d.key}>
                      {/* DERS SATIRLARI */}
                      <tr className="bg-slate-50 border-t border-slate-200">
                        <td className="py-2.5 px-4 font-extrabold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span style={{ color: d.color }}>{d.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">{d.hedefSoru}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700 bg-blue-50/40">{d.cozulenSoru}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{d.dogru}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">{d.yanlis}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">{d.bos}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${d.basari}%`, background: d.basari >= 75 ? "#10B981" : d.basari >= 50 ? "#F59E0B" : "#EF4444" }} />
                            </div>
                            <span className="font-mono font-bold text-slate-800">%{d.basari}</span>
                          </div>
                        </td>
                      </tr>
                      {/* KONU SATIRLARI */}
                      {d.konularDetay.length > 0 ? d.konularDetay.map((k) => (
                        <tr key={k.konu} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                          <td className="py-2 pl-9 pr-4 text-slate-600 flex items-center gap-1.5">
                            <span className="text-slate-300 text-[10px]">└</span>
                            <span className="text-[11px]">{k.konu}</span>
                          </td>
                          <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">{k.hedef || "—"}</td>
                          <td className="py-2 px-3 text-center font-mono text-blue-600 text-[11px]">{k.cozulen}</td>
                          <td className="py-2 px-3 text-center font-mono text-emerald-500 font-bold text-[11px]">{k.dogru}</td>
                          <td className="py-2 px-3 text-center font-mono text-rose-500 font-bold text-[11px]">{k.yanlis}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">{k.bos}</td>
                          <td className="py-2 px-3 text-center">
                            <span className={`text-[11px] font-mono font-bold ${k.basari >= 75 ? "text-emerald-600" : k.basari >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                              %{k.basari}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr className="border-t border-slate-100">
                          <td colSpan={7} className="py-1.5 pl-9 pr-4 text-[11px] text-slate-400 italic">Konu detayı yok</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
                    <td className="py-3 px-4 text-white font-extrabold">TOPLAM</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{haftalikToplam.hedef}</td>
                    <td className="py-3 px-3 text-center font-mono text-blue-300 font-extrabold">{haftalikToplam.cozulen}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400 font-extrabold">{haftalikToplam.dogru}</td>
                    <td className="py-3 px-3 text-center font-mono text-rose-400 font-extrabold">{haftalikToplam.yanlis}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{haftalikToplam.bos}</td>
                    <td className="py-3 px-3 text-center font-mono text-amber-300 font-extrabold">%{haftalikToplam.basari}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>


          {/* BU HAFTA GERÇEKLEŞEN DENEME SINAVI ANALİZİ */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                Bu Haftaki Deneme Sınavı Analizi & Soru Temposu
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Haftalık deneme netleri ve süre karnesi</span>
            </h3>

            {haftalikDenemeler.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                Bu hafta sisteme deneme sınavı kaydı yapılmamıştır. Haftada en az 1 deneme çözülmesi tavsiye edilir.
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {haftalikDenemeler.map((d) => {
                  const totNet = Object.values(d.results || {}).reduce((s, c) => {
                    return s + Math.max(0, (Number(c.dogru) || 0) - (Number(c.yanlis) || 0) / 3);
                  }, 0).toFixed(1);

                  const pace = d.sureDakika ? (d.sureDakika / 90).toFixed(2) : "1.72";

                  return (
                    <div key={d.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-200">
                        <div>
                          <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <span>{d.isim}</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                              {d.tarih}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                            <span>Sınav Süresi: <b className="text-slate-800">{d.sureDakika || 155} dk</b></span>
                            <span>•</span>
                            <span>Soru Temposu: <b className="text-blue-700 font-mono">{pace} dk/soru</b> (LGS: 1.72 dk)</span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-[11px] font-bold text-slate-500 uppercase">Toplam Net</div>
                          <div className="text-2xl font-mono font-extrabold text-blue-700">{totNet} <span className="text-sm font-sans font-normal text-slate-500">/ 90 Net</span></div>
                        </div>
                      </div>

                      {/* Ders Dağılım Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                        {subjects.map((s) => {
                          const r = d.results?.[s.key] || {};
                          const net = Math.max(0, (Number(r.dogru) || 0) - (Number(r.yanlis) || 0) / 3).toFixed(1);
                          return (
                            <div key={s.key} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                              <div className="text-[11px] font-bold truncate" style={{ color: s.color }}>{s.name}</div>
                              <div className="font-mono text-sm font-extrabold text-slate-900 mt-0.5">{net} Net</div>
                              <div className="text-[10px] text-slate-500 font-medium">{r.dogru || 0}D • {r.yanlis || 0}Y</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AYLIK KAPSAMLI RAPOR GÖRÜNÜMÜ                                         */}
      {/* ========================================================================= */}
      {reportType === "aylik" && (
        <div className="animate-fade-in">
          
          {/* AYLIK 4 TEMEL ÖZET KARTI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
              <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <Target size={13} className="text-indigo-600" />
                Aylık Toplam Soru
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo-950 mt-1">
                {aylikToplam.toplamSoru}
              </div>
              <div className="text-[11px] font-medium text-indigo-700 mt-0.5">
                Haftalık Ort: {aylikToplam.haftalikOrtalama} Soru
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Aylık Doğru / Yanlış
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-950 mt-1">
                {aylikToplam.dogru}D <span className="text-base text-rose-600 font-extrabold">{aylikToplam.yanlis}Y</span>
              </div>
              <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                %{aylikToplam.basari} Genel Başarı Oranı
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={13} className="text-blue-600" />
                Aylık Deneme Neti
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-950 mt-1">
                {aylikOrtalamaNet} <span className="text-xs font-sans font-normal text-blue-700">Net</span>
              </div>
              <div className="text-[11px] font-medium text-blue-700 mt-0.5">
                {aylikDenemeler.length} Deneme Sınavı Ortalaması
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Flame size={13} className="text-amber-600" />
                Aktif Çalışma Serisi
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-950 mt-1">
                {streak} Gün
              </div>
              <div className="text-[11px] font-medium text-amber-700 mt-0.5">
                İstikrar ve Motivasyon
              </div>
            </div>
          </div>

          {/* AYLIK DERS BAZLI SORU & KAZANIM TABLOSU */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers size={16} className="text-indigo-600" />
                Aylık Ders & Konu Bazlı Dağılım
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Son 30 günlük kümülatif ders karnesi</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 whitespace-nowrap">Ders / Konu</th>
                    <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Aylık Çözülen</th>
                    <th className="py-3 px-3 text-center w-16 whitespace-nowrap text-emerald-700">Doğru</th>
                    <th className="py-3 px-3 text-center w-16 whitespace-nowrap text-rose-700">Yanlış</th>
                    <th className="py-3 px-3 text-center w-14 whitespace-nowrap text-slate-500">Boş</th>
                    <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Genel Başarı</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {aylikDersDetay.map((d) => (
                    <React.Fragment key={d.key}>
                      {/* DERS SATIRLARI */}
                      <tr className="bg-slate-50 border-t border-slate-200">
                        <td className="py-2.5 px-4 font-extrabold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span style={{ color: d.color }}>{d.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/30">{d.toplamSoru} Soru</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{d.dogru}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">{d.yanlis}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">{d.bos}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${d.basari}%`, background: d.basari >= 75 ? "#10B981" : d.basari >= 50 ? "#F59E0B" : "#EF4444" }} />
                            </div>
                            <span className="font-mono font-bold text-slate-800">%{d.basari}</span>
                          </div>
                        </td>
                      </tr>
                      {/* KONU SATIRLARI */}
                      {d.konularDetay.length > 0 ? d.konularDetay.map((k) => (
                        <tr key={k.konu} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                          <td className="py-2 pl-9 pr-4 text-slate-600 flex items-center gap-1.5">
                            <span className="text-slate-300 text-[10px]">└</span>
                            <span className="text-[11px]">{k.konu}</span>
                          </td>
                          <td className="py-2 px-3 text-center font-mono text-indigo-600 text-[11px]">{k.cozulen}</td>
                          <td className="py-2 px-3 text-center font-mono text-emerald-500 font-bold text-[11px]">{k.dogru}</td>
                          <td className="py-2 px-3 text-center font-mono text-rose-500 font-bold text-[11px]">{k.yanlis}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">{k.bos}</td>
                          <td className="py-2 px-3 text-center">
                            <span className={`text-[11px] font-mono font-bold ${k.basari >= 75 ? "text-emerald-600" : k.basari >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                              %{k.basari}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr className="border-t border-slate-100">
                          <td colSpan={6} className="py-1.5 pl-9 pr-4 text-[11px] text-slate-400 italic">Bu haftaya ait konu detayı yok</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
                    <td className="py-3 px-4 text-white font-extrabold">GENEL TOPLAM</td>
                    <td className="py-3 px-3 text-center font-mono text-indigo-300 font-extrabold">{aylikToplam.toplamSoru}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400 font-extrabold">{aylikToplam.dogru}</td>
                    <td className="py-3 px-3 text-center font-mono text-rose-400 font-extrabold">{aylikToplam.yanlis}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{aylikToplam.bos}</td>
                    <td className="py-3 px-3 text-center font-mono text-amber-300 font-extrabold">%{aylikToplam.basari}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>


          {/* AYLIK DENEME SINAVI GELİŞİM ÇİZELGESİ */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-600" />
                Aylık Deneme Sınavları & Net Trendi
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Bu ay girilen tüm denemelerin gelişim tablosu</span>
            </h3>

            {aylikDenemeler.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                Son 30 gün içinde kaydedilmiş deneme sınavı bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-4">Deneme Adı / Yayın</th>
                      <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Tarih</th>
                      <th className="py-3 px-3 text-center w-20 whitespace-nowrap">Süre</th>
                      <th className="py-3 px-3 text-center w-20 whitespace-nowrap">Türkçe</th>
                      <th className="py-3 px-3 text-center w-24 whitespace-nowrap text-blue-700">Matematik</th>
                      <th className="py-3 px-3 text-center w-20 whitespace-nowrap text-emerald-700">Fen</th>
                      <th className="py-3 px-3 text-center w-24 whitespace-nowrap">Sosyal/Dil</th>
                      <th className="py-3 px-4 text-center w-28 whitespace-nowrap text-indigo-700 font-extrabold">Toplam Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {aylikDenemeler.map((d) => {
                      const getNet = (k) => {
                        const r = d.results?.[k];
                        if (!r) return "0";
                        return Math.max(0, (Number(r.dogru) || 0) - (Number(r.yanlis) || 0) / 3).toFixed(1);
                      };
                      const totNet = Object.values(d.results || {}).reduce((s, c) => {
                        return s + Math.max(0, (Number(c.dogru) || 0) - (Number(c.yanlis) || 0) / 3);
                      }, 0).toFixed(1);

                      return (
                        <tr key={d.id} className="hover:bg-slate-50/75 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">{d.isim}</td>
                          <td className="py-3 px-3 text-center text-slate-500">{d.tarih}</td>
                          <td className="py-3 px-3 text-center text-slate-600 font-mono">{d.sureDakika || 155} dk</td>
                          <td className="py-3 px-3 text-center font-mono">{getNet("turkce")} Net</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">{getNet("matematik")} Net</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{getNet("fen")} Net</td>
                          <td className="py-3 px-3 text-center font-mono text-slate-600">
                            {(Number(getNet("inkilap")) + Number(getNet("din")) + Number(getNet("ingilizce"))).toFixed(1)} Net
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-extrabold text-indigo-600 text-sm bg-indigo-50/30">
                            {totNet} Net
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ÖZEL ARALIK RAPOR GÖRÜNÜMÜ                                             */}
      {/* ========================================================================= */}
      {reportType === "ozel" && (
        <div className="animate-fade-in">
          {!isCustomRangeValid ? (
            <div className="my-8 p-6 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <div className="text-4xl mb-3">📆</div>
              <p className="text-sm font-bold text-purple-800 mb-1">Tarih Aralığı Seçin</p>
              <p className="text-xs text-purple-600">
                Yukarıdaki <b>Başlangıç</b> ve <b>Bitiş</b> tarih alanlarını doldurarak istediğiniz döneme ait raporu görüntüleyebilirsiniz.
              </p>
            </div>
          ) : (
            <>
              {/* ÖZEL ARALIK 4 TEMEL ÖZET KARTI */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80">
                  <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                    <Target size={13} className="text-purple-600" />
                    Dönem Çözülen
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-purple-950 mt-1">
                    {ozelToplam.cozulen} <span className="text-xs font-sans font-semibold text-purple-700">/ {ozelToplam.hedef}</span>
                  </div>
                  <div className="text-[11px] font-medium text-purple-700 mt-0.5">
                    %{ozelToplam.tamamlanma} Hedef Ulaşımı
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Doğru / Yanlış
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-950 mt-1">
                    {ozelToplam.dogru}D <span className="text-base text-rose-600 font-extrabold">{ozelToplam.yanlis}Y</span>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                    %{ozelToplam.basari} Başarı Oranı
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                  <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={13} className="text-blue-600" />
                    Dönem Deneme Neti
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-950 mt-1">
                    {ozelOrtalamaNet} <span className="text-xs font-sans font-normal text-blue-700">Net</span>
                  </div>
                  <div className="text-[11px] font-medium text-blue-700 mt-0.5">
                    {ozelDenemeler.length} Deneme Sınavı Ortalaması
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <Flame size={13} className="text-amber-600" />
                    Çalışma Serisi
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-950 mt-1">
                    {streak} Gün
                  </div>
                  <div className="text-[11px] font-medium text-amber-700 mt-0.5">
                    Aralıksız Çalışma Disiplini
                  </div>
                </div>
              </div>

              {/* ÖZEL ARALIK DERS BAZLI TABLO */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-purple-600" />
                    {customDateRangeStr} — Ders Bazlı Soru Sayıları ve Başarı Oranları
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">Program görevleri ve çözülen sorular</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-3 px-4 whitespace-nowrap">Ders / Konu</th>
                        <th className="py-3 px-3 text-center w-20 whitespace-nowrap">Hedef</th>
                        <th className="py-3 px-3 text-center w-24 whitespace-nowrap">Çözülen</th>
                        <th className="py-3 px-3 text-center w-16 whitespace-nowrap text-emerald-700">Doğru</th>
                        <th className="py-3 px-3 text-center w-16 whitespace-nowrap text-rose-700">Yanlış</th>
                        <th className="py-3 px-3 text-center w-14 whitespace-nowrap text-slate-500">Boş</th>
                        <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Başarı</th>
                      </tr>
                    </thead>
                    <tbody className="font-medium">
                      {ozelDersDetay.map((d) => (
                        <React.Fragment key={d.key}>
                          {/* DERS SATIRLARI */}
                          <tr className="bg-slate-50 border-t border-slate-200">
                            <td className="py-2.5 px-4 font-extrabold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                              <span style={{ color: d.color }}>{d.name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-600">{d.hedefSoru}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-purple-700 bg-purple-50/40">{d.cozulenSoru}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{d.dogru}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">{d.yanlis}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400">{d.bos}</td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${d.basari}%`, background: d.basari >= 75 ? "#10B981" : d.basari >= 50 ? "#F59E0B" : "#EF4444" }} />
                                </div>
                                <span className="font-mono font-bold text-slate-800">%{d.basari}</span>
                              </div>
                            </td>
                          </tr>
                          {/* KONU SATIRLARI */}
                          {d.konularDetay.length > 0 ? d.konularDetay.map((k) => (
                            <tr key={k.konu} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                              <td className="py-2 pl-9 pr-4 text-slate-600 flex items-center gap-1.5">
                                <span className="text-slate-300 text-[10px]">└</span>
                                <span className="text-[11px]">{k.konu}</span>
                              </td>
                              <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">{k.hedef || "—"}</td>
                              <td className="py-2 px-3 text-center font-mono text-purple-600 text-[11px]">{k.cozulen}</td>
                              <td className="py-2 px-3 text-center font-mono text-emerald-500 font-bold text-[11px]">{k.dogru}</td>
                              <td className="py-2 px-3 text-center font-mono text-rose-500 font-bold text-[11px]">{k.yanlis}</td>
                              <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">{k.bos}</td>
                              <td className="py-2 px-3 text-center">
                                <span className={`text-[11px] font-mono font-bold ${k.basari >= 75 ? "text-emerald-600" : k.basari >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                                  %{k.basari}
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr className="border-t border-slate-100">
                              <td colSpan={7} className="py-1.5 pl-9 pr-4 text-[11px] text-slate-400 italic">Konu detayı yok</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
                        <td className="py-3 px-4 text-white font-extrabold">TOPLAM</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-300">{ozelToplam.hedef}</td>
                        <td className="py-3 px-3 text-center font-mono text-purple-300 font-extrabold">{ozelToplam.cozulen}</td>
                        <td className="py-3 px-3 text-center font-mono text-emerald-400 font-extrabold">{ozelToplam.dogru}</td>
                        <td className="py-3 px-3 text-center font-mono text-rose-400 font-extrabold">{ozelToplam.yanlis}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">{ozelToplam.bos}</td>
                        <td className="py-3 px-3 text-center font-mono text-amber-300 font-extrabold">%{ozelToplam.basari}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>


              {/* ÖZEL ARALIK DENEMELERİ */}
              {ozelDenemeler.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-purple-600" />
                      Dönem İçinde Girilen Deneme Sınavları
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">{ozelDenemeler.length} deneme sınavı</span>
                  </h3>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                          <th className="py-3 px-4">Deneme Adı / Yayın</th>
                          <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Tarih</th>
                          <th className="py-3 px-3 text-center w-20 whitespace-nowrap">Süre</th>
                          <th className="py-3 px-3 text-center w-20 whitespace-nowrap">Türkçe</th>
                          <th className="py-3 px-3 text-center w-24 whitespace-nowrap text-blue-700">Matematik</th>
                          <th className="py-3 px-3 text-center w-20 whitespace-nowrap text-emerald-700">Fen</th>
                          <th className="py-3 px-3 text-center w-24 whitespace-nowrap">Sosyal/Dil</th>
                          <th className="py-3 px-4 text-center w-28 whitespace-nowrap text-purple-700 font-extrabold">Toplam Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {ozelDenemeler.map((d) => {
                          const getNet = (k) => {
                            const r = d.results?.[k];
                            if (!r) return "0";
                            return Math.max(0, (Number(r.dogru) || 0) - (Number(r.yanlis) || 0) / 3).toFixed(1);
                          };
                          const totNet = Object.values(d.results || {}).reduce((s, c) => {
                            return s + Math.max(0, (Number(c.dogru) || 0) - (Number(c.yanlis) || 0) / 3);
                          }, 0).toFixed(1);

                          return (
                            <tr key={d.id} className="hover:bg-slate-50/75 transition-colors">
                              <td className="py-3 px-4 font-bold text-slate-800">{d.isim}</td>
                              <td className="py-3 px-3 text-center text-slate-500">{d.tarih}</td>
                              <td className="py-3 px-3 text-center text-slate-600 font-mono">{d.sureDakika || 155} dk</td>
                              <td className="py-3 px-3 text-center font-mono">{getNet("turkce")} Net</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">{getNet("matematik")} Net</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{getNet("fen")} Net</td>
                              <td className="py-3 px-3 text-center font-mono text-slate-600">
                                {(Number(getNet("inkilap")) + Number(getNet("din")) + Number(getNet("ingilizce"))).toFixed(1)} Net
                              </td>
                              <td className="py-3 px-4 text-center font-mono font-extrabold text-purple-600 text-sm bg-purple-50/30">
                                {totNet} Net
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORTAK ALAN: ÖNCELİKLİ EKSİK KONULAR & KOÇLUK DEĞERLENDİRMESİ            */}

      {/* ========================================================================= */}

      {/* EKSİK KONU VE PEKİŞTİRME REÇETESİ */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-600" />
          Öncelikli Tekrar Edilmesi Gereken Konular (Eksik Tespiti)
        </h3>
        {topMissedTopics.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>Denemelerde ve soru çözümlerinde belirgin bir açık tespit edilmedi, çalışmalar istikrarlı ilerliyor!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topMissedTopics.slice(0, 4).map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color || "#2563EB" }} />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.topic}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{t.subject}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-800 flex-shrink-0">
                  {t.yanlis} Hata Tespit Edildi
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EĞİTİM KOÇU VE PEDAGOJİK DEĞERLENDİRME METNİ */}
      <div
        className="p-5 sm:p-6 rounded-2xl border transition shadow-2xs mb-6"
        style={{
          background: "#F8FAFC",
          borderColor: "#E2E8F0",
          borderLeftWidth: "4px",
          borderLeftColor: "#2563EB"
        }}
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <GraduationCap size={20} className="text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Eğitim Danışmanı & Koçluk Değerlendirmesi ({reportType === "haftalik" ? "Haftalık Görüş" : "Aylık Stratejik Rapor"})
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {getCoachComment()}
        </p>
      </div>

      {/* RAPOR ALTI FOOTER / RESMİ KAREKOD & İMZA ALANI */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>LGS 2027 Hazırlık & Karargâh Takip Sistemi</span>
        <span>Rapor Doğrulama No: #{Math.floor(100000 + Math.random() * 900000)}</span>
      </div>

    </div>
  );
}

// Modal Penceresi (Genel Panelden veya Butondan Açılınca)
export function VeliRaporModal({
  isOpen,
  onClose,
  ...props
}) {
  const [reportType, setReportType] = useState("haftalik");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      className="modal-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 md:p-8 flex justify-center items-start animate-fade-in"
    >
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 relative flex flex-col">
        
        {/* MODAL ÜST AKSİYON ÇUBUĞU (YAZDIRMADA GİZLENİR - EKRANDA HER ZAMAN SABİT VE GÖRÜNÜR) */}
        <div className="no-print sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30 flex-shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">
                Veli & Koç Başarı Raporu
              </div>
              <div className="text-[10px] text-slate-400">
                {reportType === "haftalik" ? "Haftalık Soru ve Deneme Karnesi" : reportType === "aylik" ? "Aylık Akademik İlerleme Özeti" : "Özel Tarih Aralığı Raporu"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md transition"
            >
              <Printer size={15} />
              <span>Yazdır / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition shadow-sm"
              title="Raporu Kapat (Esc)"
            >
              <X size={16} />
              <span>Kapat (Esc)</span>
            </button>
          </div>
        </div>


        <div className="print-page">
          <VeliRaporContent
            {...props}
            reportType={reportType}
            setReportType={setReportType}
            customStart={customStart}
            customEnd={customEnd}
            setCustomStart={setCustomStart}
            setCustomEnd={setCustomEnd}
          />
        </div>
      </div>
    </div>
  );
}

// Doğrudan Sayfa Görünümü (Sidebar'dan "Veli & Koç Raporu" sekmesine basılınca)
export function VeliRaporPage({ onBack, ...props }) {
  const [reportType, setReportType] = useState("haftalik");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* ÜST BAŞLIK VE GERİ DÖN / YAZDIRMA AKSİYONLARI */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
              title="Karargâh Paneline Geri Dön"
            >
              <ArrowLeft size={16} />
              <span>← Panoya Dön</span>
            </button>
          )}
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Printer size={20} className="text-blue-600" />
              <span>Veli & Koç Başarı Raporu</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Haftalık, aylık veya özel tarih aralığı seçerek ders bazlı soruları, analizleri ve deneme sonuçlarını A4 formatında inceleyin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => window.print()}
            className="text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md transition"
          >
            <Printer size={16} />
            <span>Yazdır / PDF Olarak Kaydet</span>
          </button>
        </div>
      </div>

      {/* RAPORUN A4 BASKI ALANI */}
      <div className="print-page bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <VeliRaporContent
          {...props}
          reportType={reportType}
          setReportType={setReportType}
          customStart={customStart}
          customEnd={customEnd}
          setCustomStart={setCustomStart}
          setCustomEnd={setCustomEnd}
        />
      </div>
    </div>
  );
}
