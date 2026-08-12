import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Flame, Calendar, Target, BookOpen, ClipboardList, AlertTriangle,
  TrendingUp, Plus, Trash2, CheckCircle2, Circle, RotateCcw,
  ChevronDown, ChevronUp, GraduationCap, Clock, X, LayoutDashboard,
  NotebookPen, School, Award, Sparkles, Download, Upload, Play,
  Pause, Check, RefreshCw, BarChart2, Filter, Search, Edit3,
  HelpCircle, ArrowUpRight, CheckSquare, Layers, PieChart as PieChartIcon,
  Archive, History, TrendingDown, ArrowDownRight, Printer, FileText, Star, Zap
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell
} from "recharts";
import confetti from "canvas-confetti";

import { VeliRaporModal, VeliRaporPage } from "./components/VeliRaporModal";
import { SmartRecommendations } from "./components/SmartRecommendations";
import { KaynakTakibi } from "./components/KaynakTakibi";
import { SpacedRepetition } from "./components/SpacedRepetition";
import { BadgesLevel } from "./components/BadgesLevel";
import { DailyReflection } from "./components/DailyReflection";
import { calculateGamification } from "./utils/gamification";
import { generate1MonthMockData } from "./data/mockStudentData";
import { supabase } from "./utils/supabaseClient";

/* ---------------------------------------------------------------------- */
/* SABİTLER                                                                */
/* ---------------------------------------------------------------------- */

const COLORS = {
  paper: "#F3F6F9",
  paperLine: "#E2E8F0",
  card: "#FFFFFF",
  ink: "#0F172A",
  inkSoft: "#64748B",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#EFF6FF",
  success: "#10B981",
  warn: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

const SUBJECTS = [
  { key: "turkce", name: "Türkçe", color: "#EF4444", max: 20, katsayi: 4 },
  { key: "matematik", name: "Matematik", color: "#2563EB", max: 20, katsayi: 4 },
  { key: "fen", name: "Fen Bilimleri", color: "#10B981", max: 20, katsayi: 4 },
  { key: "inkilap", name: "İnkılap Tarihi", color: "#F59E0B", max: 10, katsayi: 1 },
  { key: "din", name: "Din Kültürü", color: "#8B5CF6", max: 10, katsayi: 1 },
  { key: "ingilizce", name: "İngilizce", color: "#06B6D4", max: 10, katsayi: 1 },
];

const DEFAULT_TOPICS = {
  turkce: [
    "Fiilimsiler",
    "Cümlenin Ögeleri",
    "Fiilde Çatı",
    "Cümle Türleri",
    "Sözcükte Anlam",
    "Cümlede Anlam",
    "Paragrafta Anlam & Yapı",
    "Metin Türleri & Söz Sanatları",
    "Noktalama İşaretleri",
    "Yazım Kuralları",
    "Anlatım Bozuklukları",
    "Sözel Mantık & Görsel Yorumlama"
  ],
  matematik: [
    "Çarpanlar ve Katlar (EBOB-EKOK)",
    "Üslü İfadeler",
    "Kareköklü İfadeler",
    "Veri Analizi",
    "Basit Olayların Olasılığı",
    "Cebirsel İfadeler ve Özdeşlikler",
    "Doğrusal Denklemler & Eğim",
    "Eşitsizlikler",
    "Üçgenler (Açı-Kenar, Kenarortay, Açıortay, Yükseklik)",
    "Eşlik ve Benzerlik",
    "Dönüşüm Geometrisi",
    "Geometrik Cisimler (Prizma, Silindir, Piramit, Koni)"
  ],
  fen: [
    "Mevsimler ve İklim",
    "DNA ve Genetik Kod (Kalıtım, Mutasyon, Modifikasyon, Biyoteknoloji)",
    "Basınç (Katı, Sıvı, Gaz Basıncı)",
    "Madde ve Endüstri (Periyodik Sistem, Kimyasal Tepkimeler, Asit-Baz, Isı)",
    "Basit Makineler (Kaldıraç, Makara, Eğik Düzlem, Çıkrık, Dişli-Kasnak)",
    "Enerji Dönüşümleri ve Çevre Bilimi (Fotosentez, Solunum, Madde Döngüleri)",
    "Elektrik Yükleri ve Elektrik Enerjisi"
  ],
  inkilap: [
    "Bir Kahraman Doğuyor (Mustafa Kemal'in Hayatı)",
    "Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar (I. Dünya Savaşı, Cemiyetler, Kongreler)",
    "Milli Bir Destan: Ya İstiklal Ya Ölüm! (Kurtuluş Savaşı Cepheleri, Lozan)",
    "Atatürkçülük ve Çağdaşlaşan Türkiye (İnkılaplar, İlkeler)",
    "Demokratikleşme Çabaları (Çok Partili Hayat Denemeleri)",
    "Atatürk Dönemi Türk Dış Politikası (Hatay, Boğazlar, Sadabat/Balkan Paktı)",
    "Atatürk'ün Ölümü ve Sonrası (II. Dünya Savaşı, Çok Partili Hayata Geçiş)"
  ],
  din: [
    "Kader İnancı (Kaza ve Kader, Evrenin Yasaları, Tevekkül, İrade)",
    "Zekât ve Sadaka (Zekât Oranları, İnfak, Sadaka-i Cariye, Maûn Suresi)",
    "Din ve Hayat (Dinin Temel Gayeleri: Can, Akıl, Mal, Nesil, Din Emniyeti)",
    "Hz. Muhammed'in Örnekliği (Merhameti, İstişareye Verdiği Önem, Hakkı Gözetmesi)",
    "Kur'an-ı Kerim ve Özellikleri (İslam Dininin Temel Kaynakları, Temel Değerler)"
  ],
  ingilizce: [
    "Friendship (Accepting/Refusing, Making Invitations)",
    "Teen Life (Daily Routines, Music/Book Preferences)",
    "In the Kitchen (Cooking Methods, Recipes, Sequencing Words)",
    "On the Phone (Phone Conversations, Making Requests)",
    "The Internet (Online Safety, Internet Habits, Expressions)",
    "Adventures (Extreme Sports, Comparing Activities)",
    "Tourism (Tourist Destinations, Weather, Sightseeing)",
    "Chores (Housework, Responsibilities, Obligations)",
    "Science (Inventions, Discoveries, Scientific Achievements)",
    "Natural Forces (Disasters, Causes, Precautionary Measures)"
  ],
};

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const REASONS = [
  "Bilgi Eksikliği",
  "Dikkatsizlik / Okuma Hatası",
  "Zaman Yetmedi",
  "Kavram Yanılgısı",
  "İşlem Hatası",
  "Soru Kökünü Yanlış Anlama"
];
const STATUS_ORDER = ["bekliyor", "tekrar", "pekisti"];
const STATUS_LABEL = { bekliyor: "Bekliyor", tekrar: "Tekrar Gerekiyor", pekisti: "Pekişti" };
const STATUS_COLOR = { bekliyor: "#94A3B8", tekrar: COLORS.warn, pekisti: COLORS.success };

const TABS = [
  { key: "dashboard", label: "Genel Panel", icon: LayoutDashboard },
  { key: "denemeler", label: "Denemeler", icon: TrendingUp },
  { key: "program", label: "Haftalık Program", icon: ClipboardList },
  { key: "konular", label: "Konular & Kitaplık", icon: BookOpen },
  { key: "yanlis", label: "Yanlış Defteri & Tekrar", icon: NotebookPen },
  { key: "rozetler", label: "Rozetler & Seviye", icon: Award },
  { key: "rapor", label: "Veli & Koç Raporu", icon: Printer },
  { key: "pomodoro", label: "Odak & Pomodoro", icon: Clock },
  { key: "hedefler", label: "Hedefler & Simülatör", icon: Target },
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

/* ---------------------------------------------------------------------- */
/* DEPOLAMA YARDIMCILARI (LOCALSTORAGE & WINDOW.STORAGE)                   */
/* ---------------------------------------------------------------------- */

async function loadKey(key, fallback) {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select(key)
      .eq('user_id', 'default_user')
      .maybeSingle();

    if (error) {
      console.error("Supabase okuma hatası:", key, error);
    }

    if (data && data[key] !== null && data[key] !== undefined) {
      // Eğer Supabase'de data boş bir obje veya array gelmişse fallback'e dönmemesi için dikkat ediyoruz
      if (Object.keys(data[key]).length === 0 && Array.isArray(data[key]) === false && typeof data[key] === 'object' && fallback !== undefined) {
          // Empty object returned from PG, it's ok.
      }
      return data[key];
    }

    // Supabase'de yoksa, eski localStorage'dan okumayı dene (Geçiş süreci)
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    const { error } = await supabase
      .from('app_state')
      .upsert({ user_id: 'default_user', [key]: value, updated_at: new Date().toISOString() });
      
    if (error) {
      console.error("Supabase yazma hatası:", key, error);
    }

    // Yedek olarak LocalStorage'a da yaz
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Kayıt hatası:", key, e);
  }
}

const defaultProfile = () => ({
  isim: "",
  hedefOkul: "Galatasaray Lisesi",
  hedefPuan: 490,
  hedefNet: 85,
  gunlukSoruHedefi: 120,
  sinavTarihi: "2027-06-06",
  netFormulu: "3", // 3 yanlış 1 doğruyu götürür (LGS Standardı)
  streakDates: [todayISO()],
  pomodoroStats: { totalMinutes: 0, completedSessions: 0 }
});

const defaultKonular = () => {
  const obj = {};
  SUBJECTS.forEach((s) => {
    obj[s.key] = {};
    (DEFAULT_TOPICS[s.key] || []).forEach((t) => (obj[s.key][t] = "bekliyor"));
  });
  return obj;
};

const defaultHaftalikGecmis = () => [
  {
    id: "w-1",
    etiket: "3 Hafta Önce",
    tarihAraligi: "14 - 20 Temmuz",
    toplamSoru: 480,
    hedefSoru: 500,
    dogru: 420,
    yanlis: 50,
    bos: 10,
    dersler: { turkce: 100, matematik: 95, fen: 120, inkilap: 55, din: 55, ingilizce: 55 }
  },
  {
    id: "w-2",
    etiket: "2 Hafta Önce",
    tarihAraligi: "21 - 27 Temmuz",
    toplamSoru: 620,
    hedefSoru: 600,
    dogru: 550,
    yanlis: 55,
    bos: 15,
    dersler: { turkce: 130, matematik: 140, fen: 150, inkilap: 65, din: 65, ingilizce: 70 }
  },
  {
    id: "w-3",
    etiket: "Geçen Hafta",
    tarihAraligi: "28 Temmuz - 3 Ağustos",
    toplamSoru: 750,
    hedefSoru: 700,
    dogru: 675,
    yanlis: 60,
    bos: 15,
    dersler: { turkce: 160, matematik: 175, fen: 185, inkilap: 75, din: 75, ingilizce: 80 }
  }
];

const defaultKaynaklar = () => [
  { id: "k1", ders: "matematik", ad: "8. Sınıf Master Matematik Soru Bankası", yayin: "Okyanus Yayıncılık", toplamTest: 45, cozulenTest: 24 },
  { id: "k2", ders: "turkce", ad: "Paragraf ve Sözel Mantık Soru Dünyası", yayin: "Hız Yayınları", toplamTest: 35, cozulenTest: 20 },
  { id: "k3", ders: "fen", ad: "Fen Bilimleri Yeni Nesil Soru Bankası", yayin: "Nitelik", toplamTest: 40, cozulenTest: 18 }
];

const defaultRefleksiyonlar = () => [
  { tarih: todayISO(), mod: "super", not: "Matematik ve Türkçe yeni nesil sorularda iyi bir odak yakaladım!" }
];

/* ---------------------------------------------------------------------- */
/* KÜÇÜK YARDIMCI BİLEŞENLER                                              */
/* ---------------------------------------------------------------------- */

function Card({ children, style, className = "", hover = false }) {
  return (
    <div
      className={`rounded-2xl p-5 ${hover ? "card-hover" : ""} ${className}`}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.paperLine}`,
        boxShadow: "0 2px 8px -2px rgba(15, 23, 42, 0.05)",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, icon: Icon, rightElement }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLORS.primaryLight }}>
            <Icon size={16} color={COLORS.primary} />
          </div>
        )}
        <h2 className="font-display text-lg font-bold" style={{ color: COLORS.ink }}>{children}</h2>
      </div>
      {rightElement}
    </div>
  );
}

function Badge({ color, children, style = {} }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold"
      style={{ background: color + "1A", color, border: `1px solid ${color}33`, ...style }}
    >
      {children}
    </span>
  );
}

function TopicStatusButton({ status, onClick }) {
  const configs = {
    bekliyor: {
      bg: "#F8FAFC",
      border: "#CBD5E1",
      color: "#475569",
      icon: <Clock size={12} className="text-slate-500" />,
      label: "Bekliyor"
    },
    tekrar: {
      bg: "#FFFBEB",
      border: "#FCD34D",
      color: "#B45309",
      icon: <RotateCcw size={12} className="text-amber-600" />,
      label: "Tekrar Gerekiyor"
    },
    pekisti: {
      bg: "#ECFDF5",
      border: "#6EE7B7",
      color: "#047857",
      icon: <CheckCircle2 size={12} className="text-emerald-600" />,
      label: "Pekişti ✓"
    }
  };

  const cfg = configs[status] || configs.bekliyor;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer hover:opacity-90"
      style={{
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color
      }}
      title="Durumu değiştirmek için tıklayın (Bekliyor → Tekrar → Pekişti)"
    >
      {cfg.icon}
      <span>{cfg.label}</span>
      <RefreshCw size={10} className="text-slate-400 group-hover:text-slate-600 transition ml-0.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 duration-300" />
    </button>
  );
}

function EmptyState({ text, action, icon: Icon }) {
  return (
    <div className="text-sm py-8 px-4 text-center rounded-2xl flex flex-col items-center justify-center gap-2" style={{ color: COLORS.inkSoft, background: COLORS.paper, border: `1px dashed ${COLORS.paperLine}` }}>
      {Icon && <Icon size={28} style={{ color: COLORS.inkSoft, opacity: 0.6 }} />}
      <div>{text}</div>
      {action}
    </div>
  );
}

function TinyInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition ${props.className || ""}`}
      style={{
        border: `1px solid ${COLORS.paperLine}`,
        color: COLORS.ink,
        background: "#FFFFFF",
        ...props.style
      }}
    />
  );
}

function TinySelect({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-xl px-3 py-2 text-sm outline-none cursor-pointer"
      style={{
        border: `1px solid ${COLORS.paperLine}`,
        color: COLORS.ink,
        background: "#FFFFFF",
        ...props.style
      }}
    >
      {children}
    </select>
  );
}

function Stepper({ label, color, value, onDec, onInc }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0 bg-white px-1.5 py-1 rounded-lg" style={{ border: `1px solid ${COLORS.paperLine}` }}>
      <span className="text-[11px] font-bold w-3 text-center" style={{ color }}>{label}</span>
      <button
        type="button"
        onClick={onDec}
        disabled={!value}
        className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold disabled:opacity-30 cursor-pointer"
        style={{ background: color + "15", color }}
      >
        −
      </button>
      <span className="w-5 text-center text-xs font-mono font-bold" style={{ color: COLORS.ink }}>{value || 0}</span>
      <button
        type="button"
        onClick={onInc}
        className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer"
        style={{ background: color + "15", color }}
      >
        +
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* HESAPLAMA & BİRLEŞİK İSTATİSTİK MOTORU                                 */
/* ---------------------------------------------------------------------- */

function subjectNet(deneme, key, formula = "3") {
  const r = deneme.results?.[key];
  if (!r) return 0;
  const d = Number(r.dogru) || 0;
  const y = Number(r.yanlis) || 0;
  const penalty = formula === "4" ? 4 : 3;
  return Math.max(0, d - y / penalty);
}

function totalNet(deneme, formula = "3") {
  return SUBJECTS.reduce((sum, s) => sum + subjectNet(deneme, s.key, formula), 0);
}

function emptyResults() {
  return Object.fromEntries(SUBJECTS.map((s) => [s.key, { dogru: "", yanlis: "", bos: "", konular: {} }]));
}

function topicStats(denemeler) {
  const map = {};
  denemeler.forEach((d) => {
    SUBJECTS.forEach((s) => {
      const konular = d.results?.[s.key]?.konular || {};
      Object.entries(konular).forEach(([topic, val]) => {
        const dogru = Number(val?.dogru) || 0;
        const yanlis = Number(val?.yanlis) || 0;
        if (dogru === 0 && yanlis === 0) return;
        const key = s.key + "||" + topic;
        if (!map[key]) map[key] = { subject: s.name, subjectKey: s.key, color: s.color, topic, dogru: 0, yanlis: 0 };
        map[key].dogru += dogru;
        map[key].yanlis += yanlis;
      });
    });
  });
  return Object.values(map);
}

// Bir konunun Soru Bankası (Program + Soru Geçmişi), Deneme ve Yanlış Defteri verilerini birleştirir
function getTopicAggregatedStats(subjectKey, topicName, program, denemeler, yanlislar, soruGecmisi = []) {
  // 1. Soru Bankası / Program
  let sbCozulen = 0, sbDogru = 0, sbYanlis = 0;
  
  Object.values(program || {}).forEach((dayItems) => {
    (dayItems || []).forEach((it) => {
      if (it.ders === subjectKey && it.konu === topicName && it.tamamlandi && it.sonuc) {
        sbCozulen += Number(it.sonuc.cozulen) || 0;
        sbDogru += Number(it.sonuc.dogru) || 0;
        sbYanlis += Number(it.sonuc.yanlis) || 0;
      }
    });
  });

  (soruGecmisi || []).forEach((entry) => {
    if (entry.ders === subjectKey && entry.konu === topicName) {
      sbCozulen += Number(entry.cozulen) || 0;
      sbDogru += Number(entry.dogru) || 0;
      sbYanlis += Number(entry.yanlis) || 0;
    }
  });

  // 2. Denemeler
  let denemeDogru = 0, denemeYanlis = 0;
  (denemeler || []).forEach((d) => {
    const val = d.results?.[subjectKey]?.konular?.[topicName];
    if (val) {
      denemeDogru += Number(val.dogru) || 0;
      denemeYanlis += Number(val.yanlis) || 0;
    }
  });
  const denemeToplam = denemeDogru + denemeYanlis;

  // 3. Yanlış Defteri
  const topicYanlislar = (yanlislar || []).filter((y) => y.ders === subjectKey && y.konu === topicName);
  const yanlisSayisi = topicYanlislar.length;
  const tekrarBekleyenYanlis = topicYanlislar.filter((y) => !y.tekrarEdildi).length;

  // Başarı Oranları
  const sbBasari = sbCozulen > 0 ? Math.round((sbDogru / sbCozulen) * 100) : null;
  const denemeBasari = denemeToplam > 0 ? Math.round((denemeDogru / denemeToplam) * 100) : null;
  
  const totalCozulen = sbCozulen + denemeToplam;
  const totalDogru = sbDogru + denemeDogru;
  const totalYanlis = sbYanlis + denemeYanlis;
  const genelBasari = totalCozulen > 0 ? Math.round((totalDogru / totalCozulen) * 100) : null;

  return {
    sbCozulen,
    sbDogru,
    sbYanlis,
    sbBasari,
    denemeToplam,
    denemeDogru,
    denemeYanlis,
    denemeBasari,
    yanlisSayisi,
    tekrarBekleyenYanlis,
    totalCozulen,
    totalDogru,
    totalYanlis,
    genelBasari
  };
}

// LGS Standart Puan Hesaplama Modeli (MEB Yaklaşımı)
function calculateLGSScore(results, formula = "3") {
  const penalty = formula === "4" ? 4 : 3;
  let trNet = Math.max(0, (Number(results?.turkce?.dogru) || 0) - (Number(results?.turkce?.yanlis) || 0) / penalty);
  let matNet = Math.max(0, (Number(results?.matematik?.dogru) || 0) - (Number(results?.matematik?.yanlis) || 0) / penalty);
  let fenNet = Math.max(0, (Number(results?.fen?.dogru) || 0) - (Number(results?.fen?.yanlis) || 0) / penalty);
  let inkNet = Math.max(0, (Number(results?.inkilap?.dogru) || 0) - (Number(results?.inkilap?.yanlis) || 0) / penalty);
  let dinNet = Math.max(0, (Number(results?.din?.dogru) || 0) - (Number(results?.din?.yanlis) || 0) / penalty);
  let ingNet = Math.max(0, (Number(results?.ingilizce?.dogru) || 0) - (Number(results?.ingilizce?.yanlis) || 0) / penalty);

  const baseScore = 194.75;
  const trScore = trNet * 4.344;
  const matScore = matNet * 4.254;
  const fenScore = fenNet * 4.102;
  const inkScore = inkNet * 1.682;
  const dinScore = dinNet * 1.624;
  const ingScore = ingNet * 1.551;

  const total = baseScore + trScore + matScore + fenScore + inkScore + dinScore + ingScore;
  return Math.min(500, Math.max(100, Math.round(total * 100) / 100));
}

// 2026 Yüzdelik Dilim Tahminleyici (LGS Yaklaşık Dağılımı)
function calculateLGSPercentile2026(score) {
  const distribution = [
    { score: 500, percentile: 0.01 },
    { score: 490, percentile: 0.50 },
    { score: 480, percentile: 1.50 },
    { score: 470, percentile: 3.00 },
    { score: 460, percentile: 4.80 },
    { score: 450, percentile: 7.00 },
    { score: 440, percentile: 9.50 },
    { score: 420, percentile: 14.00 },
    { score: 400, percentile: 20.00 },
    { score: 350, percentile: 35.00 },
    { score: 300, percentile: 55.00 },
    { score: 250, percentile: 75.00 },
    { score: 100, percentile: 100.00 },
  ];
  if (score >= 500) return "0.01";
  if (score <= 100) return "100.00";
  for (let i = 0; i < distribution.length - 1; i++) {
    const upper = distribution[i];
    const lower = distribution[i + 1];
    if (score <= upper.score && score > lower.score) {
      const scoreDiff = upper.score - lower.score;
      const pctDiff = lower.percentile - upper.percentile;
      const scoreOffset = score - lower.score;
      const exactPct = lower.percentile - (scoreOffset / scoreDiff) * pctDiff;
      return exactPct.toFixed(2);
    }
  }
  return "100.00";
}

/* ---------------------------------------------------------------------- */
/* ANA UYGULAMA BİLEŞENİ                                                  */
/* ---------------------------------------------------------------------- */

export default function LGSTakipSistemi() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loaded, setLoaded] = useState(false);

  const [profile, setProfile] = useState(defaultProfile());
  const [denemeler, setDenemeler] = useState([]);
  const [konular, setKonular] = useState(defaultKonular());
  const [program, setProgram] = useState({});
  const [yanlislar, setYanlislar] = useState([]);
  const [soruGecmisi, setSoruGecmisi] = useState([]);
  const [haftalikGecmis, setHaftalikGecmis] = useState(defaultHaftalikGecmis());
  const [kaynaklar, setKaynaklar] = useState(defaultKaynaklar());
  const [refleksiyonlar, setRefleksiyonlar] = useState(defaultRefleksiyonlar());
  const [showReportModal, setShowReportModal] = useState(false);

  // 1 Aylık Simülasyon Verisini Yükle (Test ve İnceleme Modu)
  const loadMockDataSimulation = useCallback(() => {
    const mock = generate1MonthMockData();
    setProfile(mock.profile);
    setDenemeler(mock.denemeler);
    setProgram(mock.program);
    setHaftalikGecmis(mock.haftalikGecmis);
    setKaynaklar(mock.kaynaklar);
    setYanlislar(mock.yanlislar);
    setRefleksiyonlar(mock.refleksiyonlar);
    setKonular(mock.konular);
    setSoruGecmisi(mock.soruGecmisi);

    saveKey("lgs_profile", mock.profile);
    saveKey("lgs_denemeler", mock.denemeler);
    saveKey("lgs_program", mock.program);
    saveKey("lgs_haftalik_gecmis", mock.haftalikGecmis);
    saveKey("lgs_kaynaklar", mock.kaynaklar);
    saveKey("lgs_yanlislar", mock.yanlislar);
    saveKey("lgs_refleksiyonlar", mock.refleksiyonlar);
    saveKey("lgs_konular", mock.konular);
    saveKey("lgs_soru_gecmisi", mock.soruGecmisi);

    triggerConfetti();
  }, []);

  const handleResetToFresh = useCallback(() => {
    if (!window.confirm("Tüm verileri temizleyip sıfırdan boş bir öğrenci hesabı açmak istediğinize emin misiniz?")) return;
    const cleanProfile = defaultProfile();
    const cleanKonular = defaultKonular();
    const cleanProgram = {};
    const cleanDenemeler = [];
    const cleanYanlislar = [];
    const cleanSoruGecmisi = [];
    const cleanHaftalikGecmis = [];
    const cleanKaynaklar = [];
    const cleanRefleksiyonlar = [];

    setProfile(cleanProfile);
    setKonular(cleanKonular);
    setProgram(cleanProgram);
    setDenemeler(cleanDenemeler);
    setYanlislar(cleanYanlislar);
    setSoruGecmisi(cleanSoruGecmisi);
    setHaftalikGecmis(cleanHaftalikGecmis);
    setKaynaklar(cleanKaynaklar);
    setRefleksiyonlar(cleanRefleksiyonlar);

    saveKey("lgs_initialized", true);
    saveKey("lgs_profile", cleanProfile);
    saveKey("lgs_denemeler", cleanDenemeler);
    saveKey("lgs_program", cleanProgram);
    saveKey("lgs_haftalik_gecmis", cleanHaftalikGecmis);
    saveKey("lgs_kaynaklar", cleanKaynaklar);
    saveKey("lgs_yanlislar", cleanYanlislar);
    saveKey("lgs_refleksiyonlar", cleanRefleksiyonlar);
    saveKey("lgs_konular", cleanKonular);
    saveKey("lgs_soru_gecmisi", cleanSoruGecmisi);
  }, []);

  // Verileri Yükle (İlk açılışta zengin 1 aylık test verisiyle başlat)
  useEffect(() => {
    (async () => {
      const mock = generate1MonthMockData();
      const isInit = await loadKey("lgs_initialized", false);
      const [p, d, k, pr, y, sg, hg, ky, rf] = await Promise.all([
        loadKey("lgs_profile", null),
        loadKey("lgs_denemeler", null),
        loadKey("lgs_konular", null),
        loadKey("lgs_program", null),
        loadKey("lgs_yanlislar", null),
        loadKey("lgs_soru_gecmisi", null),
        loadKey("lgs_haftalik_gecmis", null),
        loadKey("lgs_kaynaklar", null),
        loadKey("lgs_refleksiyonlar", null),
      ]);

      if (isInit) {
        setProfile(p || defaultProfile());
        setDenemeler(d || []);
        setKonular(k || defaultKonular());
        setProgram(pr || {});
        setYanlislar(y || []);
        setSoruGecmisi(sg || []);
        setHaftalikGecmis(hg || []);
        setKaynaklar(ky || []);
        setRefleksiyonlar(rf || []);
      } else {
        // İlk kez açılıyorsa örnek 1 aylık verileri yükle ve başlat
        saveKey("lgs_initialized", true);
        const finalProfile = p && p.isim && p.isim.trim() ? { ...mock.profile, ...p } : mock.profile;
        const finalDenemeler = (d && Array.isArray(d) && d.length > 0) ? d : mock.denemeler;
        const finalKonular = (k && Object.keys(k).length > 0) ? k : mock.konular;
        const finalProgram = (pr && Object.keys(pr).length > 0) ? pr : mock.program;
        const finalYanlislar = (y && Array.isArray(y) && y.length > 0) ? y : mock.yanlislar;
        const finalSoruGecmisi = (sg && Array.isArray(sg) && sg.length > 0) ? sg : mock.soruGecmisi;
        const finalHaftalikGecmis = (hg && Array.isArray(hg) && hg.length > 0) ? hg : mock.haftalikGecmis;
        const finalKaynaklar = (ky && Array.isArray(ky) && ky.length > 0) ? ky : mock.kaynaklar;
        const finalRefleksiyonlar = (rf && Array.isArray(rf) && rf.length > 0) ? rf : mock.refleksiyonlar;

        setProfile(finalProfile);
        setDenemeler(finalDenemeler);
        setKonular(finalKonular);
        setProgram(finalProgram);
        setYanlislar(finalYanlislar);
        setSoruGecmisi(finalSoruGecmisi);
        setHaftalikGecmis(finalHaftalikGecmis);
        setKaynaklar(finalKaynaklar);
        setRefleksiyonlar(finalRefleksiyonlar);

        saveKey("lgs_profile", finalProfile);
        saveKey("lgs_denemeler", finalDenemeler);
        saveKey("lgs_konular", finalKonular);
        saveKey("lgs_program", finalProgram);
        saveKey("lgs_yanlislar", finalYanlislar);
        saveKey("lgs_soru_gecmisi", finalSoruGecmisi);
        saveKey("lgs_haftalik_gecmis", finalHaftalikGecmis);
        saveKey("lgs_kaynaklar", finalKaynaklar);
        saveKey("lgs_refleksiyonlar", finalRefleksiyonlar);
      }
      setLoaded(true);
    })();
  }, []);

  // Günlük Çalışma Serisi İşaretleme
  const markActive = useCallback((prof) => {
    const t = todayISO();
    const base = prof || profile;
    const currentDates = base.streakDates || [];
    if (currentDates.includes(t)) return base;
    const updated = { ...base, streakDates: [...currentDates, t].slice(-180) };
    setProfile(updated);
    saveKey("lgs_profile", updated);
    return updated;
  }, [profile]);

  // Değişiklikleri Kaydet
  useEffect(() => { if (loaded) saveKey("lgs_profile", profile); }, [profile, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_denemeler", denemeler); }, [denemeler, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_konular", konular); }, [konular, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_program", program); }, [program, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_yanlislar", yanlislar); }, [yanlislar, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_soru_gecmisi", soruGecmisi); }, [soruGecmisi, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_haftalik_gecmis", haftalikGecmis); }, [haftalikGecmis, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_kaynaklar", kaynaklar); }, [kaynaklar, loaded]);
  useEffect(() => { if (loaded) saveKey("lgs_refleksiyonlar", refleksiyonlar); }, [refleksiyonlar, loaded]);

  // Streak Hesabı
  const streak = useMemo(() => {
    const set = new Set(profile.streakDates || []);
    let count = 0;
    let d = new Date();
    if (!set.has(todayISO())) d.setDate(d.getDate() - 1);
    while (true) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const iso = `${year}-${month}-${day}`;
      if (set.has(iso)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  }, [profile.streakDates]);

  // Sınava Kalan Gün Hesabı
  const daysLeft = useMemo(() => {
    if (!profile.sinavTarihi) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(profile.sinavTarihi + "T00:00:00");
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  }, [profile.sinavTarihi]);

  // Gamification Hesabı (Rozetler, XP, Seviyeler)
  const gamificationData = useMemo(() => {
    return calculateGamification({
      profile,
      denemeler,
      program,
      yanlislar,
      soruGecmisi,
      haftalikGecmis,
      kaynaklar,
      streak
    });
  }, [profile, denemeler, program, yanlislar, soruGecmisi, haftalikGecmis, kaynaklar, streak]);

  const appHaftalikOzet = useMemo(() => {
    let toplamHedef = 0, toplamCozulen = 0, toplamDogru = 0, toplamYanlis = 0;
    DAYS.forEach((d) => {
      (program[d] || []).forEach((it) => {
        toplamHedef += Number(it.hedefSoru) || 0;
        if (it.tamamlandi && it.sonuc) {
          toplamCozulen += Number(it.sonuc.cozulen) || 0;
          toplamDogru += Number(it.sonuc.dogru) || 0;
          toplamYanlis += Number(it.sonuc.yanlis) || 0;
        }
      });
    });
    const basari = toplamCozulen > 0 ? Math.round((toplamDogru / toplamCozulen) * 100) : 0;
    const tamamlanma = toplamHedef > 0 ? Math.round((toplamCozulen / toplamHedef) * 100) : 0;
    return { toplamHedef, toplamCozulen, toplamDogru, toplamYanlis, basari, tamamlanma };
  }, [program]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) { }
  };

  const handleAddSoruGecmisi = (entry) => {
    setSoruGecmisi((prev) => [entry, ...prev]);
    markActive();
    triggerConfetti();
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-grid" style={{ background: COLORS.paper }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 animate-pulse" style={{ background: COLORS.primary }}>
          <GraduationCap size={24} color="white" />
        </div>
        <div className="font-display font-bold text-base" style={{ color: COLORS.ink }}>LGS Karargâhı Yükleniyor…</div>
        <div className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>Çalışma verileriniz hazırlanıyor</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-grid" style={{ background: COLORS.paper, color: COLORS.ink }}>
      
      {/* SOL MENÜ / STICKY SIDEBAR */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-white/95 md:sticky md:top-0 md:h-screen md:overflow-y-auto border-r border-slate-200/80 p-4 lg:p-5 flex flex-col justify-between shadow-2xs backdrop-blur-md z-30">
        <div>
          {/* LOGO & ÖĞRENCİ KİMLİK KARTI */}
          <div className="mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                }}
              >
                <GraduationCap size={22} color="#FFFFFF" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-extrabold text-sm truncate text-slate-900">
                  {profile.isim ? profile.isim : "LGS Karargâhı"}
                </div>
                <div className="text-xs truncate font-semibold text-blue-600">
                  {profile.hedefOkul || "8. Sınıf LGS 2027"}
                </div>
              </div>
            </div>
          </div>

          {/* MENÜ LİSTESİ */}
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-2 md:pb-0">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`tab-btn flex items-center gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap flex-shrink-0 w-full ${active ? "animate-fade-in bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <Icon size={18} className={active ? "text-blue-600" : "text-slate-400"} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ALT KISAYOL & WIDGET ALANI */}
        <div className="hidden md:flex flex-col gap-3 mt-5 pt-4 border-t border-slate-100">
          {/* VELİ / KOÇ RAPORU BUTONU */}
          <button
            onClick={() => setShowReportModal(true)}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
            }}
          >
            <Printer size={15} color="#FFFFFF" />
            <span style={{ color: "#FFFFFF" }}>Veli & Koç Raporu Al</span>
          </button>

          {/* SEVİYE & XP MİNİ KARTI */}
          <div
            onClick={() => setActiveTab("rozetler")}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-blue-700 flex items-center gap-1">
                <Award size={14} />
                {gamificationData.currentLevel.title}
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-500">{gamificationData.xp} XP</span>
            </div>
            <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${gamificationData.levelProgress}%` }} />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-medium">
              <span>Sv. {gamificationData.currentLevel.level}</span>
              <span>{gamificationData.unlockedCount} Rozet Açıldı</span>
            </div>
          </div>

          {/* STREAK & GÜN KARTI */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Flame size={18} className="text-amber-600" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">ÇALIŞMA SERİSİ</div>
                <div className="font-mono text-base font-extrabold text-amber-950">{streak} Gün Kesintisiz</div>
              </div>
            </div>
            <Sparkles size={16} className="text-amber-500" />
          </div>
        </div>
      </aside>

      {/* ANA İÇERİK BÖLGESİ */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
          {activeTab === "dashboard" && (
            <Dashboard
              profile={profile}
              denemeler={denemeler}
              konular={konular}
              program={program}
              yanlislar={yanlislar}
              soruGecmisi={soruGecmisi}
              haftalikGecmis={haftalikGecmis}
              kaynaklar={kaynaklar}
              refleksiyonlar={refleksiyonlar}
              gamificationData={gamificationData}
              streak={streak}
              daysLeft={daysLeft}
              setActiveTab={setActiveTab}
              setShowReportModal={setShowReportModal}
              onSaveReflection={(ref) => {
                setRefleksiyonlar((prev) => {
                  const filtered = prev.filter((r) => r.tarih !== ref.tarih);
                  return [ref, ...filtered];
                });
                markActive();
              }}
              onAddToProgram={(targetDay, taskItem) => {
                setProgram((prev) => ({
                  ...prev,
                  [targetDay]: [...(prev[targetDay] || []), taskItem]
                }));
                triggerConfetti();
              }}
            />
          )}

          {activeTab === "konular" && (
            <Konular
              konular={konular}
              program={program}
              denemeler={denemeler}
              yanlislar={yanlislar}
              soruGecmisi={soruGecmisi}
              kaynaklar={kaynaklar}
              onAddSoruGecmisi={handleAddSoruGecmisi}
              onCycle={(subject, topic) => {
                setKonular((prev) => {
                  const current = prev[subject]?.[topic] || "bekliyor";
                  const nextIndex = (STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length;
                  const nextStatus = STATUS_ORDER[nextIndex];
                  return {
                    ...prev,
                    [subject]: { ...prev[subject], [topic]: nextStatus }
                  };
                });
                markActive();
              }}
              onAddCustomTopic={(subject, topicName) => {
                if (!topicName.trim()) return;
                setKonular((prev) => ({
                  ...prev,
                  [subject]: { ...prev[subject], [topicName.trim()]: "bekliyor" }
                }));
              }}
              onAddKaynak={(k) => {
                setKaynaklar((prev) => [...prev, k]);
                markActive();
                triggerConfetti();
              }}
              onUpdateKaynak={(id, updated) => {
                setKaynaklar((prev) => prev.map((k) => (k.id === id ? updated : k)));
              }}
              onDeleteKaynak={(id) => {
                setKaynaklar((prev) => prev.filter((k) => k.id !== id));
              }}
            />
          )}

          {activeTab === "denemeler" && (
            <Denemeler
              denemeler={denemeler}
              netFormulu={profile.netFormulu || "3"}
              onAdd={(d) => {
                setDenemeler((prev) => [d, ...prev]);
                markActive();
                triggerConfetti();
              }}
              onDelete={(id) => setDenemeler((prev) => prev.filter((x) => x.id !== id))}
            />
          )}

          {activeTab === "program" && (
            <Program
              program={program}
              haftalikGecmis={haftalikGecmis}
              onAdd={(day, item) => {
                setProgram((prev) => ({ ...prev, [day]: [...(prev[day] || []), item] }));
              }}
              onComplete={(day, id, sonuc) => {
                setProgram((prev) => ({
                  ...prev,
                  [day]: (prev[day] || []).map((it) => (it.id === id ? { ...it, tamamlandi: true, sonuc } : it)),
                }));
                markActive();
                triggerConfetti();
              }}
              onReopen={(day, id) => {
                setProgram((prev) => ({
                  ...prev,
                  [day]: (prev[day] || []).map((it) => (it.id === id ? { ...it, tamamlandi: false, sonuc: null } : it)),
                }));
              }}
              onDelete={(day, id) => {
                setProgram((prev) => ({ ...prev, [day]: (prev[day] || []).filter((it) => it.id !== id) }));
              }}
              onAddHaftalikGecmis={(week) => {
                setHaftalikGecmis((prev) => [...prev, week]);
                markActive();
                triggerConfetti();
              }}
              onDeleteHaftalikGecmis={(id) => {
                setHaftalikGecmis((prev) => prev.filter((w) => w.id !== id));
              }}
              onArchiveWeek={(haftaBaslik, tarihAralik) => {
                let toplamHedef = 0, toplamCozulen = 0, toplamDogru = 0, toplamYanlis = 0;
                const dersler = { turkce: 0, matematik: 0, fen: 0, inkilap: 0, din: 0, ingilizce: 0 };
                DAYS.forEach((d) => {
                  (program[d] || []).forEach((it) => {
                    toplamHedef += Number(it.hedefSoru) || 0;
                    if (it.tamamlandi && it.sonuc) {
                      const c = Number(it.sonuc.cozulen) || 0;
                      const dg = Number(it.sonuc.dogru) || 0;
                      const yn = Number(it.sonuc.yanlis) || 0;
                      toplamCozulen += c;
                      toplamDogru += dg;
                      toplamYanlis += yn;
                      if (it.ders && dersler[it.ders] !== undefined) {
                        dersler[it.ders] += c;
                      }
                    }
                  });
                });

                const newArchived = {
                  id: uid(),
                  etiket: haftaBaslik || "Tamamlanan Hafta",
                  tarihAraligi: tarihAralik || fmtDate(todayISO()),
                  toplamSoru: toplamCozulen,
                  hedefSoru: toplamHedef,
                  dogru: toplamDogru,
                  yanlis: toplamYanlis,
                  bos: Math.max(0, toplamCozulen - (toplamDogru + toplamYanlis)),
                  dersler
                };

                setHaftalikGecmis((prev) => [...prev, newArchived]);
                setProgram({}); // Yeni hafta için programı sıfırla
                markActive();
                triggerConfetti();
              }}
            />
          )}

          {activeTab === "yanlis" && (
            <YanlisDefteri
              yanlislar={yanlislar}
              onAdd={(y) => {
                setYanlislar((prev) => [y, ...prev]);
                markActive();
                triggerConfetti();
              }}
              onToggle={(id) => setYanlislar((prev) => prev.map((y) => (y.id === id ? { ...y, tekrarEdildi: !y.tekrarEdildi } : y)))}
              onDelete={(id) => setYanlislar((prev) => prev.filter((y) => y.id !== id))}
            />
          )}

          {activeTab === "rozetler" && (
            <BadgesLevel gamificationData={gamificationData} />
          )}

          {activeTab === "rapor" && (
            <VeliRaporPage
              onBack={() => setActiveTab("dashboard")}
              profile={profile}
              denemeler={denemeler}
              haftaOzet={appHaftalikOzet}
              haftalikGecmis={haftalikGecmis}
              program={program}
              soruGecmisi={soruGecmisi}
              konular={konular}
              topMissedTopics={topicStats(denemeler).filter((s) => s.yanlis > 0).sort((a, b) => b.yanlis - a.yanlis).slice(0, 4)}
              streak={streak}
              daysLeft={daysLeft}
              gamificationData={gamificationData}
              subjects={SUBJECTS}
            />
          )}

          {activeTab === "pomodoro" && (
            <Pomodoro
              profile={profile}
              onCompleteSession={(minutes) => {
                setProfile((prev) => ({
                  ...prev,
                  pomodoroStats: {
                    totalMinutes: (prev.pomodoroStats?.totalMinutes || 0) + minutes,
                    completedSessions: (prev.pomodoroStats?.completedSessions || 0) + 1
                  }
                }));
                markActive();
                triggerConfetti();
              }}
            />
          )}

          {activeTab === "hedefler" && (
            <Hedefler
              profile={profile}
              setProfile={setProfile}
              denemeler={denemeler}
              konular={konular}
              program={program}
              yanlislar={yanlislar}
              soruGecmisi={soruGecmisi}
              haftalikGecmis={haftalikGecmis}
              kaynaklar={kaynaklar}
              refleksiyonlar={refleksiyonlar}
              streak={streak}
              onLoadSimulation={loadMockDataSimulation}
              onImportAll={(data) => {
                if (data.profile) setProfile(data.profile);
                if (data.denemeler) setDenemeler(data.denemeler);
                if (data.konular) setKonular(data.konular);
                if (data.program) setProgram(data.program);
                if (data.yanlislar) setYanlislar(data.yanlislar);
                if (data.soruGecmisi) setSoruGecmisi(data.soruGecmisi);
                if (data.haftalikGecmis) setHaftalikGecmis(data.haftalikGecmis);
                if (data.kaynaklar) setKaynaklar(data.kaynaklar);
                if (data.refleksiyonlar) setRefleksiyonlar(data.refleksiyonlar);
                triggerConfetti();
              }}
            />
          )}
        </main>

        {/* VELİ / KOÇ RAPORU MODALI */}
        <VeliRaporModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          profile={profile}
          denemeler={denemeler}
          haftaOzet={appHaftalikOzet}
          haftalikGecmis={haftalikGecmis}
          program={program}
          soruGecmisi={soruGecmisi}
          konular={konular}
          topMissedTopics={topicStats(denemeler).filter((s) => s.yanlis > 0).sort((a, b) => b.yanlis - a.yanlis).slice(0, 4)}
          streak={streak}
          daysLeft={daysLeft}
          gamificationData={gamificationData}
          subjects={SUBJECTS}
        />
      </div>
    );
  }

/* ---------------------------------------------------------------------- */
/* 1. PANEL (DASHBOARD)                                                    */
/* ---------------------------------------------------------------------- */

function Dashboard({
  profile,
  denemeler,
  konular,
  program,
  yanlislar,
  soruGecmisi,
  haftalikGecmis = [],
  kaynaklar = [],
  refleksiyonlar = [],
  gamificationData,
  streak,
  daysLeft,
  setActiveTab,
  setShowReportModal,
  onSaveReflection,
  onAddToProgram
}) {
  const [dashboardChartTab, setDashboardChartTab] = useState("gunluk"); // "gunluk" | "haftalikTrend"
  const formula = profile.netFormulu || "3";
  const sonDenemeler = [...denemeler].sort((a, b) => a.tarih.localeCompare(b.tarih)).slice(-8);
  const trendData = sonDenemeler.map((d) => ({
    isim: d.isim.length > 10 ? d.isim.slice(0, 10) + "…" : d.isim,
    net: Math.round(totalNet(d, formula) * 10) / 10,
    puan: calculateLGSScore(d.results, formula)
  }));

  const ortalamaNet = denemeler.length
    ? (denemeler.reduce((s, d) => s + totalNet(d, formula), 0) / denemeler.length).toFixed(1)
    : "—";

  const sonPuan = denemeler.length > 0
    ? calculateLGSScore(denemeler[0].results, formula)
    : "—";

  const zayifDers = useMemo(() => {
    if (denemeler.length === 0) return null;
    let worst = null;
    SUBJECTS.forEach((s) => {
      const ratios = denemeler.map((d) => subjectNet(d, s.key, formula) / s.max);
      const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      if (worst === null || avg < worst.avg) worst = { key: s.key, name: s.name, color: s.color, avg };
    });
    return worst;
  }, [denemeler, formula]);

  const topMissedTopics = useMemo(() => {
    return topicStats(denemeler).filter((s) => s.yanlis > 0).sort((a, b) => b.yanlis - a.yanlis).slice(0, 4);
  }, [denemeler]);

  const bugun = DAYS[(new Date().getDay() + 6) % 7];
  const bugunProgram = program[bugun] || [];

  const konuIlerleme = useMemo(() => {
    let total = 0, done = 0;
    Object.values(konular).forEach((subj) => Object.values(subj).forEach((st) => {
      total++;
      if (st === "pekisti") done++;
    }));
    return total ? Math.round((done / total) * 100) : 0;
  }, [konular]);

  // Toplam çözülen soru sayısı (Program + Ek soru girişleri)
  const toplamCozulenSoruSayisi = useMemo(() => {
    let sum = 0;
    Object.values(program || {}).forEach((dayList) => {
      (dayList || []).forEach((it) => {
        if (it.tamamlandi && it.sonuc) sum += Number(it.sonuc.cozulen) || 0;
      });
    });
    (soruGecmisi || []).forEach((e) => {
      sum += Number(e.cozulen) || 0;
    });
    return sum;
  }, [program, soruGecmisi]);

  // Haftalık soru verileri
  const haftalikSoruData = useMemo(() => {
    return DAYS.map((d) => {
      let hedef = 0, cozulen = 0, dogru = 0, yanlis = 0;
      (program[d] || []).forEach((it) => {
        hedef += Number(it.hedefSoru) || 0;
        if (it.tamamlandi && it.sonuc) {
          cozulen += Number(it.sonuc.cozulen) || 0;
          dogru += Number(it.sonuc.dogru) || 0;
          yanlis += Number(it.sonuc.yanlis) || 0;
        }
      });
      return {
        gun: d.slice(0, 3),
        tamGun: d,
        "Hedef": hedef,
        "Çözülen": cozulen,
        "Doğru": dogru,
        "Yanlış": yanlis
      };
    });
  }, [program]);

  const haftalikOzet = useMemo(() => {
    let toplamHedef = 0, toplamCozulen = 0, toplamDogru = 0, toplamYanlis = 0;
    DAYS.forEach((d) => {
      (program[d] || []).forEach((it) => {
        toplamHedef += Number(it.hedefSoru) || 0;
        if (it.tamamlandi && it.sonuc) {
          toplamCozulen += Number(it.sonuc.cozulen) || 0;
          toplamDogru += Number(it.sonuc.dogru) || 0;
          toplamYanlis += Number(it.sonuc.yanlis) || 0;
        }
      });
    });
    const basari = toplamCozulen > 0 ? Math.round((toplamDogru / toplamCozulen) * 100) : 0;
    const tamamlanma = toplamHedef > 0 ? Math.round((toplamCozulen / toplamHedef) * 100) : 0;
    return { toplamHedef, toplamCozulen, toplamDogru, toplamYanlis, basari, tamamlanma };
  }, [program]);

  // Geçmiş haftalar + Bu hafta birleşik veri listesi
  const allWeeksComparisonData = useMemo(() => {
    const list = [...(haftalikGecmis || [])].map((w) => ({
      ...w,
      isCurrent: false
    }));
    
    list.push({
      id: "current-active",
      etiket: "Bu Hafta",
      tarihAraligi: "Aktif Hafta",
      toplamSoru: haftalikOzet.toplamCozulen,
      hedefSoru: haftalikOzet.toplamHedef,
      dogru: haftalikOzet.toplamDogru,
      yanlis: haftalikOzet.toplamYanlis,
      bos: 0,
      isCurrent: true
    });

    return list.map((w, idx, arr) => {
      const prev = idx > 0 ? arr[idx - 1] : null;
      const diff = prev ? w.toplamSoru - prev.toplamSoru : 0;
      const diffPct = prev && prev.toplamSoru > 0 ? Math.round((diff / prev.toplamSoru) * 100) : 0;
      return {
        ...w,
        "Çözülen Soru": w.toplamSoru,
        "Hedef Soru": w.hedefSoru,
        "Doğruluk %": w.toplamSoru > 0 ? Math.round((w.dogru / w.toplamSoru) * 100) : 0,
        diff,
        diffPct
      };
    });
  }, [haftalikGecmis, haftalikOzet]);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      
      {/* HERO BANNER - MODERN PREMIUM HEADER */}
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white shadow-xl border border-slate-700/60"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          boxShadow: "0 15px 35px -5px rgba(15, 23, 42, 0.3)"
        }}
      >
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ÜST SATIR: GERİ SAYIM, HEDEF BİLGİLERİ VE HIZLI EYLEMLER */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5 shadow-2xs">
                <School size={13} />
                <span>{profile.hedefOkul || "Hedef Okul Belirle"}</span>
              </div>
              {profile.hedefPuan && (
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-2xs">
                  Hedef: {profile.hedefPuan} Puan
                </div>
              )}
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-2xs">
                LGS {profile.sinavTarihi ? new Date(profile.sinavTarihi + "T00:00:00").getFullYear() : 2027}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-mono font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight" style={{ color: "#FFFFFF" }}>
                {daysLeft !== null && daysLeft >= 0 ? daysLeft : 0}
              </span>
              <span className="text-base sm:text-lg font-bold tracking-wider uppercase" style={{ color: "#E2E8F0" }}>
                GÜN KALDI
              </span>
            </div>

            <p className="text-xs sm:text-sm mt-2.5 italic flex items-center gap-1.5" style={{ color: "#CBD5E1" }}>
              <Sparkles size={14} className="text-amber-400 flex-shrink-0" />
              <span>"Başarı, her gün tekrarlanan küçük çabaların toplamıdır."</span>
            </p>
          </div>

          {/* HIZLI AKSİYON BUTONLARI */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-0.5 cursor-pointer border border-blue-400/30"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)", color: "#FFFFFF" }}
            >
              <Printer size={16} color="#FFFFFF" />
              <span style={{ color: "#FFFFFF" }}>📄 Veli & Koç Raporu Al</span>
            </button>
            <button
              onClick={() => setActiveTab("denemeler")}
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md transition cursor-pointer"
              style={{ background: "rgba(255,255,255,0.12)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Plus size={16} color="#FFFFFF" />
              <span style={{ color: "#FFFFFF" }}>Yeni Deneme Ekle</span>
            </button>
          </div>
        </div>

        {/* ALT SATIR: TÜM EKRANLARA DENGELİ DAĞILAN 5'Lİ METRİK KARTLARI */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/10 flex flex-col items-center justify-center text-center">
            <Flame size={20} className="text-amber-400 mb-1" />
            <div className="font-mono font-extrabold text-xl sm:text-2xl mt-0.5" style={{ color: "#FFFFFF" }}>{streak}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>Gün Seri</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/10 flex flex-col items-center justify-center text-center">
            <CheckSquare size={20} className="text-sky-400 mb-1" />
            <div className="font-mono font-extrabold text-xl sm:text-2xl mt-0.5" style={{ color: "#FFFFFF" }}>{haftalikOzet.toplamCozulen}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>Bu Hafta Soru</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/10 flex flex-col items-center justify-center text-center">
            <Layers size={20} className="text-purple-400 mb-1" />
            <div className="font-mono font-extrabold text-xl sm:text-2xl mt-0.5" style={{ color: "#FFFFFF" }}>{toplamCozulenSoruSayisi}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>Toplam Soru</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/10 flex flex-col items-center justify-center text-center">
            <TrendingUp size={20} className="text-emerald-400 mb-1" />
            <div className="font-mono font-extrabold text-xl sm:text-2xl mt-0.5" style={{ color: "#FFFFFF" }}>{ortalamaNet}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>Ortalama Net</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/10 flex flex-col items-center justify-center text-center">
            <BookOpen size={20} className="text-blue-400 mb-1" />
            <div className="font-mono font-extrabold text-xl sm:text-2xl mt-0.5" style={{ color: "#FFFFFF" }}>%{konuIlerleme}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>Müfredat Pekiştirme</div>
          </div>
        </div>
      </div>

      {/* AKILLI REÇETE & GÜNLÜK REFLEKSİYON BİLEŞENLERİ */}
      <SmartRecommendations
        denemeler={denemeler}
        program={program}
        yanlislar={yanlislar}
        konular={konular}
        subjects={SUBJECTS}
        onAddToProgram={onAddToProgram}
      />

      {/* GRAFİK VE ODAK NOKTASI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <SectionTitle
            icon={TrendingUp}
            rightElement={
              <button
                onClick={() => setActiveTab("denemeler")}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Tüm Denemeler →
              </button>
            }
          >
            Net Trendi (Son Denemeler)
          </SectionTitle>

          {trendData.length >= 2 ? (
            <div style={{ width: "100%", height: 230 }}>
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 5, left: -20, right: 10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="isim" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} domain={[0, 90]} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: `1px solid ${COLORS.paperLine}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Toplam Net"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ r: 5, fill: COLORS.primary, strokeWidth: 2, stroke: "#FFF" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              text="En az 2 deneme sınavı girdiğinizde net gelişim grafiğiniz burada çizilecektir."
              action={
                <button onClick={() => setActiveTab("denemeler")} className="btn-primary text-xs px-3 py-1.5 rounded-lg mt-2">
                  Deneme Ekle
                </button>
              }
            />
          )}
        </Card>

        <Card>
          <SectionTitle
            icon={AlertTriangle}
            rightElement={
              <button onClick={() => setActiveTab("konular")} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                Konu Analizi →
              </button>
            }
          >
            Gelişim & Odak Noktası
          </SectionTitle>
          {zayifDers ? (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl" style={{ background: zayifDers.color + "10", border: `1px solid ${zayifDers.color}30` }}>
                <div className="text-xs font-semibold" style={{ color: COLORS.inkSoft }}>Desteğe İhtiyacı Olan Ders:</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: zayifDers.color }} />
                    <span className="font-display font-bold text-base" style={{ color: COLORS.ink }}>{zayifDers.name}</span>
                  </div>
                  <span className="text-lg font-mono font-bold" style={{ color: zayifDers.color }}>
                    %{Math.round(zayifDers.avg * 100)}
                  </span>
                </div>
              </div>

              {topMissedTopics.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: COLORS.inkSoft }}>En Sık Hata Yapılan Konular:</div>
                  <div className="flex flex-col gap-1.5">
                    {topMissedTopics.map((t) => (
                      <div key={t.subjectKey + t.topic} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                          <span className="truncate font-medium" style={{ color: COLORS.ink }}>{t.topic}</span>
                        </div>
                        <Badge color={COLORS.danger}>{t.yanlis} Yanlış</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState icon={AlertTriangle} text="Deneme girdikçe en zayıf dersler ve konular burada analiz edilir." />
          )}
        </Card>
      </div>

      {/* HAFTALIK SORU ÇÖZÜM ANALİZİ & GEÇMİŞ HAFTALAR KARŞILAŞTIRMASI */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <SectionTitle
            icon={BarChart2}
            rightElement={
              <button
                onClick={() => setActiveTab("program")}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Tüm Geçmiş & Program →
              </button>
            }
          >
            Haftalık Soru Çözüm Analizi
          </SectionTitle>

          {/* Görünüm Değiştirme Butonları */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setDashboardChartTab("gunluk")}
              className="px-3 py-1 text-xs font-bold rounded-lg transition"
              style={{
                background: dashboardChartTab === "gunluk" ? "#FFFFFF" : "transparent",
                color: dashboardChartTab === "gunluk" ? COLORS.primary : COLORS.inkSoft,
                boxShadow: dashboardChartTab === "gunluk" ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}
            >
              📅 Günlük Dağılım
            </button>
            <button
              onClick={() => setDashboardChartTab("haftalikTrend")}
              className="px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1"
              style={{
                background: dashboardChartTab === "haftalikTrend" ? "#FFFFFF" : "transparent",
                color: dashboardChartTab === "haftalikTrend" ? COLORS.primary : COLORS.inkSoft,
                boxShadow: dashboardChartTab === "haftalikTrend" ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
              }}
            >
              <History size={13} />
              <span>Haftalık Karşılaştırma</span>
            </button>
          </div>
        </div>

        {dashboardChartTab === "gunluk" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center animate-fade-in">
            <div className="lg:col-span-3" style={{ width: "100%", height: 230 }}>
              <ResponsiveContainer>
                <BarChart data={haftalikSoruData} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="gun" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: `1px solid ${COLORS.paperLine}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                    formatter={(value, name) => [`${value} Soru`, name]}
                    labelFormatter={(label) => {
                      const found = haftalikSoruData.find((x) => x.gun === label);
                      return found ? found.tamGun : label;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                  <Bar dataKey="Hedef" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="Çözülen" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-700">Bu Hafta Performansı</div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Bu Hafta Çözülen:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">{haftalikOzet.toplamCozulen} Soru</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Haftalık Plan:</span>
                <span className="font-mono font-bold text-slate-700">{haftalikOzet.toplamHedef} Soru</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, haftalikOzet.tamamlanma)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Hedef Tamamlama:</span>
                <span className="font-bold text-slate-800">%{haftalikOzet.tamamlanma}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Doğruluk Oranı:</span>
                <span className="font-mono font-bold text-blue-600">%{haftalikOzet.basari}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Doğru / Yanlış:</span>
                <span className="font-mono">{haftalikOzet.toplamDogru}D / {haftalikOzet.toplamYanlis}Y</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center animate-fade-in">
            <div className="lg:col-span-3" style={{ width: "100%", height: 230 }}>
              <ResponsiveContainer>
                <BarChart data={allWeeksComparisonData} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="etiket" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: `1px solid ${COLORS.paperLine}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                    formatter={(value, name) => [`${value} Soru`, name]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? `${item.etiket} (${item.tarihAraligi})` : label;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                  <Bar dataKey="Hedef Soru" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="Çözülen Soru" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1">
                <TrendingUp size={14} className="text-blue-600" />
                Haftalık Gelişim Trendi
              </div>
              
              <div className="flex flex-col gap-2 mt-1">
                {allWeeksComparisonData.slice(-3).map((w) => (
                  <div key={w.id} className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-bold text-slate-800">{w.etiket}</span>
                      <span className="font-mono font-bold text-blue-700">{w.toplamSoru} Soru</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{w.tarihAraligi}</span>
                      {w.diff !== 0 && (
                        <span className={`font-semibold flex items-center gap-0.5 ${w.diff > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {w.diff > 0 ? `+${w.diff} (%${w.diffPct} 🚀)` : `${w.diff} (%${w.diffPct})`}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* BUGÜNÜN PROGRAMI & YANLIŞ DEFTERİ ÖZETİ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <SectionTitle
            icon={ClipboardList}
            rightElement={
              <button onClick={() => setActiveTab("program")} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                Haftalık Program →
              </button>
            }
          >
            Bugünün Çalışma Planı — {bugun}
          </SectionTitle>

          {bugunProgram.length ? (
            <div className="flex flex-col gap-2">
              {bugunProgram.map((it) => {
                const subj = SUBJECTS.find((s) => s.key === it.ders);
                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-3 rounded-xl transition"
                    style={{
                      background: it.tamamlandi ? "#F0FDF4" : COLORS.paper,
                      border: `1px solid ${it.tamamlandi ? "#BBF7D0" : COLORS.paperLine}`
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {it.tamamlandi ? (
                        <CheckCircle2 size={20} color={COLORS.success} />
                      ) : (
                        <Circle size={20} color={COLORS.inkSoft} />
                      )}
                      <Badge color={subj?.color || COLORS.primary}>{subj?.name || it.ders}</Badge>
                      <span className="text-sm font-semibold truncate" style={{ color: COLORS.ink }}>
                        {it.konu || "Genel Tekrar"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold" style={{ color: it.tamamlandi ? COLORS.success : COLORS.inkSoft }}>
                        {it.tamamlandi && it.sonuc
                          ? `${it.sonuc.dogru}D / ${it.sonuc.yanlis}Y (${it.sonuc.cozulen} Soru)`
                          : `Hedef: ${it.hedefSoru} Soru`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              text="Bugün için henüz bir çalışma hedefi eklemediniz."
              action={
                <button onClick={() => setActiveTab("program")} className="btn-primary text-xs px-3 py-1.5 rounded-lg mt-2">
                  Plan Oluştur
                </button>
              }
            />
          )}
        </Card>

        <Card>
          <SectionTitle
            icon={NotebookPen}
            rightElement={
              <button onClick={() => setActiveTab("yanlis")} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                Deftere Git →
              </button>
            }
          >
            Yanlış Defteri Durumu
          </SectionTitle>

          <div className="flex items-center justify-around my-2 p-3 bg-slate-50 rounded-xl">
            <div className="text-center">
              <div className="font-mono text-3xl font-extrabold" style={{ color: COLORS.danger }}>
                {yanlislar.length}
              </div>
              <div className="text-[11px] font-semibold" style={{ color: COLORS.inkSoft }}>Kayıtlı Yanlış</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="font-mono text-3xl font-extrabold" style={{ color: COLORS.warn }}>
                {yanlislar.filter((y) => !y.tekrarEdildi).length}
              </div>
              <div className="text-[11px] font-semibold" style={{ color: COLORS.inkSoft }}>Tekrar Bekleyen</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-3">
            Yanlış yaptığın soruları analiz edip tekrar etmek, LGS'de netini en hızlı artıran yöntemdir.
          </div>
        </Card>
      </div>

      {/* GÜNLÜK REFLEKSİYON & KOÇLUK GÜNLÜĞÜ */}
      <DailyReflection
        refleksiyonlar={refleksiyonlar}
        onSaveReflection={onSaveReflection}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 2. GELİŞMİŞ KONU TAKİBİ & BİRLEŞİK ANALİZ                              */
/* ---------------------------------------------------------------------- */

function Konular({
  konular,
  program,
  denemeler,
  yanlislar,
  soruGecmisi,
  kaynaklar = [],
  onAddSoruGecmisi,
  onCycle,
  onAddCustomTopic,
  onAddKaynak,
  onUpdateKaynak,
  onDeleteKaynak
}) {
  const [subTab, setSubTab] = useState("meb"); // "meb" | "kaynaklar"
  const [openSubj, setOpenSubj] = useState("turkce");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("hepsi");
  const [sortBy, setSortBy] = useState("default"); // default, enCokSoru, enCokYanlis, enDusukBasari
  const [newTopic, setNewTopic] = useState("");

  // Hızlı Soru Ekleme Modalı State'i
  const [quickModalTopic, setQuickModalTopic] = useState(null);
  const [quickSoruSayisi, setQuickSoruSayisi] = useState(30);
  const [quickDogru, setQuickDogru] = useState(27);
  const [quickYanlis, setQuickYanlis] = useState(3);
  const [quickKaynak, setQuickKaynak] = useState("Soru Bankası");

  const currentSubject = SUBJECTS.find((s) => s.key === openSubj) || SUBJECTS[0];
  const subjectTopics = konular[openSubj] || {};

  // Ders Özeti İstatistikleri
  const subjectSummary = useMemo(() => {
    let totalSbCozulen = 0, totalSbDogru = 0, totalSbYanlis = 0;
    let totalDenemeCozulen = 0, totalDenemeDogru = 0, totalDenemeYanlis = 0;
    let totalYanlisDefteri = 0;

    Object.keys(subjectTopics).forEach((topic) => {
      const stats = getTopicAggregatedStats(openSubj, topic, program, denemeler, yanlislar, soruGecmisi);
      totalSbCozulen += stats.sbCozulen;
      totalSbDogru += stats.sbDogru;
      totalSbYanlis += stats.sbYanlis;
      totalDenemeCozulen += stats.denemeToplam;
      totalDenemeDogru += stats.denemeDogru;
      totalDenemeYanlis += stats.denemeYanlis;
      totalYanlisDefteri += stats.yanlisSayisi;
    });

    const totalAll = totalSbCozulen + totalDenemeCozulen;
    const totalAllDogru = totalSbDogru + totalDenemeDogru;
    const genelBasari = totalAll > 0 ? Math.round((totalAllDogru / totalAll) * 100) : 0;

    return {
      totalSbCozulen,
      totalSbDogru,
      totalSbYanlis,
      totalDenemeCozulen,
      totalDenemeDogru,
      totalDenemeYanlis,
      totalYanlisDefteri,
      totalAll,
      genelBasari
    };
  }, [openSubj, subjectTopics, program, denemeler, yanlislar, soruGecmisi]);

  // Konuları filtrele ve sırala
  const processedTopics = useMemo(() => {
    let list = Object.entries(subjectTopics).map(([topic, status]) => {
      const stats = getTopicAggregatedStats(openSubj, topic, program, denemeler, yanlislar, soruGecmisi);
      return { topic, status, ...stats };
    });

    // Arama filtresi
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((item) => item.topic.toLowerCase().includes(term));
    }

    // Durum filtresi
    if (filterStatus !== "hepsi") {
      list = list.filter((item) => item.status === filterStatus);
    }

    // Sıralama
    if (sortBy === "enCokSoru") {
      list.sort((a, b) => b.totalCozulen - a.totalCozulen);
    } else if (sortBy === "enCokYanlis") {
      list.sort((a, b) => (b.totalYanlis + b.yanlisSayisi) - (a.totalYanlis + a.yanlisSayisi));
    } else if (sortBy === "enDusukBasari") {
      list.sort((a, b) => {
        const aScore = a.genelBasari !== null ? a.genelBasari : 999;
        const bScore = b.genelBasari !== null ? b.genelBasari : 999;
        return aScore - bScore;
      });
    }

    return list;
  }, [subjectTopics, openSubj, program, denemeler, yanlislar, soruGecmisi, searchTerm, filterStatus, sortBy]);

  const handleOpenQuickModal = (topic) => {
    setQuickModalTopic(topic);
    setQuickSoruSayisi(30);
    setQuickDogru(27);
    setQuickYanlis(3);
    setQuickKaynak("Soru Bankası");
  };

  const handleSaveQuickSoru = () => {
    if (!quickModalTopic) return;
    onAddSoruGecmisi({
      id: uid(),
      tarih: todayISO(),
      ders: openSubj,
      konu: quickModalTopic,
      cozulen: Number(quickSoruSayisi) || 0,
      dogru: Number(quickDogru) || 0,
      yanlis: Number(quickYanlis) || 0,
      kaynak: quickKaynak
    });
    setQuickModalTopic(null);
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    onAddCustomTopic(openSubj, newTopic);
    setNewTopic("");
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* ÜST SUB-TAB SEÇİCİ */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setSubTab("meb")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
            subTab === "meb" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen size={16} />
          <span>MEB 8. Sınıf Konu & Başarı Analizi</span>
        </button>
        <button
          onClick={() => setSubTab("kaynaklar")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
            subTab === "kaynaklar" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers size={16} />
          <span>Soru Bankalarım & Kaynak Takibi ({kaynaklar?.length || 0})</span>
        </button>
      </div>

      {subTab === "kaynaklar" ? (
        <KaynakTakibi
          kaynaklar={kaynaklar}
          subjects={SUBJECTS}
          onAddKaynak={onAddKaynak}
          onUpdateKaynak={onUpdateKaynak}
          onDeleteKaynak={onDeleteKaynak}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold" style={{ color: COLORS.ink }}>
                Konu Bazlı Takip & Başarı Analizi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Soru bankalarından çözülen soru sayıları ve denemelerdeki doğru/yanlış performansını konu konu karşılaştırın.
              </p>
            </div>
          </div>

      {/* DERS SEÇİCİ YATAY / DİKEY MENÜ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SUBJECTS.map((s) => {
          const topics = konular[s.key] || {};
          const total = Object.keys(topics).length;
          const done = Object.values(topics).filter((v) => v === "pekisti").length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          const active = openSubj === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setOpenSubj(s.key)}
              className="text-left p-3 rounded-2xl cursor-pointer transition flex flex-col justify-between"
              style={{
                background: active ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                border: `2px solid ${active ? s.color : COLORS.paperLine}`,
                boxShadow: active ? `0 4px 14px ${s.color}25` : "none"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-sm font-bold truncate" style={{ color: active ? s.color : COLORS.ink }}>
                  {s.name}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 mb-1">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: s.color }} />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{done}/{total} Pekişti</span>
                <span className="font-bold" style={{ color: s.color }}>%{pct}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* DERS ÖZET BANNERI */}
      <div
        className="rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          background: `linear-gradient(135deg, ${currentSubject.color}15 0%, #FFFFFF 100%)`,
          border: `1px solid ${currentSubject.color}33`
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg" style={{ background: currentSubject.color }}>
            {currentSubject.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-slate-900">{currentSubject.name} Dersi Genel Performansı</h3>
              <Badge color={currentSubject.color}>LGS Katsayı: {currentSubject.katsayi}</Badge>
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Tüm konularda toplam {subjectSummary.totalAll} soru üzerinden kümülatif başarı analizi
            </div>
          </div>
        </div>

        {/* ÖZET RAKAMLAR */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] font-semibold text-slate-500">Soru Bankası</div>
            <div className="font-mono text-sm font-bold text-blue-600">
              {subjectSummary.totalSbCozulen} Soru
            </div>
            <div className="text-[10px] text-slate-500">
              {subjectSummary.totalSbDogru}D / {subjectSummary.totalSbYanlis}Y
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] font-semibold text-slate-500">Denemelerde Çıkan</div>
            <div className="font-mono text-sm font-bold text-emerald-600">
              {subjectSummary.totalDenemeCozulen} Soru
            </div>
            <div className="text-[10px] text-slate-500">
              {subjectSummary.totalDenemeDogru}D / {subjectSummary.totalDenemeYanlis}Y
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] font-semibold text-slate-500">Genel Başarı</div>
            <div className="font-mono text-base font-extrabold" style={{ color: currentSubject.color }}>
              %{subjectSummary.genelBasari}
            </div>
            <div className="text-[10px] text-slate-500">
              {subjectSummary.totalYanlisDefteri} Yanlış Kaydı
            </div>
          </div>
        </div>
      </div>

      {/* ARAMA, FİLTRELEME VE SIRALAMA ÇUBUĞU */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`${currentSubject.name} konularında ara...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none border border-slate-200 bg-slate-50 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Durum Filtresi */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white cursor-pointer"
          >
            <option value="hepsi">Tüm Durumlar</option>
            <option value="pekisti">Pekiştirilenler</option>
            <option value="tekrar">Tekrar Gerekenler</option>
            <option value="bekliyor">Bekleyenler</option>
          </select>

          {/* Sıralama */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white cursor-pointer"
          >
            <option value="default">Müfredat Sırasına Göre</option>
            <option value="enCokSoru">En Çok Soru Çözülenler</option>
            <option value="enCokYanlis">En Çok Yanlış Yapılanlar</option>
            <option value="enDusukBasari">En Düşük Başarı Oranı</option>
          </select>
        </div>
      </div>

      {/* DETAYLI KONU KARTLARI LİSTESİ */}
      <div className="flex flex-col gap-3.5">
        {processedTopics.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            text="Arama kriterlerinize uygun konu bulunamadı."
          />
        ) : (
          processedTopics.map((item) => {
            const hasSbData = item.sbCozulen > 0;
            const hasDenemeData = item.denemeToplam > 0;
            const hasAnyData = hasSbData || hasDenemeData;

            return (
              <Card
                key={item.topic}
                hover
                className="transition-all"
                style={{
                  borderLeft: `5px solid ${item.status === "pekisti" ? COLORS.success : item.status === "tekrar" ? COLORS.warn : currentSubject.color}`
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* SOL: Konu Adı, Durum ve Hızlı Butonlar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <TopicStatusButton
                        status={item.status}
                        onClick={() => onCycle(openSubj, item.topic)}
                      />

                      {item.yanlisSayisi > 0 && (
                        <Badge color={COLORS.danger}>
                          <NotebookPen size={11} className="mr-1" />
                          {item.yanlisSayisi} Hata Defterde ({item.tekrarBekleyenYanlis} Bekliyor)
                        </Badge>
                      )}

                      {item.genelBasari !== null && (
                        <Badge color={item.genelBasari >= 85 ? COLORS.success : item.genelBasari >= 65 ? COLORS.warn : COLORS.danger}>
                          %{item.genelBasari} Genel Başarı
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-base text-slate-900 truncate">
                      {item.topic}
                    </h4>

                    {/* Akıllı Öneri Notu */}
                    {hasAnyData && (
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        {hasSbData && hasDenemeData && item.sbBasari > item.denemeBasari + 15 ? (
                          <span className="text-amber-600 font-medium">
                            ⚠️ Soru bankasında iyisin (%{item.sbBasari}) ancak denemelerde (%{item.denemeBasari}) dikkat veya süre kaybı yaşıyorsun.
                          </span>
                        ) : item.genelBasari >= 85 ? (
                          <span className="text-emerald-600 font-medium">
                            ✨ Bu konuya oldukça hakimsin, pekiştirme seviyen yüksek.
                          </span>
                        ) : item.totalYanlis > 10 ? (
                          <span className="text-rose-600 font-medium">
                            📌 Bu konudan toplam {item.totalYanlis} yanlış birikti. Yanlış defterini tekrar etmeni öneririz.
                          </span>
                        ) : (
                          <span>Çalışma verileri kümülatif olarak kaydedilmektedir.</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SAĞ: SORU BANKASI VE DENEME İSTATİSTİK KUTULARI */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                    
                    {/* 1. Soru Bankası / Program Kartı */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-[165px]">
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-700 mb-1">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} /> Soru Bankası
                        </span>
                        <span className="font-mono">{item.sbCozulen} Soru</span>
                      </div>
                      
                      {hasSbData ? (
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono mb-1">
                            <span className="text-emerald-600 font-bold">{item.sbDogru} D</span>
                            <span className="text-rose-600 font-bold">{item.sbYanlis} Y</span>
                            <span className="text-slate-700 font-extrabold">%{item.sbBasari}</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 flex">
                            <div style={{ width: `${item.sbBasari}%`, background: COLORS.success }} />
                            <div style={{ width: `${100 - item.sbBasari}%`, background: COLORS.danger }} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic py-1">Henüz soru girilmedi</div>
                      )}
                    </div>

                    {/* 2. Denemeler Kartı */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-[165px]">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 mb-1">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={12} /> Denemeler
                        </span>
                        <span className="font-mono">{item.denemeToplam} Soru</span>
                      </div>

                      {hasDenemeData ? (
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono mb-1">
                            <span className="text-emerald-600 font-bold">{item.denemeDogru} D</span>
                            <span className="text-rose-600 font-bold">{item.denemeYanlis} Y</span>
                            <span className="text-slate-700 font-extrabold">%{item.denemeBasari}</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 flex">
                            <div style={{ width: `${item.denemeBasari}%`, background: COLORS.success }} />
                            <div style={{ width: `${100 - item.denemeBasari}%`, background: COLORS.danger }} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic py-1">Denemede işaretlenmedi</div>
                      )}
                    </div>

                    {/* Hızlı Soru Ekle Butonu */}
                    <button
                      onClick={() => handleOpenQuickModal(item.topic)}
                      className="btn-secondary px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:border-blue-300 hover:text-blue-600 cursor-pointer"
                      title="Bu konuya çözdüğün soru sayısını kaydet"
                    >
                      <Plus size={14} /> Soru Ekle
                    </button>
                  </div>

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ÖZEL KONU EKLEME KARTI */}
      <Card className="mt-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {currentSubject.name} Dersine Yeni Konu / Ünite Ekle
        </div>
        <div className="flex gap-2">
          <TinyInput
            placeholder={`Örn: ${currentSubject.name} için ek konu veya özel alt başlık...`}
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
          />
          <button
            onClick={handleAddTopic}
            disabled={!newTopic.trim()}
            className="btn-primary px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 disabled:opacity-40"
          >
            + Konu Ekle
          </button>
        </div>
      </Card>

      {/* HIZLI SORU EKLEME MODALI */}
      {quickModalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus size={20} color={COLORS.primary} />
                <h3 className="font-display font-bold text-base text-slate-900">Konuya Soru Çözümü Ekle</h3>
              </div>
              <button onClick={() => setQuickModalTopic(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
              <div className="text-xs text-blue-700 font-semibold">{currentSubject.name}</div>
              <div className="text-sm font-bold text-slate-900">{quickModalTopic}</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Toplam Soru</label>
                <TinyInput
                  type="number"
                  min="1"
                  value={quickSoruSayisi}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setQuickSoruSayisi(val);
                    if (val >= quickYanlis) setQuickDogru(val - quickYanlis);
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-emerald-600 block mb-1">Doğru</label>
                <TinyInput
                  type="number"
                  min="0"
                  max={quickSoruSayisi}
                  value={quickDogru}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setQuickDogru(val);
                    if (quickSoruSayisi >= val) setQuickYanlis(quickSoruSayisi - val);
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-rose-600 block mb-1">Yanlış</label>
                <TinyInput
                  type="number"
                  min="0"
                  max={quickSoruSayisi}
                  value={quickYanlis}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setQuickYanlis(val);
                    if (quickSoruSayisi >= val) setQuickDogru(quickSoruSayisi - val);
                  }}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Kaynak / Not (Opsiyonel)</label>
              <TinyInput
                placeholder="Örn: Hız Yayınları Soru Bankası Test 4-5"
                value={quickKaynak}
                onChange={(e) => setQuickKaynak(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setQuickModalTopic(null)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSaveQuickSoru}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
              >
                İstatistiğe Ekle
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 3. DENEMELER MODÜLÜ                                                    */
/* ---------------------------------------------------------------------- */

function Denemeler({ denemeler, netFormulu, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(denemeler.length === 0);
  const [tarih, setTarih] = useState(todayISO());
  const [isim, setIsim] = useState("");
  const [sureDakika, setSureDakika] = useState(155);
  const [results, setResults] = useState(emptyResults);
  const [expanded, setExpanded] = useState(null);
  const [openTopics, setOpenTopics] = useState(null);

  const updateResult = (key, field, val) => {
    setResults((prev) => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  const updateTopicCount = (subjectKey, topic, field, delta) => {
    setResults((prev) => {
      const cur = prev[subjectKey].konular[topic] || { dogru: 0, yanlis: 0 };
      const nextVal = Math.max(0, (Number(cur[field]) || 0) + delta);
      const updated = { ...cur, [field]: nextVal };
      const konular = { ...prev[subjectKey].konular };
      if (updated.dogru === 0 && updated.yanlis === 0) delete konular[topic];
      else konular[topic] = updated;
      return { ...prev, [subjectKey]: { ...prev[subjectKey], konular } };
    });
  };

  const submit = () => {
    if (!isim.trim()) return;
    onAdd({
      id: uid(),
      tarih,
      isim: isim.trim(),
      sureDakika: Number(sureDakika) || 155,
      results
    });
    setIsim("");
    setSureDakika(155);
    setResults(emptyResults());
    setOpenTopics(null);
    setShowForm(false);
  };

  const sorted = [...denemeler].sort((a, b) => b.tarih.localeCompare(a.tarih));
  
  const chartData = [...denemeler]
    .sort((a, b) => a.tarih.localeCompare(b.tarih))
    .slice(-6)
    .map((d) => {
      const row = { isim: d.isim.length > 10 ? d.isim.slice(0, 10) + "…" : d.isim };
      SUBJECTS.forEach((s) => {
        row[s.name] = Math.round(subjectNet(d, s.key, netFormulu) * 10) / 10;
      });
      return row;
    });

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <SectionTitle icon={TrendingUp}>Deneme Sınavları & Net Analizi</SectionTitle>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Formu Kapat" : "Yeni Deneme Ekle"}
        </button>
      </div>

      {showForm && (
        <Card className="animate-fade-in" style={{ border: `2px solid ${COLORS.primaryLight}` }}>
          <div className="flex items-center gap-2 mb-3">
            <Edit3 size={18} color={COLORS.primary} />
            <h3 className="font-display font-bold text-base" style={{ color: COLORS.ink }}>Yeni Deneme Sonucu Girişi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold block mb-1" style={{ color: COLORS.inkSoft }}>Deneme Adı & Yayın</label>
              <TinyInput
                placeholder="Örn: Özdebir 3. Deneme, Hız LGS-1"
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: COLORS.inkSoft }}>Uygulama Tarihi</label>
              <TinyInput type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: COLORS.inkSoft }}>Toplam Süre (Dakika)</label>
              <TinyInput
                type="number"
                min="10"
                max="300"
                placeholder="155"
                value={sureDakika}
                onChange={(e) => setSureDakika(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SUBJECTS.map((s) => (
              <div key={s.key} className="rounded-xl p-3.5" style={{ background: COLORS.paper, border: `1px solid ${COLORS.paperLine}` }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-sm font-bold" style={{ color: COLORS.ink }}>{s.name}</span>
                  </div>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white text-slate-600">
                    {s.max} Soru
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-emerald-600 block mb-0.5">Doğru</label>
                    <TinyInput
                      type="number"
                      min="0"
                      max={s.max}
                      placeholder="0"
                      value={results[s.key].dogru}
                      onChange={(e) => updateResult(s.key, "dogru", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-rose-600 block mb-0.5">Yanlış</label>
                    <TinyInput
                      type="number"
                      min="0"
                      max={s.max}
                      placeholder="0"
                      value={results[s.key].yanlis}
                      onChange={(e) => updateResult(s.key, "yanlis", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Boş</label>
                    <TinyInput
                      type="number"
                      min="0"
                      max={s.max}
                      placeholder="0"
                      value={results[s.key].bos}
                      onChange={(e) => updateResult(s.key, "bos", e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenTopics(openTopics === s.key ? null : s.key)}
                  className="text-xs font-semibold mt-3 flex items-center justify-between w-full p-1.5 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
                  style={{ color: COLORS.primary, border: `1px solid ${COLORS.paperLine}` }}
                >
                  <span>Konu Bazlı Doğru/Yanlış İşaretle</span>
                  {openTopics === s.key ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openTopics === s.key && (
                  <div className="mt-2.5 flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                    {(DEFAULT_TOPICS[s.key] || []).map((topic) => {
                      const val = results[s.key].konular[topic] || { dogru: 0, yanlis: 0 };
                      return (
                        <div key={topic} className="flex items-center justify-between gap-1 py-1 px-1.5 rounded-lg bg-white text-xs">
                          <span className="truncate flex-1 font-medium text-slate-700" title={topic}>{topic}</span>
                          <Stepper
                            label="D"
                            color={COLORS.success}
                            value={val.dogru}
                            onDec={() => updateTopicCount(s.key, topic, "dogru", -1)}
                            onInc={() => updateTopicCount(s.key, topic, "dogru", 1)}
                          />
                          <Stepper
                            label="Y"
                            color={COLORS.danger}
                            value={val.yanlis}
                            onDec={() => updateTopicCount(s.key, topic, "yanlis", -1)}
                            onInc={() => updateTopicCount(s.key, topic, "yanlis", 1)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3" style={{ borderTop: `1px solid ${COLORS.paperLine}` }}>
            <div className="text-xs text-slate-500">
              LGS kuralı: 3 yanlış 1 doğruyu götürür (Net = Doğru − Yanlış/3). Tahmini puan otomatik hesaplanacaktır.
            </div>
            <button
              onClick={submit}
              disabled={!isim.trim()}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 w-full sm:w-auto"
            >
              Denemeyi Kaydet
            </button>
          </div>
        </Card>
      )}

      {chartData.length >= 2 && (
        <Card>
          <SectionTitle icon={BarChart2}>Derslere Göre Net Karşılaştırması</SectionTitle>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, left: -20, right: 10, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="isim" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} domain={[0, 20]} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 12,
                    border: `1px solid ${COLORS.paperLine}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                {SUBJECTS.map((s) => (
                  <Bar key={s.key} dataKey={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* KÜMÜLATİF KONU ANALİZİ */}
      <TopicAnalysisCard denemeler={denemeler} />

      {/* TÜM DENEMELER LİSTESİ */}
      <Card>
        <SectionTitle icon={ClipboardList}>
          Kayıtlı Denemeler ({sorted.length})
        </SectionTitle>
        {sorted.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            text="Henüz deneme kaydetmediniz. Yukarıdaki 'Yeni Deneme Ekle' butonu ile ilk denemenizi kaydedin."
            action={
              <button onClick={() => setShowForm(true)} className="btn-primary text-xs px-3 py-1.5 rounded-lg mt-2">
                İlk Denemeyi Gir
              </button>
            }
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {sorted.map((d) => {
              const net = totalNet(d, netFormulu);
              const score = calculateLGSScore(d.results, netFormulu);
              const isOpen = expanded === d.id;
              return (
                <div
                  key={d.id}
                  className="rounded-2xl transition overflow-hidden"
                  style={{ border: `1px solid ${COLORS.paperLine}`, background: isOpen ? "#FAFBFD" : "#FFFFFF" }}
                >
                  <div
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 gap-3"
                    onClick={() => setExpanded(isOpen ? null : d.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold truncate text-slate-900">{d.isim}</span>
                        {d.sureDakika && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            ⏱️ {d.sureDakika} dk ({(d.sureDakika / 90).toFixed(1)} dk/soru)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{fmtDate(d.tarih)}</div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-extrabold text-base sm:text-lg" style={{ color: COLORS.primary }}>
                          {net.toFixed(2)} Net
                        </div>
                        <div className="text-[11px] font-mono font-semibold text-emerald-600">
                          {score} Puan (≈ %{calculateLGSPercentile2026(score)})
                        </div>
                      </div>

                      <div className="p-1 rounded-lg text-slate-400">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`"${d.isim}" denemesini silmek istediğinize emin misiniz?`)) {
                            onDelete(d.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition"
                        title="Denemeyi Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50">
                      {/* SÜRE & HIZ ANALİZİ KUTUCUĞU */}
                      <div className="flex items-center justify-between p-2.5 mb-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                        <div className="flex items-center gap-2">
                          <Clock size={15} className="text-blue-600" />
                          <span className="font-semibold text-blue-900">
                            Sınav Süresi & Tempo: {d.sureDakika || 155} dk
                          </span>
                        </div>
                        <span className="text-slate-600">
                          Ortalama Soru Başına: <strong className="text-blue-700 font-mono">{((d.sureDakika || 155) / 90).toFixed(2)} dakika</strong> (LGS Standardı: 1.72 dk)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                        {SUBJECTS.map((s) => {
                          const r = d.results?.[s.key] || {};
                          const sNet = subjectNet(d, s.key, netFormulu);
                          return (
                            <div key={s.key} className="bg-white p-2.5 rounded-xl border border-slate-200">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                                <span className="text-xs font-bold truncate">{s.name}</span>
                              </div>
                              <div className="font-mono text-sm font-bold text-slate-900">{sNet.toFixed(2)} Net</div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                D: {r.dogru || 0} | Y: {r.yanlis || 0} | B: {r.bos || 0}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Konu detayları varsa */}
                      {(() => {
                        const hasTopicData = SUBJECTS.some(
                          (s) => Object.keys(d.results?.[s.key]?.konular || {}).length > 0
                        );
                        if (!hasTopicData) return null;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <div className="text-xs font-bold text-slate-700 mb-2">Bu Denemede İşaretlenen Konular:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {SUBJECTS.map((s) => {
                                const konular = d.results?.[s.key]?.konular || {};
                                return Object.entries(konular).map(([topic, val]) => (
                                  <span
                                    key={s.key + topic}
                                    className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 flex items-center gap-1"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                                    <span>{topic}</span>
                                    {val.dogru > 0 && <span className="text-emerald-600 font-bold">{val.dogru}D</span>}
                                    {val.yanlis > 0 && <span className="text-rose-600 font-bold">{val.yanlis}Y</span>}
                                  </span>
                                ));
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function TopicAnalysisCard({ denemeler }) {
  const [filtre, setFiltre] = useState("hepsi");
  const stats = topicStats(denemeler);

  if (stats.length === 0) {
    return (
      <Card>
        <SectionTitle icon={AlertTriangle}>Denemelerde Hata Yapılan Konular</SectionTitle>
        <EmptyState
          icon={AlertTriangle}
          text="Deneme eklerken 'Konu Bazlı Doğru/Yanlış İşaretle' seçeneğiyle konuları işaretlediğinizde, hangi konularda hata biriktiği burada listelenir."
        />
      </Card>
    );
  }

  const filtered = (filtre === "hepsi" ? stats : stats.filter((s) => s.subjectKey === filtre))
    .slice()
    .sort((a, b) => b.yanlis - a.yanlis || b.dogru - a.dogru);

  const maxCount = Math.max(...filtered.map((s) => s.yanlis + s.dogru), 1);

  return (
    <Card>
      <SectionTitle icon={AlertTriangle}>Denemelerde Hata Yapılan Konular — Eksik Tespiti</SectionTitle>
      
      {/* Filtre Sekmeleri */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2">
        <button
          onClick={() => setFiltre("hepsi")}
          className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 cursor-pointer transition"
          style={{
            background: filtre === "hepsi" ? COLORS.ink : "#FFFFFF",
            color: filtre === "hepsi" ? "#FFFFFF" : COLORS.inkSoft,
            border: `1px solid ${COLORS.paperLine}`
          }}
        >
          Tüm Dersler
        </button>
        {SUBJECTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setFiltre(s.key)}
            className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 cursor-pointer transition"
            style={{
              background: filtre === s.key ? s.color : "#FFFFFF",
              color: filtre === s.key ? "#FFFFFF" : COLORS.inkSoft,
              border: `1px solid ${COLORS.paperLine}`
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="Bu ders için henüz konu bazlı bir veri girilmedi." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => {
            const total = s.yanlis + s.dogru;
            const yanlisPct = (s.yanlis / total) * 100;
            return (
              <div key={s.subjectKey + s.topic} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-xs sm:text-sm font-bold truncate text-slate-900">{s.topic}</span>
                    <Badge color={s.color} style={{ fontSize: "10px", padding: "1px 6px" }}>{s.subject}</Badge>
                  </div>
                  <span className="text-xs font-mono font-semibold flex-shrink-0">
                    <span className="text-rose-600">{s.yanlis} Yanlış</span> · <span className="text-emerald-600">{s.dogru} Doğru</span>
                  </span>
                </div>
                
                <div className="h-2 rounded-full overflow-hidden flex bg-slate-200" style={{ width: `${Math.max(25, (total / maxCount) * 100)}%` }}>
                  <div style={{ width: `${yanlisPct}%`, background: COLORS.danger }} title={`${s.yanlis} Yanlış`} />
                  <div style={{ width: `${100 - yanlisPct}%`, background: COLORS.success }} title={`${s.dogru} Doğru`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------------- */
/* 4. HAFTALIK ÇALIŞMA PROGRAMI                                           */
/* ---------------------------------------------------------------------- */

function Program({
  program,
  haftalikGecmis = [],
  onAdd,
  onComplete,
  onReopen,
  onDelete,
  onAddHaftalikGecmis,
  onDeleteHaftalikGecmis,
  onArchiveWeek
}) {
  const [programViewTab, setProgramViewTab] = useState("aktif"); // "aktif" | "karsilastirma"
  const [day, setDay] = useState(DAYS[0]);
  const [ders, setDers] = useState(SUBJECTS[0].key);
  const [konu, setKonu] = useState(DEFAULT_TOPICS[SUBJECTS[0].key][0]);
  const [hedefSoru, setHedefSoru] = useState(20);
  const [activeDayTab, setActiveDayTab] = useState(DAYS[(new Date().getDay() + 6) % 7]);

  // Tamamlama Modalı State'i
  const [completingItem, setCompletingItem] = useState(null);
  const [modalCozulen, setModalCozulen] = useState(20);
  const [modalDogru, setModalDogru] = useState(18);
  const [modalYanlis, setModalYanlis] = useState(2);

  // Arşivleme Modalı State'i
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTitle, setArchiveTitle] = useState("");
  const [archiveDateRange, setArchiveDateRange] = useState("");

  // Geçmiş Hafta Ekleme Modalı State'i
  const [showAddPastModal, setShowAddPastModal] = useState(false);
  const [pastTitle, setPastTitle] = useState("");
  const [pastDateRange, setPastDateRange] = useState("");
  const [pastHedef, setPastHedef] = useState(500);
  const [pastCozulen, setPastCozulen] = useState(450);
  const [pastDogru, setPastDogru] = useState(400);
  const [pastYanlis, setPastYanlis] = useState(40);
  const [pastDersler, setPastDersler] = useState({
    turkce: 100,
    matematik: 100,
    fen: 100,
    inkilap: 50,
    din: 50,
    ingilizce: 50
  });

  const changeDers = (key) => {
    setDers(key);
    setKonu(DEFAULT_TOPICS[key]?.[0] || "");
  };

  const submit = () => {
    if (!konu) return;
    onAdd(day, {
      id: uid(),
      ders,
      konu,
      hedefSoru: Number(hedefSoru) || 10,
      tamamlandi: false,
      sonuc: null
    });
    setHedefSoru(20);
  };

  const openCompletionModal = (item) => {
    setCompletingItem(item);
    setModalCozulen(item.hedefSoru || 20);
    setModalDogru(item.hedefSoru ? Math.max(0, item.hedefSoru - 2) : 18);
    setModalYanlis(2);
  };

  const saveCompletion = () => {
    if (!completingItem) return;
    onComplete(activeDayTab, completingItem.id, {
      cozulen: Number(modalCozulen) || 0,
      dogru: Number(modalDogru) || 0,
      yanlis: Number(modalYanlis) || 0
    });
    setCompletingItem(null);
  };

  // Bu haftanın özet hesaplamaları
  const haftaOzet = useMemo(() => {
    let hedef = 0, cozulen = 0, dogru = 0, yanlis = 0;
    const dersler = { turkce: 0, matematik: 0, fen: 0, inkilap: 0, din: 0, ingilizce: 0 };
    DAYS.forEach((d) => {
      (program[d] || []).forEach((it) => {
        hedef += Number(it.hedefSoru) || 0;
        if (it.tamamlandi && it.sonuc) {
          const c = Number(it.sonuc.cozulen) || 0;
          const dg = Number(it.sonuc.dogru) || 0;
          const yn = Number(it.sonuc.yanlis) || 0;
          cozulen += c;
          dogru += dg;
          yanlis += yn;
          if (it.ders && dersler[it.ders] !== undefined) {
            dersler[it.ders] += c;
          }
        }
      });
    });
    const basari = cozulen > 0 ? Math.round((dogru / cozulen) * 100) : 0;
    const tamamlanma = hedef > 0 ? Math.round((cozulen / hedef) * 100) : 0;
    return { hedef, cozulen, dogru, yanlis, basari, tamamlanma, dersler };
  }, [program]);

  // Günlük Soru Grafiği Verisi
  const dailyData = useMemo(() => {
    return DAYS.map((d) => {
      let hedef = 0, cozulen = 0, dogru = 0, yanlis = 0;
      (program[d] || []).forEach((it) => {
        hedef += Number(it.hedefSoru) || 0;
        if (it.tamamlandi && it.sonuc) {
          cozulen += Number(it.sonuc.cozulen) || 0;
          dogru += Number(it.sonuc.dogru) || 0;
          yanlis += Number(it.sonuc.yanlis) || 0;
        }
      });
      return {
        name: d.slice(0, 3),
        tamGun: d,
        "Hedef": hedef,
        "Çözülen": cozulen,
        "Doğru": dogru,
        "Yanlış": yanlis
      };
    });
  }, [program]);

  // Derslere göre bu hafta çözülen sorular
  const weeklySubjectData = useMemo(() => {
    const map = {};
    SUBJECTS.forEach((s) => (map[s.key] = { cozulen: 0, dogru: 0, yanlis: 0 }));
    DAYS.forEach((d) => {
      (program[d] || []).forEach((it) => {
        if (it.tamamlandi && it.sonuc && it.ders && map[it.ders]) {
          map[it.ders].cozulen += Number(it.sonuc.cozulen) || 0;
          map[it.ders].dogru += Number(it.sonuc.dogru) || 0;
          map[it.ders].yanlis += Number(it.sonuc.yanlis) || 0;
        }
      });
    });
    return SUBJECTS.map((s) => ({
      name: s.name,
      "Çözülen": map[s.key]?.cozulen || 0,
      "Doğru": map[s.key]?.dogru || 0,
      "Yanlış": map[s.key]?.yanlis || 0,
      color: s.color
    }));
  }, [program]);

  // Tüm haftaların birleştirilmiş karşılaştırma listesi (Geçmiş + Bu Hafta)
  const allWeeksList = useMemo(() => {
    const list = [...(haftalikGecmis || [])].map((w) => ({
      ...w,
      isCurrent: false
    }));

    list.push({
      id: "current-active",
      etiket: "Bu Hafta",
      tarihAraligi: "Aktif Hafta",
      toplamSoru: haftaOzet.cozulen,
      hedefSoru: haftaOzet.hedef,
      dogru: haftaOzet.dogru,
      yanlis: haftaOzet.yanlis,
      bos: Math.max(0, haftaOzet.cozulen - (haftaOzet.dogru + haftaOzet.yanlis)),
      dersler: haftaOzet.dersler,
      isCurrent: true
    });

    return list.map((w, idx, arr) => {
      const prev = idx > 0 ? arr[idx - 1] : null;
      const diff = prev ? w.toplamSoru - prev.toplamSoru : 0;
      const diffPct = prev && prev.toplamSoru > 0 ? Math.round((diff / prev.toplamSoru) * 100) : 0;
      const dogruluk = w.toplamSoru > 0 ? Math.round((w.dogru / w.toplamSoru) * 100) : 0;
      const tamamlanma = w.hedefSoru > 0 ? Math.round((w.toplamSoru / w.hedefSoru) * 100) : 0;
      return {
        ...w,
        "Çözülen Soru": w.toplamSoru,
        "Hedef Soru": w.hedefSoru,
        "Doğruluk %": dogruluk,
        tamamlanma,
        diff,
        diffPct
      };
    });
  }, [haftalikGecmis, haftaOzet]);

  // Ders Bazlı Karşılaştırma Grafiği Verisi
  const subjectComparisonChartData = useMemo(() => {
    return SUBJECTS.map((s) => {
      const row = { dersAdi: s.name, color: s.color };
      allWeeksList.forEach((w) => {
        row[w.etiket] = w.dersler?.[s.key] || 0;
      });
      return row;
    });
  }, [allWeeksList]);

  // Karşılaştırma Genel İstatistikleri
  const pastStatsSummary = useMemo(() => {
    const totalQuestions = allWeeksList.reduce((acc, w) => acc + (w.toplamSoru || 0), 0);
    const avgQuestions = allWeeksList.length > 0 ? Math.round(totalQuestions / allWeeksList.length) : 0;
    const maxWeek = allWeeksList.reduce((max, w) => (w.toplamSoru > (max?.toplamSoru || 0) ? w : max), allWeeksList[0]);
    return { totalQuestions, avgQuestions, maxWeek, weekCount: allWeeksList.length };
  }, [allWeeksList]);

  const currentDayList = program[activeDayTab] || [];

  const handleSaveArchive = () => {
    if (onArchiveWeek) {
      onArchiveWeek(archiveTitle.trim() || `Hafta (${fmtDate(todayISO())})`, archiveDateRange.trim());
    }
    setShowArchiveModal(false);
    setArchiveTitle("");
    setArchiveDateRange("");
  };

  const handleSavePastWeek = () => {
    if (!pastTitle.trim()) return;
    const newWeek = {
      id: uid(),
      etiket: pastTitle.trim(),
      tarihAraligi: pastDateRange.trim() || "Belirtilmedi",
      toplamSoru: Number(pastCozulen) || 0,
      hedefSoru: Number(pastHedef) || 0,
      dogru: Number(pastDogru) || 0,
      yanlis: Number(pastYanlis) || 0,
      bos: Math.max(0, (Number(pastCozulen) || 0) - ((Number(pastDogru) || 0) + (Number(pastYanlis) || 0))),
      dersler: { ...pastDersler }
    };
    if (onAddHaftalikGecmis) onAddHaftalikGecmis(newWeek);
    setShowAddPastModal(false);
    setPastTitle("");
    setPastDateRange("");
  };

  // Haftalık karşılaştırma renk paleti
  const weekColors = ["#94A3B8", "#38BDF8", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      
      {/* ÜST GEZİNME VE GÖRÜNÜM SEKMELERİ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setProgramViewTab("aktif")}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            style={{
              background: programViewTab === "aktif" ? COLORS.primary : "#F1F5F9",
              color: programViewTab === "aktif" ? "#FFFFFF" : COLORS.inkSoft
            }}
          >
            <ClipboardList size={15} />
            <span>Bu Haftanın Programı & Soru Dağılımı</span>
          </button>

          <button
            onClick={() => setProgramViewTab("karsilastirma")}
            className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            style={{
              background: programViewTab === "karsilastirma" ? COLORS.primary : "#F1F5F9",
              color: programViewTab === "karsilastirma" ? "#FFFFFF" : COLORS.inkSoft
            }}
          >
            <History size={15} />
            <span>Geçmiş Haftalar & Soru Karşılaştırma Analizi</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
              {allWeeksList.length} Hafta
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {programViewTab === "aktif" ? (
            <button
              onClick={() => {
                setArchiveTitle(`Hafta (${fmtDate(todayISO())})`);
                setArchiveDateRange("Bu Hafta");
                setShowArchiveModal(true);
              }}
              className="btn-secondary text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition"
              title="Bu haftayı arşivle ve yeni haftanın programını temizle"
            >
              <Archive size={15} className="text-amber-600" />
              <span>Haftayı Arşivle & Yeni Haftaya Başla</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddPastModal(true)}
                className="btn-primary text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Geçmiş Hafta Ekle</span>
              </button>
              <button
                onClick={() => {
                  setArchiveTitle(`Hafta (${fmtDate(todayISO())})`);
                  setArchiveDateRange("Bu Hafta");
                  setShowArchiveModal(true);
                }}
                className="btn-secondary text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                title="Aktif haftayı arşive aktar"
              >
                <Archive size={14} />
                <span>Bu Haftayı Arşivle</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. GÖRÜNÜM: BU HAFTANIN PROGRAMI                                         */}
      {/* ========================================================================= */}
      {programViewTab === "aktif" && (
        <>
          {/* HAFTALIK ÖZET KARTLARI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Target size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Haftalık Plan</div>
                <div className="text-xl font-mono font-bold text-slate-900">{haftaOzet.hedef} Soru</div>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Bu Hafta Çözülen</div>
                <div className="text-xl font-mono font-bold text-emerald-600">{haftaOzet.cozulen} Soru</div>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Award size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Doğruluk Oranı</div>
                <div className="text-xl font-mono font-bold text-indigo-600">
                  %{haftaOzet.basari} <span className="text-xs font-normal text-slate-400">({haftaOzet.dogru}D / {haftaOzet.yanlis}Y)</span>
                </div>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Hedef Tamamlama</div>
                <div className="text-xl font-mono font-bold text-amber-600">%{haftaOzet.tamamlanma}</div>
              </div>
            </Card>
          </div>

          {/* HAFTALIK SORU GRAFİKLERİ (GÜNLÜK VE DERS DAĞILIMI) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BarChart2 size={16} className="text-blue-600" />
                Günlük Soru Çözüm Analizi (Hedef vs. Çözülen)
              </div>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <BarChart data={dailyData} margin={{ top: 5, left: -20, right: 10, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.paperLine}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                      }}
                      formatter={(value, name) => [`${value} Soru`, name]}
                      labelFormatter={(label) => {
                        const found = dailyData.find((x) => x.name === label);
                        return found ? found.tamGun : label;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Hedef" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Çözülen" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <PieChartIcon size={16} className="text-emerald-600" />
                Derslere Göre Bu Hafta Çözülen Soru Dağılımı
              </div>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklySubjectData} margin={{ top: 5, left: -20, right: 10, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: COLORS.inkSoft }} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.paperLine}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                      }}
                      formatter={(value, name, item) => [`${value} Soru (${item.payload.Doğru}D / ${item.payload.Yanlış}Y)`, name]}
                    />
                    <Bar dataKey="Çözülen" radius={[4, 4, 0, 0]} maxBarSize={28}>
                      {weeklySubjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS.primary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* YENİ PLAN EKLEME KARTI */}
          <Card>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Programa Görev Ekle</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Gün</label>
                <TinySelect value={day} onChange={(e) => setDay(e.target.value)}>
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </TinySelect>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Ders</label>
                <TinySelect value={ders} onChange={(e) => changeDers(e.target.value)}>
                  {SUBJECTS.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
                </TinySelect>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Konu</label>
                <TinySelect value={konu} onChange={(e) => setKonu(e.target.value)}>
                  {(DEFAULT_TOPICS[ders] || []).map((t) => <option key={t} value={t}>{t}</option>)}
                </TinySelect>
              </div>

              <div className="flex gap-2">
                <div className="w-24">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Hedef Soru</label>
                  <TinyInput
                    type="number"
                    min="1"
                    value={hedefSoru}
                    onChange={(e) => setHedefSoru(e.target.value)}
                  />
                </div>
                <button
                  onClick={submit}
                  className="btn-primary px-4 py-2 rounded-xl text-sm font-bold mt-auto h-[38px] flex-1 flex items-center justify-center gap-1"
                >
                  <Plus size={16} /> Ekle
                </button>
              </div>
            </div>
          </Card>

          {/* GÜN SEKMELERİ VE GÜNLÜK LİSTE */}
          <Card>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-100">
              {DAYS.map((d) => {
                const count = (program[d] || []).length;
                const completedCount = (program[d] || []).filter((x) => x.tamamlandi).length;
                const active = activeDayTab === d;
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDayTab(d)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold flex-shrink-0 cursor-pointer transition flex items-center gap-1.5"
                    style={{
                      background: active ? COLORS.primary : "#F1F5F9",
                      color: active ? "#FFFFFF" : COLORS.inkSoft
                    }}
                  >
                    <span>{d}</span>
                    {count > 0 && (
                      <span
                        className="px-1.5 py-0.2 rounded-full text-[10px]"
                        style={{
                          background: active ? "rgba(255,255,255,0.25)" : "#E2E8F0",
                          color: active ? "#FFFFFF" : COLORS.ink
                        }}
                      >
                        {completedCount}/{count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {currentDayList.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                text={`${activeDayTab} günü için planlanmış çalışma yok.`}
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {currentDayList.map((item) => {
                  const subj = SUBJECTS.find((s) => s.key === item.ders);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl transition"
                      style={{
                        background: item.tamamlandi ? "#F0FDF4" : "#FFFFFF",
                        border: `1px solid ${item.tamamlandi ? "#BBF7D0" : COLORS.paperLine}`
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => {
                            if (item.tamamlandi) onReopen(activeDayTab, item.id);
                            else openCompletionModal(item);
                          }}
                          className="cursor-pointer text-slate-400 hover:text-blue-600 transition"
                          title={item.tamamlandi ? "Tekrar aç" : "Tamamla"}
                        >
                          {item.tamamlandi ? (
                            <CheckCircle2 size={22} color={COLORS.success} />
                          ) : (
                            <Circle size={22} />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Badge color={subj?.color || COLORS.primary}>{subj?.name}</Badge>
                            <span className="text-sm font-bold text-slate-900 truncate">{item.konu}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {item.tamamlandi && item.sonuc ? (
                              <span className="font-mono text-emerald-700 font-bold">
                                {item.sonuc.cozulen} Soru Çözüldü ({item.sonuc.dogru}D / {item.sonuc.yanlis}Y)
                              </span>
                            ) : (
                              <span>Hedef: <b>{item.hedefSoru} Soru</b></span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.tamamlandi && (
                          <button
                            onClick={() => openCompletionModal(item)}
                            className="btn-primary text-xs px-3 py-1.5 rounded-lg font-bold"
                          >
                            Tamamla
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(activeDayTab, item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. GÖRÜNÜM: GEÇMİŞ HAFTALAR KARŞILAŞTIRMASI & GELİŞİM TRENDİ             */}
      {/* ========================================================================= */}
      {programViewTab === "karsilastirma" && (
        <div className="flex flex-col gap-5 animate-fade-in">
          
          {/* GEÇMİŞ HAFTALAR ÖZET İSTATİSTİKLERİ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Calendar size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Toplam Takip Edilen</div>
                <div className="text-xl font-mono font-bold text-slate-900">{pastStatsSummary.weekCount} Hafta</div>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckSquare size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Tüm Zamanlar Çözülen</div>
                <div className="text-xl font-mono font-bold text-emerald-600">{pastStatsSummary.totalQuestions} Soru</div>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Haftalık Ortalama</div>
                <div className="text-xl font-mono font-bold text-indigo-600">{pastStatsSummary.avgQuestions} Soru/Hafta</div>
              </div>
            </Card>

            <Card className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Award size={22} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Haftalık Rekor</div>
                <div className="text-xl font-mono font-bold text-amber-600">
                  {pastStatsSummary.maxWeek?.toplamSoru || 0} Soru
                </div>
              </div>
            </Card>
          </div>

          {/* HAFTALIK SORU VE HEDEF GELİŞİM GRAFİĞİ */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-blue-600" />
                Haftalık Soru Çözüm & Hedef Trendi (Hafta Hafta Karşılaştırma)
              </div>
              <span className="text-xs text-slate-500 font-medium">Hedef vs. Gerçekleşen Soru Sayıları</span>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={allWeeksList} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="etiket" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: `1px solid ${COLORS.paperLine}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                    formatter={(value, name) => [`${value} Soru`, name]}
                    labelFormatter={(label, payload) => {
                      const itm = payload?.[0]?.payload;
                      return itm ? `${itm.etiket} (${itm.tarihAraligi})` : label;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                  <Bar dataKey="Hedef Soru" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="Çözülen Soru" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* DERSLERE GÖRE HAFTALIK KARŞILAŞTIRMA GRAFİĞİ */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={16} className="text-indigo-600" />
                Ders Bazlı Haftalık Soru Karşılaştırması
              </div>
              <span className="text-xs text-slate-500 font-medium">Her ders için haftalık çözülen soru adetleri</span>
            </div>

            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={subjectComparisonChartData} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.paperLine} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="dersAdi" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: `1px solid ${COLORS.paperLine}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}
                    formatter={(value, name) => [`${value} Soru`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  {allWeeksList.map((w, index) => (
                    <Bar
                      key={w.id}
                      dataKey={w.etiket}
                      fill={weekColors[index % weekColors.length]}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={18}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* HAFTALIK DETAYLI KARŞILAŞTIRMA KARTLARI LİSTESİ */}
          <Card>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <History size={16} className="text-blue-600" />
                Haftalık Gelişim ve Karşılaştırma Kartları
              </div>
              <span className="text-xs text-slate-500">Kronolojik İlerleme Sıralaması</span>
            </div>

            <div className="flex flex-col gap-3.5">
              {allWeeksList.map((w, idx) => {
                return (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl transition"
                    style={{
                      background: w.isCurrent ? "#EFF6FF" : "#F8FAFC",
                      border: `1px solid ${w.isCurrent ? "#BFDBFE" : "#E2E8F0"}`
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                          style={{
                            background: w.isCurrent ? COLORS.primary : "#E2E8F0",
                            color: w.isCurrent ? "#FFFFFF" : COLORS.ink
                          }}
                        >
                          H{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-slate-900">{w.etiket}</span>
                            {w.isCurrent ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                                Aktif Hafta
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                                Arşivlendi
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{w.tarihAraligi}</div>
                        </div>
                      </div>

                      {/* Gelişim Rozetleri & Karşılaştırma */}
                      <div className="flex items-center gap-3">
                        {w.diff !== 0 && (
                          <div
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                              w.diff > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {w.diff > 0 ? (
                              <>
                                <ArrowUpRight size={14} />
                                <span>+{w.diff} Soru (+%{w.diffPct} Artış 🚀)</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight size={14} />
                                <span>{w.diff} Soru (%{w.diffPct})</span>
                              </>
                            )}
                          </div>
                        )}

                        <div className="text-right">
                          <div className="text-base font-mono font-bold text-slate-900">
                            {w.toplamSoru} <span className="text-xs font-normal text-slate-500">/ {w.hedefSoru} Soru</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            %{w["Doğruluk %"]} Başarı ({w.dogru}D / {w.yanlis}Y)
                          </div>
                        </div>

                        {!w.isCurrent && (
                          <button
                            onClick={() => onDeleteHaftalikGecmis && onDeleteHaftalikGecmis(w.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                            title="Bu haftayı sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* İlerleme Çubuğu */}
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          w.isCurrent ? "bg-blue-600" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, w.tamamlanma)}%` }}
                      />
                    </div>

                    {/* Ders Bazlı Dağılım Çipleri */}
                    {w.dersler && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                        {SUBJECTS.map((s) => {
                          const val = w.dersler[s.key] || 0;
                          return (
                            <div
                              key={s.key}
                              className="px-2 py-0.8 rounded-lg bg-white border border-slate-200 text-[11px] font-medium flex items-center gap-1.5 shadow-2xs"
                            >
                              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                              <span className="text-slate-600">{s.name}:</span>
                              <span className="font-mono font-bold text-slate-800">{val} Soru</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ÇALIŞMA BLOĞUNU TAMAMLAMA                                          */}
      {/* ========================================================================= */}
      {completingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} color={COLORS.success} />
                <h3 className="font-display font-bold text-base text-slate-900">Çalışma Bloğunu Tamamla</h3>
              </div>
              <button onClick={() => setCompletingItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-500 font-medium">Hedeflenen Görev:</div>
              <div className="text-sm font-bold text-slate-800">{completingItem.konu}</div>
              <div className="text-xs text-slate-600 mt-0.5">Planlanan: {completingItem.hedefSoru} Soru</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Çözülen</label>
                <TinyInput
                  type="number"
                  min="0"
                  value={modalCozulen}
                  onChange={(e) => setModalCozulen(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-emerald-600 block mb-1">Doğru</label>
                <TinyInput
                  type="number"
                  min="0"
                  value={modalDogru}
                  onChange={(e) => setModalDogru(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-rose-600 block mb-1">Yanlış</label>
                <TinyInput
                  type="number"
                  min="0"
                  value={modalYanlis}
                  onChange={(e) => setModalYanlis(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCompletingItem(null)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs"
              >
                Vazgeç
              </button>
              <button
                onClick={saveCompletion}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
              >
                Kaydet ve Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 5. YANLIŞ DEFTERİ (HATA GÜNLÜĞÜ)                                       */
/* ---------------------------------------------------------------------- */

function YanlisDefteri({ yanlislar, onAdd, onToggle, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [ders, setDers] = useState(SUBJECTS[0].key);
  const [konu, setKonu] = useState(DEFAULT_TOPICS[SUBJECTS[0].key][0]);
  const [soruNotu, setSoruNotu] = useState("");
  const [neden, setNeden] = useState(REASONS[0]);
  const [cozumNotu, setCozumNotu] = useState("");

  const [filterDers, setFilterDers] = useState("hepsi");
  const [filterTekrar, setFilterTekrar] = useState("hepsi");

  const changeDers = (key) => {
    setDers(key);
    setKonu(DEFAULT_TOPICS[key]?.[0] || "");
  };

  const submit = () => {
    if (!soruNotu.trim()) return;
    onAdd({
      id: uid(),
      tarih: todayISO(),
      ders,
      konu,
      soruNotu: soruNotu.trim(),
      neden,
      cozumNotu: cozumNotu.trim(),
      tekrarEdildi: false
    });
    setSoruNotu("");
    setCozumNotu("");
    setShowForm(false);
  };

  const filtered = yanlislar.filter((y) => {
    if (filterDers !== "hepsi" && y.ders !== filterDers) return false;
    if (filterTekrar === "bekliyor" && y.tekrarEdildi) return false;
    if (filterTekrar === "tekrarEdildi" && !y.tekrarEdildi) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <SectionTitle icon={NotebookPen}>Yanlış Defteri & Hata Analizi</SectionTitle>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Kapat" : "Yeni Yanlış Ekle"}
        </button>
      </div>

      {showForm && (
        <Card className="animate-fade-in" style={{ border: `2px solid ${COLORS.danger}33` }}>
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Yanlış Soru Kaydı</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Ders</label>
              <TinySelect value={ders} onChange={(e) => changeDers(e.target.value)}>
                {SUBJECTS.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
              </TinySelect>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Konu</label>
              <TinySelect value={konu} onChange={(e) => setKonu(e.target.value)}>
                {(DEFAULT_TOPICS[ders] || []).map((t) => <option key={t} value={t}>{t}</option>)}
              </TinySelect>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Yanlış Nedeni</label>
              <TinySelect value={neden} onChange={(e) => setNeden(e.target.value)}>
                {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </TinySelect>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs font-semibold text-slate-600 block mb-1">Soru Metni / Neyi Yanlış Yaptın?</label>
            <textarea
              rows="3"
              placeholder="Örn: 2024 Deneme 2 Fen Basınç sorusu. Sıvı basıncının kabın şekline bağlı olmadığını unuttum..."
              value={soruNotu}
              onChange={(e) => setSoruNotu(e.target.value)}
              className="w-full rounded-xl p-3 text-sm outline-none border border-slate-200"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-600 block mb-1">Doğru Çözüm Notu / Öğrenilen Kural (Püf Noktası)</label>
            <textarea
              rows="2"
              placeholder="Örn: P = h * d formülü geçerlidir. Kap tabanındaki sıvı basıncı sadece derinlik ve yoğunluğa bağlıdır."
              value={cozumNotu}
              onChange={(e) => setCozumNotu(e.target.value)}
              className="w-full rounded-xl p-3 text-sm outline-none border border-slate-200 bg-emerald-50/40"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold">
              Vazgeç
            </button>
            <button onClick={submit} disabled={!soruNotu.trim()} className="btn-primary px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-40">
              Deftere Kaydet
            </button>
          </div>
        </Card>
      )}

      {/* ARALIKLI TEKRAR (SPACED REPETITION / 1-3-7-30 GÜN KUTULARI) */}
      <SpacedRepetition
        yanlislar={yanlislar}
        onToggle={onToggle}
      />

      {/* FİLTRELER */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterDers("hepsi")}
            className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
            style={{
              background: filterDers === "hepsi" ? COLORS.ink : "#F1F5F9",
              color: filterDers === "hepsi" ? "#FFFFFF" : COLORS.inkSoft
            }}
          >
            Tüm Dersler
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilterDers(s.key)}
              className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
              style={{
                background: filterDers === s.key ? s.color : "#F1F5F9",
                color: filterDers === s.key ? "#FFFFFF" : COLORS.inkSoft
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterTekrar}
            onChange={(e) => setFilterTekrar(e.target.value)}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-200 bg-white"
          >
            <option value="hepsi">Tüm Durumlar</option>
            <option value="bekliyor">Tekrar Bekleyenler</option>
            <option value="tekrarEdildi">Pekiştirilenler</option>
          </select>
        </div>
      </div>

      {/* YANLIŞ KARTLARI */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          text="Seçilen filtreye uygun kayıtlı yanlış bulunamadı."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary text-xs px-3 py-1.5 rounded-lg mt-2">
              Yanlış Soru Ekle
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const subj = SUBJECTS.find((s) => s.key === item.ders);
            return (
              <Card
                key={item.id}
                hover
                className="flex flex-col justify-between"
                style={{
                  borderLeft: `5px solid ${subj?.color || COLORS.primary}`,
                  background: item.tekrarEdildi ? "#F8FAFC" : "#FFFFFF"
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge color={subj?.color || COLORS.primary}>{subj?.name}</Badge>
                      <Badge color="#475569">{item.konu}</Badge>
                      <Badge color={COLORS.danger}>{item.neden}</Badge>
                    </div>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-slate-900 mt-2 mb-2">
                    {item.soruNotu}
                  </div>

                  {item.cozumNotu && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 mb-3">
                      <span className="font-bold block text-emerald-800">Çözüm / Püf Noktası:</span>
                      {item.cozumNotu}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-xs">
                  <span className="text-slate-400 font-medium">{fmtDate(item.tarih)}</span>

                  <button
                    onClick={() => onToggle(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition"
                    style={{
                      background: item.tekrarEdildi ? "#DCFCE7" : "#FEE2E2",
                      color: item.tekrarEdildi ? "#166534" : "#991B1B"
                    }}
                  >
                    {item.tekrarEdildi ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    {item.tekrarEdildi ? "Pekiştirildi" : "Tekrar Et"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 6. POMODORO & ODAK ZAMANLAYICISI                                       */
/* ---------------------------------------------------------------------- */

function Pomodoro({ profile, onCompleteSession }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // focus, shortBreak, longBreak
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].key);

  const initialMinutes = mode === "focus" ? 25 : mode === "shortBreak" ? 5 : 15;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          // Süre bitti!
          clearInterval(interval);
          setIsActive(false);
          if (mode === "focus") {
            onCompleteSession(initialMinutes);
            alert("Tebrikler! Odaklanma süreniz tamamlandı.");
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, initialMinutes, onCompleteSession]);

  const switchMode = (newMode, duration) => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(duration);
    setSeconds(0);
  };

  const totalMinutesStudied = profile.pomodoroStats?.totalMinutes || 0;
  const totalSessions = profile.pomodoroStats?.completedSessions || 0;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <SectionTitle icon={Clock}>Odaklanma & Pomodoro Zamanlayıcısı</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-2 text-center p-8 flex flex-col items-center justify-center">
          {/* MOD SEÇİMİ */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => switchMode("focus", 25)}
              className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
              style={{
                background: mode === "focus" ? "#FFFFFF" : "transparent",
                color: mode === "focus" ? COLORS.primary : COLORS.inkSoft,
                boxShadow: mode === "focus" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
              }}
            >
              Odaklanma (25 Dk)
            </button>
            <button
              onClick={() => switchMode("shortBreak", 5)}
              className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
              style={{
                background: mode === "shortBreak" ? "#FFFFFF" : "transparent",
                color: mode === "shortBreak" ? COLORS.success : COLORS.inkSoft,
                boxShadow: mode === "shortBreak" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
              }}
            >
              Kısa Mola (5 Dk)
            </button>
            <button
              onClick={() => switchMode("longBreak", 15)}
              className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
              style={{
                background: mode === "longBreak" ? "#FFFFFF" : "transparent",
                color: mode === "longBreak" ? COLORS.purple : COLORS.inkSoft,
                boxShadow: mode === "longBreak" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
              }}
            >
              Uzun Mola (15 Dk)
            </button>
          </div>

          {/* DERS SEÇİMİ */}
          {mode === "focus" && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Çalışılan Ders:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl px-3 py-1.5 text-xs font-bold border border-slate-200 bg-white cursor-pointer"
              >
                {SUBJECTS.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
              </select>
            </div>
          )}

          {/* SAYACIN GÖRÜNÜMÜ */}
          <div className="font-mono font-extrabold text-7xl sm:text-8xl text-slate-900 tracking-tight my-4">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>

          {/* KONTROL BUTONLARI */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setIsActive(!isActive)}
              className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? "Duraklat" : "Başlat"}
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setMinutes(initialMinutes);
                setSeconds(0);
              }}
              className="btn-secondary p-3.5 rounded-2xl"
              title="Sıfırla"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </Card>

        {/* POMODORO İSTATİSTİKLERİ */}
        <div className="flex flex-col gap-4">
          <Card>
            <SectionTitle icon={Award}>Odak İstatistikleri</SectionTitle>
            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="text-xs text-blue-700 font-semibold">Toplam Odak Süresi</div>
                <div className="font-mono text-2xl font-bold text-blue-900 mt-0.5">
                  {totalMinutesStudied} <span className="text-xs font-sans font-medium text-blue-700">dakika</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="text-xs text-emerald-700 font-semibold">Tamamlanan Oturum</div>
                <div className="font-mono text-2xl font-bold text-emerald-900 mt-0.5">
                  {totalSessions} <span className="text-xs font-sans font-medium text-emerald-700">Pomodoro</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Pomodoro Tekniği</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              25 dakika boyunca dikkatinizi dağıtacak her şeyi (telefon, bildirimler) kapatın. Süre bitiminde 5 dakika mola verin. Bu yöntem LGS soru çözümlerinde odaklanma eşiğinizi yükseltir.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 7. HEDEFLER, LGS PUAN SİMÜLATÖRÜ & VERİ YÖNETİMİ                       */
/* ---------------------------------------------------------------------- */

function Hedefler({
  profile,
  setProfile,
  denemeler,
  konular,
  program,
  yanlislar,
  soruGecmisi,
  haftalikGecmis = [],
  streak,
  onLoadSimulation,
  onImportAll
}) {
  const [simResults, setSimResults] = useState({
    turkce: { dogru: 18, yanlis: 2 },
    matematik: { dogru: 16, yanlis: 3 },
    fen: { dogru: 18, yanlis: 2 },
    inkilap: { dogru: 9, yanlis: 1 },
    din: { dogru: 10, yanlis: 0 },
    ingilizce: { dogru: 9, yanlis: 1 },
  });

  const fileInputRef = useRef(null);

  const calculatedSimScore = useMemo(() => {
    return calculateLGSScore(simResults, profile.netFormulu || "3");
  }, [simResults, profile.netFormulu]);

  const calculatedSimNet = useMemo(() => {
    const penalty = profile.netFormulu === "4" ? 4 : 3;
    return Object.values(simResults).reduce((acc, curr) => {
      const net = Math.max(0, (Number(curr.dogru) || 0) - (Number(curr.yanlis) || 0) / penalty);
      return acc + net;
    }, 0);
  }, [simResults, profile.netFormulu]);

  // JSON Yedeği İndir
  const exportBackup = () => {
    const data = {
      version: "1.1",
      exportDate: new Date().toISOString(),
      profile,
      denemeler,
      konular,
      program,
      yanlislar,
      soruGecmisi,
      haftalikGecmis
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lgs_karargah_yedek_${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Yedeği Yükle
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.profile || parsed.denemeler) {
          onImportAll(parsed);
          alert("Verileriniz başarıyla içe aktarıldı!");
        } else {
          alert("Geçersiz yedek dosyası!");
        }
      } catch (err) {
        alert("Dosya okunurken bir hata oluştu.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <SectionTitle icon={Target}>Hedefler & LGS Standart Puan Simülatörü</SectionTitle>

      {/* 1 AYLIK ÖRNEK ÖĞRENCİ SİMÜLASYONU */}
      <div
        className="p-5 sm:p-6 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-blue-400/30"
        style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #312E81 50%, #1E1B4B 100%)" }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-amber-300 border border-white/15">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Sistem Testi: 1 Aylık Simülasyon Öğrenci Verisi
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Eren Yıldız (492 Hedef Puan)
              </span>
            </div>
            <p className="text-xs text-blue-200/90 leading-relaxed max-w-2xl">
              1 aylık aktif kullanım senaryosu: 6 kurumsal deneme sınavı, 28 günlük kesintisiz çalışma serisi, 58 Pomodoro seansı, dopdolu haftalık program, yanlış defteri ve 6 popüler soru bankası ilerleme kayıtlarını tek tıkla yükleyin.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onLoadSimulation) onLoadSimulation();
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 flex-shrink-0 cursor-pointer active:scale-95 transition"
        >
          <Sparkles size={16} className="text-slate-950" />
          <span>1 Aylık Verileri Tekrar Yükle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* PROFİL & HEDEF AYARLARI */}
        <Card>
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Profil & Sınav Ayarları</div>
          
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Adınız / Rumuz</label>
              <TinyInput
                value={profile.isim}
                placeholder="Örn: Deniz Yılmaz"
                onChange={(e) => setProfile((p) => ({ ...p, isim: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Hedef Lise</label>
                <TinyInput
                  value={profile.hedefOkul}
                  placeholder="Örn: Galatasaray Lisesi, Kabataş Erkek"
                  onChange={(e) => setProfile((p) => ({ ...p, hedefOkul: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Hedef Puan</label>
                <TinyInput
                  type="number"
                  min="100"
                  max="500"
                  value={profile.hedefPuan}
                  onChange={(e) => setProfile((p) => ({ ...p, hedefPuan: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Veli Telegram Chat ID</label>
                <TinyInput
                  value={profile.veliTelefon || ""}
                  placeholder="Örn: 123456789"
                  onChange={(e) => setProfile((p) => ({ ...p, veliTelefon: e.target.value }))}
                />
                <p className="text-[10px] text-slate-400 mt-1">Günlük raporlar bu ID'ye Telegram üzerinden gönderilir.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Hedef Net (/90)</label>
                <TinyInput
                  type="number"
                  min="1"
                  max="90"
                  value={profile.hedefNet}
                  onChange={(e) => setProfile((p) => ({ ...p, hedefNet: Number(e.target.value) || 0 }))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">LGS Sınav Tarihi</label>
                <TinyInput
                  type="date"
                  value={profile.sinavTarihi}
                  onChange={(e) => setProfile((p) => ({ ...p, sinavTarihi: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Net Hesaplama Kuralı</label>
              <TinySelect
                value={profile.netFormulu || "3"}
                onChange={(e) => setProfile((p) => ({ ...p, netFormulu: e.target.value }))}
              >
                <option value="3">3 Yanlış 1 Doğruyu Götürür (LGS MEB Standardı)</option>
                <option value="4">4 Yanlış 1 Doğruyu Götürür (YKS Standardı)</option>
              </TinySelect>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Günlük Soru Hedefi</label>
                <TinyInput
                  type="number"
                  min="10"
                  max="500"
                  value={profile.gunlukSoruHedefi || 120}
                  onChange={(e) => setProfile((p) => ({ ...p, gunlukSoruHedefi: Number(e.target.value) || 120 }))}
                />
              </div>
              <div className="flex flex-col justify-end">
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  LGS hazırlığında günlük düzenli 100-150 soru MEB başarısını %40 artırır.
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* LGS PUAN SİMÜLATÖRÜ */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hızlı LGS Puan Simülatörü</div>
            <span className="text-[11px] text-blue-600 font-semibold">2026/2027 MEB Katsayıları</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {SUBJECTS.map((s) => (
              <div key={s.key} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-xs font-bold truncate mb-1" style={{ color: s.color }}>
                  {s.name}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[10px] text-emerald-600 font-semibold">Doğru</label>
                    <TinyInput
                      type="number"
                      min="0"
                      max={s.max}
                      value={simResults[s.key]?.dogru ?? 0}
                      onChange={(e) => {
                        const val = Math.min(s.max, Math.max(0, Number(e.target.value) || 0));
                        setSimResults((prev) => ({
                          ...prev,
                          [s.key]: { ...prev[s.key], dogru: val }
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-rose-600 font-semibold">Yanlış</label>
                    <TinyInput
                      type="number"
                      min="0"
                      max={s.max}
                      value={simResults[s.key]?.yanlis ?? 0}
                      onChange={(e) => {
                        const val = Math.min(s.max, Math.max(0, Number(e.target.value) || 0));
                        setSimResults((prev) => ({
                          ...prev,
                          [s.key]: { ...prev[s.key], yanlis: val }
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500">Tahmini Toplam Net</div>
              <div className="font-mono text-2xl font-extrabold text-blue-600">
                {calculatedSimNet.toFixed(2)} <span className="text-xs font-sans font-medium text-slate-500">/ 90</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Tahmini Puan & Yüzdelik</div>
              <div className="font-mono text-3xl font-extrabold text-emerald-600">
                {calculatedSimScore}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600/80 mt-1">
                LGS 2026: ≈ %{calculateLGSPercentile2026(calculatedSimScore)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* VERİ YEDEKLEME VE GERİ YÜKLEME */}
      <Card>
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Veri Yedekleme & Güvenlik</div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Tüm deneme sınavı kayıtlarınızı, konu durumlarınızı ve yanlış defterinizi tek tıklamayla JSON dosyası olarak bilgisayarınıza indirebilir veya geri yükleyebilirsiniz.
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={exportBackup}
              className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Download size={15} /> Yedeği İndir (JSON)
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Upload size={15} /> Yedek Yükle
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
