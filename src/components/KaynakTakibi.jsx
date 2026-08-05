import React, { useState } from "react";
import { BookOpen, Plus, Trash2, CheckCircle2, Bookmark, Layers, Search, Filter } from "lucide-react";

export function KaynakTakibi({
  kaynaklar = [],
  subjects = [],
  onAddKaynak,
  onUpdateKaynak,
  onDeleteKaynak
}) {
  const [filterDers, setFilterDers] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newBook, setNewBook] = useState({
    ders: "matematik",
    ad: "",
    yayin: "",
    toplamTest: 30,
    cozulenTest: 0
  });

  const filteredList = kaynaklar.filter((k) => {
    if (filterDers !== "all" && k.ders !== filterDers) return false;
    return true;
  });

  const toplamKitap = kaynaklar.length;
  const bitenKitap = kaynaklar.filter((k) => k.toplamTest > 0 && k.cozulenTest >= k.toplamTest).length;
  const toplamTest = kaynaklar.reduce((s, k) => s + (Number(k.toplamTest) || 0), 0);
  const cozulenTest = kaynaklar.reduce((s, k) => s + (Number(k.cozulenTest) || 0), 0);
  const genelIlerleme = toplamTest > 0 ? Math.round((cozulenTest / toplamTest) * 100) : 0;

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!newBook.ad.trim()) return;
    onAddKaynak({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ders: newBook.ders,
      ad: newBook.ad.trim(),
      yayin: newBook.yayin.trim() || "Yayın Belirtilmedi",
      toplamTest: Math.max(1, Number(newBook.toplamTest) || 1),
      cozulenTest: Math.max(0, Number(newBook.cozulenTest) || 0)
    });
    setNewBook({ ders: "matematik", ad: "", yayin: "", toplamTest: 30, cozulenTest: 0 });
    setIsAdding(false);
  };

  const handleStep = (id, delta) => {
    const target = kaynaklar.find((k) => k.id === id);
    if (!target) return;
    const newVal = Math.max(0, Math.min(target.toplamTest, (Number(target.cozulenTest) || 0) + delta));
    onUpdateKaynak(id, { ...target, cozulenTest: newVal });
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      
      {/* 4 ÖZET İSTATİSTİK KARTI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Kaynak</div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1">{toplamKitap}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Soru Bankası / Föy</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Bitirilen Kitap</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-600 mt-1">{bitenKitap}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">%{toplamKitap > 0 ? Math.round((bitenKitap / toplamKitap) * 100) : 0} Tamamlandı</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Çözülen Test</div>
          <div className="text-2xl font-mono font-extrabold text-blue-600 mt-1">{cozulenTest} <span className="text-xs font-sans text-slate-400">/ {toplamTest}</span></div>
          <div className="text-[10px] text-blue-700 mt-0.5">Kitaplık Genel İlerlemesi</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Kitaplık Oranı</div>
          <div className="text-2xl font-mono font-extrabold text-purple-600 mt-1">%{genelIlerleme}</div>
          <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${genelIlerleme}%` }} />
          </div>
        </div>
      </div>

      {/* FİLTRE VE YENİ KAYNAK BUTONU */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterDers("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
              filterDers === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tüm Kitaplar ({kaynaklar.length})
          </button>
          {subjects.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilterDers(s.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                filterDers === s.key ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ background: filterDers === s.key ? s.color : undefined }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary text-xs px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
        >
          <Plus size={15} />
          <span>Yeni Kaynak Ekle</span>
        </button>
      </div>

      {/* YENİ KİTAP EKLEME FORMU */}
      {isAdding && (
        <form onSubmit={handleSaveNew} className="bg-white p-5 rounded-2xl border-2 border-blue-300 shadow-md animate-fade-in">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <BookOpen size={16} className="text-blue-600" />
            <span>Yeni Soru Bankası / Kaynak Ekle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ders</label>
              <select
                value={newBook.ders}
                onChange={(e) => setNewBook({ ...newBook, ders: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.key} value={s.key}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Kitap Adı</label>
              <input
                type="text"
                placeholder="Örn: 8. Sınıf Master Matematik Soru Bankası"
                value={newBook.ad}
                onChange={(e) => setNewBook({ ...newBook, ad: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Yayın / Yazar</label>
              <input
                type="text"
                placeholder="Örn: Okyanus, Hız vb."
                value={newBook.yayin}
                onChange={(e) => setNewBook({ ...newBook, yayin: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Toplam Test Sayısı</label>
              <input
                type="number"
                min="1"
                max="500"
                value={newBook.toplamTest}
                onChange={(e) => setNewBook({ ...newBook, toplamTest: Number(e.target.value) })}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="btn-secondary text-xs px-3.5 py-1.5 rounded-xl font-bold cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="btn-primary text-xs px-5 py-1.5 rounded-xl font-bold cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      {/* KİTAP KARTLARI LİSTESİ */}
      {filteredList.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center gap-2">
          <Bookmark size={32} className="text-slate-300" />
          <div className="text-sm font-bold text-slate-700">Kayıtlı Kaynak Bulunamadı</div>
          <div className="text-xs text-slate-400 max-w-sm">
            Çözdüğünüz soru bankalarını ekleyerek test test ilerlemenizi takip edebilir ve kaynaklarınızı düzenli bitirebilirsiniz.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((k) => {
            const subj = subjects.find((s) => s.key === k.ders) || { name: k.ders, color: "#2563EB" };
            const pct = k.toplamTest > 0 ? Math.min(100, Math.round(((k.cozulenTest || 0) / k.toplamTest) * 100)) : 0;
            const isCompleted = pct >= 100;

            return (
              <div
                key={k.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? "bg-emerald-50/40 border-emerald-300 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold text-white"
                      style={{ background: subj.color }}
                    >
                      {subj.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} />
                          Tamamlandı
                        </span>
                      )}
                      <button
                        onClick={() => onDeleteKaynak(k.id)}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition"
                        title="Kaynağı Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {k.ad}
                  </h4>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {k.yayin}
                  </div>

                  {/* İLERLEME ÇUBUĞU */}
                  <div className="my-3.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-700">
                        {k.cozulenTest || 0} / {k.toplamTest} Test
                      </span>
                      <span className="font-mono font-extrabold" style={{ color: isCompleted ? "#059669" : subj.color }}>
                        %{pct}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          background: isCompleted ? "#10B981" : `linear-gradient(90deg, ${subj.color}, #3B82F6)`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* HIZLI TEST ARTIŞ BUTONLARI */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[11px] text-slate-400">Hızlı İlerleme:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStep(k.id, -1)}
                      disabled={(k.cozulenTest || 0) <= 0}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleStep(k.id, 1)}
                      disabled={(k.cozulenTest || 0) >= k.toplamTest}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer transition"
                      style={{ background: isCompleted ? "#10B981" : subj.color }}
                    >
                      <Plus size={12} />
                      <span>+1 Test Çözüldü</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
