import React, { useState } from "react";
import {
  Award, Sparkles, Flame, Target, Zap, TrendingUp, CheckCircle2,
  BookOpen, Clock, Bookmark, Crown, Lock, Shield, Compass, Star
} from "lucide-react";
import { LEVELS } from "../utils/gamification";

const ICON_MAP = {
  Sparkles,
  Flame,
  Target,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  Clock,
  Bookmark,
  Crown,
  Shield,
  Compass
};

export function BadgesLevel({ gamificationData }) {
  const [filter, setFilter] = useState("all"); // "all" | "unlocked" | "locked"

  if (!gamificationData) return null;

  const {
    xp,
    currentLevel,
    nextLevel,
    levelProgress,
    xpToNextLevel,
    badges = [],
    unlockedCount,
    totalBadges
  } = gamificationData;

  const filteredBadges = badges.filter((b) => {
    if (filter === "unlocked") return b.unlocked;
    if (filter === "locked") return !b.unlocked;
    return true;
  });

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      
      {/* SEVİYE & XP BANNER */}
      <div
        className="p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-700/60"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
          color: "#FFFFFF",
          boxShadow: "0 15px 35px -5px rgba(15, 23, 42, 0.3)"
        }}
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)"
              }}
            >
              <Award size={36} color="#FFFFFF" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    background: "rgba(59, 130, 246, 0.25)",
                    color: "#93C5FD",
                    border: "1px solid rgba(147, 197, 253, 0.3)"
                  }}
                >
                  SEVİYE {currentLevel.level}
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: "#BFDBFE" }}>
                  {xp} Toplam XP
                </span>
              </div>
              <h2 className="text-2xl font-display font-extrabold mt-1" style={{ color: "#FFFFFF" }}>
                {currentLevel.title}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(226, 232, 240, 0.85)" }}>
                {nextLevel
                  ? `Bir sonraki seviyeye (${nextLevel.title}) ulaşmak için ${xpToNextLevel} XP kaldı.`
                  : "Maksimum seviyeye ulaştınız, gerçek bir LGS şampiyonusunuz!"}
              </p>
            </div>
          </div>

          <div
            className="md:w-72 p-4 rounded-2xl flex-shrink-0"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)"
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: "#FFFFFF" }}>
              <span>Seviye İlerlemesi</span>
              <span className="font-mono text-blue-300 font-extrabold">%{levelProgress}</span>
            </div>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${levelProgress}%`,
                  background: "linear-gradient(90deg, #38BDF8 0%, #34D399 100%)"
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "rgba(191, 219, 254, 0.8)" }}>
              <span>{currentLevel.minXP} XP</span>
              <span>{nextLevel ? nextLevel.minXP : currentLevel.maxXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROZET FİLTRELERİ VE İSTATİSTİKLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
              filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tüm Rozetler ({totalBadges})
          </button>
          <button
            onClick={() => setFilter("unlocked")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
              filter === "unlocked" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Kazanılanlar ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter("locked")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
              filter === "locked" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Kilitli ({totalBadges - unlockedCount})
          </button>
        </div>

        <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          <span>{unlockedCount} / {totalBadges} Rozet Açıldı</span>
        </div>
      </div>

      {/* ROZETLER GRİDİ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const IconComponent = ICON_MAP[badge.icon] || Award;
          const isUnlocked = badge.unlocked;

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  : "bg-slate-50/60 border-dashed border-slate-200 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${
                      isUnlocked ? "text-white" : "bg-slate-200 text-slate-400"
                    }`}
                    style={{ background: isUnlocked ? badge.color : undefined }}
                  >
                    <IconComponent size={22} />
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isUnlocked
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600 flex items-center gap-1"
                    }`}
                  >
                    {isUnlocked ? "Kazanıldı ✓" : (
                      <>
                        <Lock size={10} />
                        Kilitli
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {badge.desc}
                </p>
              </div>

              {/* İLERLEME BARI */}
              {!isUnlocked && badge.max > 1 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span>İlerleme</span>
                    <span>{badge.current} / {badge.max}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${badge.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* XP NASIL KAZANILIR REHBERİ */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
          <Star size={15} className="text-amber-500" />
          XP & Puan Nasıl Kazanılır?
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-800">Doğru Soru</div>
            <div className="font-mono font-extrabold text-blue-600 mt-0.5">+2 XP</div>
            <div className="text-[10px] text-slate-400">Her doğru cevap</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-800">Deneme Sınavı</div>
            <div className="font-mono font-extrabold text-emerald-600 mt-0.5">+60 XP</div>
            <div className="text-[10px] text-slate-400">Her girilen deneme</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-800">Hata Pekiştirme</div>
            <div className="font-mono font-extrabold text-purple-600 mt-0.5">+25 XP</div>
            <div className="text-[10px] text-slate-400">Pekiştirilen yanlış</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-800">Pomodoro Odak</div>
            <div className="font-mono font-extrabold text-amber-600 mt-0.5">+20 XP</div>
            <div className="text-[10px] text-slate-400">Her 25 dk seans</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-800">Seri Günü</div>
            <div className="font-mono font-extrabold text-rose-600 mt-0.5">+25 XP</div>
            <div className="text-[10px] text-slate-400">Ateş serisi günü</div>
          </div>
        </div>
      </div>

    </div>
  );
}
