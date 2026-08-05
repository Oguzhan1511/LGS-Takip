import React, { useMemo } from "react";
import { Sparkles, AlertCircle, Plus, CheckCircle2, ArrowRight, BookOpen, Target } from "lucide-react";

export function SmartRecommendations({
  denemeler = [],
  program = {},
  yanlislar = [],
  konular = {},
  subjects = [],
  onAddToProgram
}) {
  // Akıllı Reçete Oluşturma Mantığı
  const recommendations = useMemo(() => {
    const list = [];

    // 1. Denemelerdeki en çok yanlış yapılan konuları tespit et
    const topicMistakeMap = {};
    denemeler.forEach((d) => {
      // Format 1: d.results[subjectKey].konular[topic]
      if (d.results) {
        Object.entries(d.results).forEach(([sKey, sData]) => {
          const konular = sData?.konular || {};
          Object.entries(konular).forEach(([topicName, val]) => {
            const yanlis = Number(val?.yanlis) || 0;
            const dogru = Number(val?.dogru) || 0;
            if (yanlis === 0 && dogru === 0) return;
            const key = `${sKey}__${topicName}`;
            if (!topicMistakeMap[key]) {
              topicMistakeMap[key] = {
                subjectKey: sKey,
                topic: topicName,
                yanlis: 0,
                dogru: 0
              };
            }
            topicMistakeMap[key].yanlis += yanlis;
            topicMistakeMap[key].dogru += dogru;
          });
        });
      }

      // Format 2: d.topicResults listesi
      (d.topicResults || []).forEach((t) => {
        if (!t.topic) return;
        const key = `${t.subjectKey || "genel"}__${t.topic}`;
        if (!topicMistakeMap[key]) {
          topicMistakeMap[key] = {
            subjectKey: t.subjectKey || "matematik",
            topic: t.topic,
            yanlis: 0,
            dogru: 0
          };
        }
        topicMistakeMap[key].yanlis += Number(t.yanlis) || 0;
        topicMistakeMap[key].dogru += Number(t.dogru) || 0;
      });
    });

    // Yanlış defterindeki konuları da dahil et
    yanlislar.forEach((y) => {
      if (!y.tekrarEdildi && y.konu) {
        const key = `${y.ders || "genel"}__${y.konu}`;
        if (!topicMistakeMap[key]) {
          topicMistakeMap[key] = {
            subjectKey: y.ders || "matematik",
            topic: y.konu,
            yanlis: 0,
            dogru: 0
          };
        }
        topicMistakeMap[key].yanlis += 1;
      }
    });

    const sortedMistakes = Object.values(topicMistakeMap)
      .sort((a, b) => b.yanlis - a.yanlis)
      .slice(0, 3);

    sortedMistakes.forEach((item) => {
      if (item.yanlis > 0) {
        const subj = subjects.find((s) => s.key === item.subjectKey) || { name: item.subjectKey, color: "#2563EB" };
        const onerilenSoru = Math.max(30, item.yanlis * 15);
        list.push({
          id: `rec_${item.subjectKey}_${item.topic}`,
          type: "hata_pekiştirme",
          dersKey: item.subjectKey,
          dersAdi: subj.name,
          color: subj.color,
          konu: item.topic,
          oneriMetni: `Son deneme ve testlerde ${item.yanlis} yanlış tespit edildi.`,
          aksiyon: `${onerilenSoru} Soru Pekiştirme Çözümü`,
          hedefSoru: onerilenSoru,
          oncelik: "Yüksek",
          badgeColor: "#EF4444"
        });
      }
    });

    // 2. Eğer henüz çok hata yoksa genel MEB kritik konu önerisi ekle
    if (list.length < 3) {
      list.push({
        id: "rec_default_1",
        type: "rutin_guclendirme",
        dersKey: "turkce",
        dersAdi: "Türkçe",
        color: "#EF4444",
        konu: "Paragrafta Anlam & Sözel Mantık",
        oneriMetni: "LGS'de en yüksek puan getiren ve hız gerektiren temel alan.",
        aksiyon: "30 Soru Günlük Paragraf Rutini",
        hedefSoru: 30,
        oncelik: "Rutin",
        badgeColor: "#2563EB"
      });
    }

    if (list.length < 3) {
      list.push({
        id: "rec_default_2",
        type: "rutin_guclendirme",
        dersKey: "matematik",
        dersAdi: "Matematik",
        color: "#2563EB",
        konu: "Çarpanlar ve Katlar (EBOB-EKOK)",
        oneriMetni: "Yeni nesil problem çözme becerisini pekiştirmek için önerilir.",
        aksiyon: "35 Yeni Nesil Soru Çözümü",
        hedefSoru: 35,
        oncelik: "Gelişim",
        badgeColor: "#10B981"
      });
    }

    return list.slice(0, 3);
  }, [denemeler, yanlislar, subjects]);

  const handleAddDirectly = (rec) => {
    if (!onAddToProgram) return;
    const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const bugun = DAYS[(new Date().getDay() + 6) % 7];
    onAddToProgram(bugun, {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ders: rec.dersKey,
      konu: rec.konu,
      hedefSoru: rec.hedefSoru || 30,
      tamamlandi: false,
      not: `Akıllı Reçete Önerisi (${rec.aksiyon})`
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Akıllı Eksik & Tekrar Motoru (Kişiselleştirilmiş Reçete)
            </h3>
            <p className="text-[11px] text-slate-500">
              Deneme hatalarınız ve çözümlerinize göre otomatik hesaplanan nokta atışı çalışma tavsiyeleri
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
          Otomatik Analiz
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white"
                  style={{ background: rec.color }}
                >
                  {rec.dersAdi}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: rec.oncelik === "Yüksek" ? "#FEE2E2" : "#EFF6FF",
                    color: rec.oncelik === "Yüksek" ? "#DC2626" : "#2563EB"
                  }}
                >
                  {rec.oncelik}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-900 line-clamp-1 mb-1" title={rec.konu}>
                {rec.konu}
              </div>

              <div className="text-[11px] text-slate-600 leading-snug mb-2">
                {rec.oneriMetni}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2 mt-auto">
              <span className="text-[11px] font-bold text-slate-800">
                🎯 {rec.aksiyon}
              </span>
              <button
                onClick={() => handleAddDirectly(rec)}
                className="btn-primary text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 flex-shrink-0 cursor-pointer"
                title="Bugünün programına görev olarak ekle"
              >
                <Plus size={13} />
                <span>Ekle</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
