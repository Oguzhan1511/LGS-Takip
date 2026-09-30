import React, { useState, useMemo, useEffect } from "react";
import { Printer, X, Calendar, User, Target, BookOpen } from "lucide-react";
import { SUBJECTS } from "../App";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function ProgramYazdirModal({
  isOpen,
  onClose,
  program = {},
  profile = {}
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (isOpen && !startDate) {
      const now = new Date();
      const currentDay = now.getDay();
      const diffToMon = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const monday = new Date(now.getFullYear(), now.getMonth(), diffToMon);
      const sunday = new Date(now.getFullYear(), now.getMonth(), diffToMon + 6);
      
      const formatISO = (d) => {
        const dd = new Date(d);
        dd.setMinutes(dd.getMinutes() - dd.getTimezoneOffset());
        return dd.toISOString().split("T")[0];
      };
      
      setStartDate(formatISO(monday));
      setEndDate(formatISO(sunday));
    }
  }, [isOpen, startDate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
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

  const dateRangeStr = useMemo(() => {
    if (!startDate || !endDate) return "Tarih Belirtilmedi";
    const fmt = (s) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  }, [startDate, endDate]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      className="fixed inset-0 z-[999] overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start print:bg-white print:p-0 print:block"
    >
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 relative flex flex-col print:shadow-none print:border-none print:rounded-none print:m-0 print:block">
        
        {/* YAZDIRILMAYACAK ÜST BAR */}
        <div className="print:hidden sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30 flex-shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <div className="font-display font-bold text-base text-white">
                Ders Programı Çıktısı
              </div>
              <div className="text-xs text-slate-400">
                Öğrenciye verilecek haftalık çalışma planı
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2">Tarih:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 [color-scheme:dark]"
              />
              <span className="text-slate-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md transition"
            >
              <Printer size={15} />
              <span>Yazdır / PDF Al</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition shadow-sm"
              title="Kapat"
            >
              <X size={16} />
              <span className="hidden sm:inline">Kapat</span>
            </button>
          </div>
        </div>

        {/* YAZDIRILACAK ALAN (A4) */}
        <div className="bg-white w-full p-8 text-slate-900 print:p-0 print:w-[210mm] print:mx-auto">
          
          <div className="flex items-end justify-between border-b-2 border-slate-900 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Calendar className="text-blue-600" size={32} />
                LGS Haftalık Çalışma Programı
              </h1>
              <div className="mt-2 text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                <span>DÖNEM:</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                  {dateRangeStr}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-slate-800">
                <User size={16} className="text-slate-400" />
                <span>{profile?.name || "Öğrenci Adı"}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-slate-500 mt-1">
                <Target size={14} className="text-slate-400" />
                <span>Hedef: {profile?.targetHighSchool || "Belirtilmedi"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {DAYS.map((dayName) => {
              const tasks = program[dayName] || [];
              const totalTarget = tasks.reduce((acc, t) => acc + (Number(t.hedefSoru) || 0), 0);
              
              return (
                <div key={dayName} className="border border-slate-200 rounded-2xl overflow-hidden break-inside-avoid shadow-sm print:shadow-none">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between print:bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">{dayName}</h3>
                    {tasks.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md print:border print:border-blue-200">
                        Hedef: {totalTarget} Soru
                      </span>
                    )}
                  </div>
                  <div className="p-0">
                    {tasks.length === 0 ? (
                      <div className="p-4 text-xs text-slate-400 italic text-center">
                        Bu gün için planlanmış görev bulunmuyor.
                      </div>
                    ) : (
                      <table className="w-full text-xs text-left border-collapse">
                        <tbody className="divide-y divide-slate-100">
                          {tasks.map((t, idx) => {
                            const subj = SUBJECTS.find((s) => s.key === t.ders);
                            const subjName = subj?.name || t.ders;
                            const subjColor = subj?.color || "#64748b";
                            return (
                              <tr key={idx} className="hover:bg-slate-50 print:hover:bg-transparent">
                                <td className="py-2.5 px-4 w-8 text-center">
                                  <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                                </td>
                                <td className="py-2.5 px-2">
                                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full print:border print:border-slate-300" style={{ background: subjColor }}></span>
                                    {subjName}
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                                    {t.konu || "Genel Tekrar"}
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-600">
                                  {t.hedefSoru} Soru
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col justify-center items-center text-center bg-slate-50 break-inside-avoid">
              <BookOpen size={24} className="text-slate-400 mb-2" />
              <h4 className="font-bold text-slate-700 text-sm mb-1">Haftalık Notlar / Hedefler</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[80%] mx-auto mt-2 text-left w-full h-16 border-t border-slate-200">
                
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 pb-8">
            Bu program LGS Takip Sistemi tarafından oluşturulmuştur. Başarılar dileriz!
          </div>
        </div>
      </div>
    </div>
  );
}
