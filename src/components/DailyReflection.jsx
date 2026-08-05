import React, { useState } from "react";
import { Smile, Flame, Meh, Moon, Check, Sparkles, Edit3 } from "lucide-react";

const MOODS = [
  { key: "super", label: "Süper Verimli", emoji: "🔥", color: "#EF4444", bg: "#FEE2E2" },
  { key: "motive", label: "İyi & Motive", emoji: "😊", color: "#10B981", bg: "#D1FAE5" },
  { key: "orta", label: "Normal / İdare Eder", emoji: "😐", color: "#F59E0B", bg: "#FEF3C7" },
  { key: "yorgun", label: "Yorgun / Zorlandım", emoji: "🥱", color: "#64748B", bg: "#F1F5F9" },
];

export function DailyReflection({
  refleksiyonlar = [],
  onSaveReflection
}) {
  const todayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = todayISO();
  const bugunkuRefleksiyon = refleksiyonlar.find((r) => r.tarih === todayStr);

  const [selectedMood, setSelectedMood] = useState(bugunkuRefleksiyon?.mod || "motive");
  const [note, setNote] = useState(bugunkuRefleksiyon?.not || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveReflection({
      tarih: todayStr,
      mod: selectedMood,
      not: note.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Günün Refleksiyonu & Koçluk Günlüğü
            </h3>
            <p className="text-[11px] text-slate-500">
              Bugün çalışmalarınız nasıl geçti? Kendinizi değerlendirin
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in">
            <Check size={12} /> Kaydedildi!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-3">
        {/* MOD SEÇİMİ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.key;
            return (
              <button
                type="button"
                key={m.key}
                onClick={() => setSelectedMood(m.key)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className="text-base">{m.emoji}</span>
                <span className="text-xs font-bold truncate">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* MİNİ NOT GİRİŞİ */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Bugün en çok neye sevindin veya nerede zorlandın? (Kısa not...)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
          />
          <button
            type="submit"
            className="btn-primary text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <Check size={14} />
            <span>Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
