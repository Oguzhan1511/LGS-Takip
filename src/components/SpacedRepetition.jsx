import React, { useMemo } from "react";
import { RotateCcw, CheckCircle2, Clock, Calendar, AlertCircle, BookOpen, Sparkles } from "lucide-react";

export function SpacedRepetition({
  yanlislar = [],
  subjects = [],
  onTogglePekisti
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Aralıklı Tekrar Hesaplamaları
  const repetitionList = useMemo(() => {
    return yanlislar.map((y) => {
      const created = y.tarih ? new Date(y.tarih + "T00:00:00") : new Date();
      created.setHours(0, 0, 0, 0);
      const diffDays = Math.max(0, Math.floor((today - created) / (1000 * 60 * 60 * 24)));

      // Aralıklar: 1. Gün, 3. Gün, 7. Gün, 21. Gün
      let intervalStage = 1;
      let nextDueDays = 1;
      let statusText = "1. Gün Tekrarı";

      if (diffDays >= 21) {
        intervalStage = 4;
        nextDueDays = 21;
        statusText = "Kalıcı Hafıza Tekrarı (21. Gün)";
      } else if (diffDays >= 7) {
        intervalStage = 3;
        nextDueDays = 7;
        statusText = "Haftalık Kritik Tekrar (7. Gün)";
      } else if (diffDays >= 3) {
        intervalStage = 2;
        nextDueDays = 3;
        statusText = "3. Gün Pekiştirmesi";
      }

      const isDue = !y.tekrarEdildi;

      return {
        ...y,
        diffDays,
        intervalStage,
        statusText,
        isDue
      };
    });
  }, [yanlislar, today]);

  const dueToday = repetitionList.filter((r) => r.isDue);
  const completed = repetitionList.filter((r) => !r.isDue);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <RotateCcw size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Aralıklı Tekrar Motoru (Unutma Eğrisi Takvimi)
            </h3>
            <p className="text-[11px] text-slate-500">
              Hatalarınızı 1, 3, 7 ve 21 gün aralıklarla pekiştirerek kalıcı hafızaya aktarın
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
          {dueToday.length} Tekrar Bekliyor
        </span>
      </div>

      {dueToday.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span className="font-medium">
            Harika! Şu anda aralıklı tekrar sırası gelen bekleyen bir soru yok. Yeni hatalar ekledikçe sistem otomatik hatırlatacaktır.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dueToday.slice(0, 4).map((item) => {
            const subj = subjects.find((s) => s.key === item.ders) || { name: item.ders, color: "#2563EB" };

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-purple-200/70 bg-purple-50/30 flex items-center justify-between gap-3 hover:border-purple-300 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white"
                      style={{ background: subj.color }}
                    >
                      {subj.name}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      {item.statusText}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 truncate">
                    {item.konu || "Genel Konu"}
                  </div>
                  {item.soruMetni && (
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.soruMetni}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onTogglePekisti && onTogglePekisti(item.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300 hover:border-transparent transition flex items-center gap-1 flex-shrink-0 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Pekiştirdim</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
