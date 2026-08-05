// 1 Aylık Zengin Öğrenci Simülasyon Veri Seti (Gerçekçi LGS İlerlemesi)

export function generate1MonthMockData() {
  const now = new Date();
  
  // Tarih Üretici (Gün farkına göre YYYY-MM-DD)
  const getPastDateISO = (daysAgo) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Son 28 günün streak tarihleri
  const streakDates = [];
  for (let i = 27; i >= 0; i--) {
    streakDates.push(getPastDateISO(i));
  }

  // 1. ÖĞRENCİ PROFİLİ
  const profile = {
    isim: "Eren Yıldız",
    hedefOkul: "Galatasaray Lisesi",
    hedefPuan: 492,
    hedefNet: 86.5,
    gunlukSoruHedefi: 130,
    sinavTarihi: "2027-06-06",
    netFormulu: "3",
    streakDates,
    pomodoroStats: {
      totalMinutes: 1450, // ~24 saat odaklanma
      completedSessions: 58
    }
  };

  // 2. DENEME SINAVLARI (1 Aylık Periyotta 6 Kurumsal Deneme ve İlerleme)
  const denemeler = [
    {
      id: "deneme-6",
      tarih: getPastDateISO(2),
      isim: "Sinan Kuzucu VIP Kurumsal Deneme-4",
      sureDakika: 155,
      results: {
        turkce: {
          dogru: 20, yanlis: 0, bos: 0,
          konular: {
            "Paragrafta Anlam": { dogru: 8, yanlis: 0 },
            "Fiilimsiler": { dogru: 4, yanlis: 0 },
            "Cümlenin Ögeleri": { dogru: 4, yanlis: 0 },
            "Sözcükte Anlam": { dogru: 4, yanlis: 0 }
          }
        },
        matematik: {
          dogru: 17, yanlis: 2, bos: 1,
          konular: {
            "Çarpanlar ve Katlar": { dogru: 4, yanlis: 0 },
            "Üslü İfadeler": { dogru: 4, yanlis: 1 },
            "Kareköklü İfadeler": { dogru: 3, yanlis: 1 },
            "Veri Analizi": { dogru: 3, yanlis: 0 },
            "Basit Olayların Olma Olasılığı": { dogru: 3, yanlis: 0 }
          }
        },
        fen: {
          dogru: 19, yanlis: 1, bos: 0,
          konular: {
            "Mevsimler ve İklim": { dogru: 4, yanlis: 0 },
            "DNA ve Genetik Kod": { dogru: 6, yanlis: 1 },
            "Basınç": { dogru: 5, yanlis: 0 },
            "Madde ve Endüstri": { dogru: 4, yanlis: 0 }
          }
        },
        inkilap: {
          dogru: 10, yanlis: 0, bos: 0,
          konular: {
            "Bir Kahraman Doğuyor": { dogru: 4, yanlis: 0 },
            "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar": { dogru: 6, yanlis: 0 }
          }
        },
        din: {
          dogru: 10, yanlis: 0, bos: 0,
          konular: {
            "Kader İnancı": { dogru: 5, yanlis: 0 },
            "Zekât ve Sadaka": { dogru: 5, yanlis: 0 }
          }
        },
        ingilizce: {
          dogru: 10, yanlis: 0, bos: 0,
          konular: {
            "Friendship": { dogru: 5, yanlis: 0 },
            "Teen Life": { dogru: 5, yanlis: 0 }
          }
        }
      }
    },
    {
      id: "deneme-5",
      tarih: getPastDateISO(8),
      isim: "Hız Yayınları Kurumsal LGS Deneme-3",
      sureDakika: 155,
      results: {
        turkce: {
          dogru: 19, yanlis: 1, bos: 0,
          konular: {
            "Paragrafta Anlam": { dogru: 8, yanlis: 1 },
            "Fiilimsiler": { dogru: 4, yanlis: 0 },
            "Cümlenin Ögeleri": { dogru: 4, yanlis: 0 },
            "Yazım Kuralları": { dogru: 3, yanlis: 0 }
          }
        },
        matematik: {
          dogru: 16, yanlis: 3, bos: 1,
          konular: {
            "Çarpanlar ve Katlar": { dogru: 4, yanlis: 0 },
            "Üslü İfadeler": { dogru: 3, yanlis: 1 },
            "Kareköklü İfadeler": { dogru: 3, yanlis: 1 },
            "Veri Analizi": { dogru: 3, yanlis: 1 },
            "Basit Olayların Olma Olasılığı": { dogru: 3, yanlis: 0 }
          }
        },
        fen: {
          dogru: 18, yanlis: 2, bos: 0,
          konular: {
            "Mevsimler ve İklim": { dogru: 4, yanlis: 0 },
            "DNA ve Genetik Kod": { dogru: 5, yanlis: 1 },
            "Basınç": { dogru: 5, yanlis: 1 },
            "Madde ve Endüstri": { dogru: 4, yanlis: 0 }
          }
        },
        inkilap: {
          dogru: 10, yanlis: 0, bos: 0,
          konular: {
            "Bir Kahraman Doğuyor": { dogru: 4, yanlis: 0 },
            "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar": { dogru: 6, yanlis: 0 }
          }
        },
        din: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Kader İnancı": { dogru: 5, yanlis: 0 },
            "Zekât ve Sadaka": { dogru: 4, yanlis: 1 }
          }
        },
        ingilizce: {
          dogru: 10, yanlis: 0, bos: 0,
          konular: {
            "Friendship": { dogru: 5, yanlis: 0 },
            "Teen Life": { dogru: 5, yanlis: 0 }
          }
        }
      }
    },
    {
      id: "deneme-4",
      tarih: getPastDateISO(15),
      isim: "Nitelik Süper LGS Genel Deneme-2",
      sureDakika: 155,
      results: {
        turkce: {
          dogru: 18, yanlis: 2, bos: 0,
          konular: {
            "Paragrafta Anlam": { dogru: 7, yanlis: 1 },
            "Fiilimsiler": { dogru: 4, yanlis: 0 },
            "Cümlenin Ögeleri": { dogru: 3, yanlis: 1 },
            "Sözcükte Anlam": { dogru: 4, yanlis: 0 }
          }
        },
        matematik: {
          dogru: 15, yanlis: 4, bos: 1,
          konular: {
            "Çarpanlar ve Katlar": { dogru: 3, yanlis: 1 },
            "Üslü İfadeler": { dogru: 3, yanlis: 1 },
            "Kareköklü İfadeler": { dogru: 3, yanlis: 1 },
            "Veri Analizi": { dogru: 3, yanlis: 0 },
            "Basit Olayların Olma Olasılığı": { dogru: 3, yanlis: 1 }
          }
        },
        fen: {
          dogru: 18, yanlis: 2, bos: 0,
          konular: {
            "Mevsimler ve İklim": { dogru: 4, yanlis: 0 },
            "DNA ve Genetik Kod": { dogru: 5, yanlis: 1 },
            "Basınç": { dogru: 4, yanlis: 1 },
            "Madde ve Endüstri": { dogru: 5, yanlis: 0 }
          }
        },
        inkilap: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Bir Kahraman Doğuyor": { dogru: 4, yanlis: 0 },
            "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar": { dogru: 5, yanlis: 1 }
          }
        },
        din: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Kader İnancı": { dogru: 4, yanlis: 1 },
            "Zekât ve Sadaka": { dogru: 5, yanlis: 0 }
          }
        },
        ingilizce: {
          dogru: 10, yanlis: 0, bos: 0,
          konular: {
            "Friendship": { dogru: 5, yanlis: 0 },
            "Teen Life": { dogru: 5, yanlis: 0 }
          }
        }
      }
    },
    {
      id: "deneme-3",
      tarih: getPastDateISO(21),
      isim: "Mozaik Yayınları Türkiye Geneli-1",
      sureDakika: 155,
      results: {
        turkce: {
          dogru: 18, yanlis: 2, bos: 0,
          konular: {
            "Paragrafta Anlam": { dogru: 7, yanlis: 1 },
            "Fiilimsiler": { dogru: 3, yanlis: 1 },
            "Cümlenin Ögeleri": { dogru: 4, yanlis: 0 },
            "Sözcükte Anlam": { dogru: 4, yanlis: 0 }
          }
        },
        matematik: {
          dogru: 14, yanlis: 4, bos: 2,
          konular: {
            "Çarpanlar ve Katlar": { dogru: 3, yanlis: 1 },
            "Üslü İfadeler": { dogru: 3, yanlis: 1 },
            "Kareköklü İfadeler": { dogru: 3, yanlis: 1 },
            "Veri Analizi": { dogru: 2, yanlis: 1 },
            "Basit Olayların Olma Olasılığı": { dogru: 3, yanlis: 0 }
          }
        },
        fen: {
          dogru: 17, yanlis: 3, bos: 0,
          konular: {
            "Mevsimler ve İklim": { dogru: 4, yanlis: 0 },
            "DNA ve Genetik Kod": { dogru: 5, yanlis: 1 },
            "Basınç": { dogru: 4, yanlis: 1 },
            "Madde ve Endüstri": { dogru: 4, yanlis: 1 }
          }
        },
        inkilap: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Bir Kahraman Doğuyor": { dogru: 4, yanlis: 0 },
            "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar": { dogru: 5, yanlis: 1 }
          }
        },
        din: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Kader İnancı": { dogru: 4, yanlis: 1 },
            "Zekât ve Sadaka": { dogru: 5, yanlis: 0 }
          }
        },
        ingilizce: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Friendship": { dogru: 4, yanlis: 1 },
            "Teen Life": { dogru: 5, yanlis: 0 }
          }
        }
      }
    },
    {
      id: "deneme-2",
      tarih: getPastDateISO(28),
      isim: "TÖDER LGS 1. Genel Deneme",
      sureDakika: 155,
      results: {
        turkce: {
          dogru: 17, yanlis: 3, bos: 0,
          konular: {
            "Paragrafta Anlam": { dogru: 6, yanlis: 2 },
            "Fiilimsiler": { dogru: 3, yanlis: 1 },
            "Cümlenin Ögeleri": { dogru: 4, yanlis: 0 },
            "Sözcükte Anlam": { dogru: 4, yanlis: 0 }
          }
        },
        matematik: {
          dogru: 13, yanlis: 5, bos: 2,
          konular: {
            "Çarpanlar ve Katlar": { dogru: 3, yanlis: 1 },
            "Üslü İfadeler": { dogru: 3, yanlis: 1 },
            "Kareköklü İfadeler": { dogru: 2, yanlis: 2 },
            "Veri Analizi": { dogru: 2, yanlis: 1 },
            "Basit Olayların Olma Olasılığı": { dogru: 3, yanlis: 0 }
          }
        },
        fen: {
          dogru: 16, yanlis: 3, bos: 1,
          konular: {
            "Mevsimler ve İklim": { dogru: 3, yanlis: 1 },
            "DNA ve Genetik Kod": { dogru: 4, yanlis: 1 },
            "Basınç": { dogru: 4, yanlis: 1 },
            "Madde ve Endüstri": { dogru: 5, yanlis: 0 }
          }
        },
        inkilap: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Bir Kahraman Doğuyor": { dogru: 4, yanlis: 0 },
            "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar": { dogru: 5, yanlis: 1 }
          }
        },
        din: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Kader İnancı": { dogru: 4, yanlis: 1 },
            "Zekât ve Sadaka": { dogru: 5, yanlis: 0 }
          }
        },
        ingilizce: {
          dogru: 9, yanlis: 1, bos: 0,
          konular: {
            "Friendship": { dogru: 4, yanlis: 1 },
            "Teen Life": { dogru: 5, yanlis: 0 }
          }
        }
      }
    }
  ];

  // 3. HAFTALIK PROGRAM (Dopdolu 7 Günlük Görevler ve Sonuçlar)
  const program = {
    Pazartesi: [
      {
        id: "pzt-1",
        ders: "turkce",
        konu: "Fiilimsiler (İsim-Fiil, Sıfat-Fiil, Zarf-Fiil)",
        hedefSoru: 40,
        tamamlandi: true,
        sonuc: { cozulen: 40, dogru: 38, yanlis: 2, bos: 0 },
        not: "Hız Yayınları Test 4-5 çözüldü"
      },
      {
        id: "pzt-2",
        ders: "matematik",
        konu: "Çarpanlar ve Katlar (EBOB-EKOK)",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 32, yanlis: 3, bos: 0 },
        not: "Master Matematik Yeni Nesil Sorular"
      },
      {
        id: "pzt-3",
        ders: "fen",
        konu: "Mevsimlerin Oluşumu & İklim",
        hedefSoru: 30,
        tamamlandi: true,
        sonuc: { cozulen: 30, dogru: 29, yanlis: 1, bos: 0 },
        not: "Nitelik Fen Test 1-2"
      },
      {
        id: "pzt-4",
        ders: "inkilap",
        konu: "Bir Kahraman Doğuyor",
        hedefSoru: 25,
        tamamlandi: true,
        sonuc: { cozulen: 25, dogru: 25, yanlis: 0, bos: 0 },
        not: "MEB Kazanım Testleri Full"
      }
    ],
    Salı: [
      {
        id: "sal-1",
        ders: "matematik",
        konu: "Üslü İfadeler (Ondalık Gösterim & Bilimsel Gösterim)",
        hedefSoru: 40,
        tamamlandi: true,
        sonuc: { cozulen: 40, dogru: 36, yanlis: 3, bos: 1 },
        not: "Sayı doğrusu ve üs alma kuralları pekişti"
      },
      {
        id: "sal-2",
        ders: "turkce",
        konu: "Paragrafta Anlam & Hızlı Okuma",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 33, yanlis: 2, bos: 0 },
        not: "Süre tutarak 25 dakikada tamamlandı"
      },
      {
        id: "sal-3",
        ders: "din",
        konu: "Kader ve Evrenin Yasaları",
        hedefSoru: 25,
        tamamlandi: true,
        sonuc: { cozulen: 25, dogru: 25, yanlis: 0, bos: 0 },
        not: "Karakök Soru Bankası"
      },
      {
        id: "sal-4",
        ders: "ingilizce",
        konu: "Friendship (Accepting & Refusing)",
        hedefSoru: 25,
        tamamlandi: true,
        sonuc: { cozulen: 25, dogru: 24, yanlis: 1, bos: 0 },
        not: "Kelime kartları tekrar edildi"
      }
    ],
    Çarşamba: [
      {
        id: "car-1",
        ders: "fen",
        konu: "DNA ve Genetik Kod (Mutasyon, Modifikasyon)",
        hedefSoru: 40,
        tamamlandi: true,
        sonuc: { cozulen: 40, dogru: 37, yanlis: 3, bos: 0 },
        not: "Çaprazlama soruları çözüldü"
      },
      {
        id: "car-2",
        ders: "matematik",
        konu: "Kareköklü İfadeler (Karekök Dışına Çıkarma)",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 30, yanlis: 4, bos: 1 },
        not: "Tahmin ve yaklaşık değer soruları tekrar edilecek"
      },
      {
        id: "car-3",
        ders: "turkce",
        konu: "Cümlenin Ögeleri (Özne, Yüklem, Nesne)",
        hedefSoru: 30,
        tamamlandi: true,
        sonuc: { cozulen: 30, dogru: 28, yanlis: 2, bos: 0 },
        not: "Ara sözler ve vurgu konusu dikkat"
      },
      {
        id: "car-4",
        ders: "inkilap",
        konu: "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar",
        hedefSoru: 25,
        tamamlandi: true,
        sonuc: { cozulen: 25, dogru: 24, yanlis: 1, bos: 0 },
        not: "Kongreler ve genelgeler haritası çıkarıldı"
      }
    ],
    Perşembe: [
      {
        id: "per-1",
        ders: "matematik",
        konu: "Veri Analizi (Daire ve Sütun Grafiği Dönüşümleri)",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 33, yanlis: 2, bos: 0 },
        not: "Açı ve oran-orantı dönüşümleri başarılı"
      },
      {
        id: "per-2",
        ders: "fen",
        konu: "Basınç (Katı, Sıvı ve Gaz Basıncı)",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 32, yanlis: 3, bos: 0 },
        not: "Sıvı basıncı derinlik ve yoğunluk grafikleri"
      },
      {
        id: "per-3",
        ders: "turkce",
        konu: "Sözel Mantık ve Muhakeme",
        hedefSoru: 30,
        tamamlandi: true,
        sonuc: { cozulen: 30, dogru: 28, yanlis: 2, bos: 0 },
        not: "Tablo kurma yöntemi uygulandı"
      },
      {
        id: "per-4",
        ders: "ingilizce",
        konu: "Teen Life (Expressing Preferences)",
        hedefSoru: 25,
        tamamlandi: true,
        sonuc: { cozulen: 25, dogru: 25, yanlis: 0, bos: 0 },
        not: "Full doğru"
      }
    ],
    Cuma: [
      {
        id: "cum-1",
        ders: "matematik",
        konu: "Basit Olayların Olma Olasılığı",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 33, yanlis: 2, bos: 0 },
        not: "Tüm olası durumlar formülü"
      },
      {
        id: "cum-2",
        ders: "fen",
        konu: "Madde ve Endüstri (Periyodik Tablo & Fiziksel/Kimyasal Değişimler)",
        hedefSoru: 35,
        tamamlandi: true,
        sonuc: { cozulen: 35, dogru: 33, yanlis: 2, bos: 0 },
        not: "Grup ve periyot özellikleri çalışıldı"
      },
      {
        id: "cum-3",
        ders: "din",
        konu: "Zekât ve Sadaka İbadeti",
        hedefSoru: 25,
        tamamlandi: true,
        sonuc: { cozulen: 25, dogru: 24, yanlis: 1, bos: 0 },
        not: "Nisap miktarları tekrar edildi"
      },
      {
        id: "cum-4",
        ders: "turkce",
        konu: "Noktalama İşaretleri & Yazım Kuralları",
        hedefSoru: 30,
        tamamlandi: true,
        sonuc: { cozulen: 30, dogru: 29, yanlis: 1, bos: 0 },
        not: "Kesme işareti ve büyük harf kuralları"
      }
    ],
    Cumartesi: [
      {
        id: "cmt-1",
        ders: "matematik",
        konu: "Haftalık Karma Soru Çözümü & Zor Sorular",
        hedefSoru: 50,
        tamamlandi: true,
        sonuc: { cozulen: 50, dogru: 44, yanlis: 5, bos: 1 },
        not: "Zorluk derecesi yüksek sorular"
      },
      {
        id: "cmt-2",
        ders: "fen",
        konu: "Fen Branş Denemesi (20 Soru)",
        hedefSoru: 20,
        tamamlandi: true,
        sonuc: { cozulen: 20, dogru: 19, yanlis: 1, bos: 0 },
        not: "Süre: 30 dk"
      },
      {
        id: "cmt-3",
        ders: "turkce",
        konu: "Türkçe Branş Denemesi (20 Soru)",
        hedefSoru: 20,
        tamamlandi: true,
        sonuc: { cozulen: 20, dogru: 20, yanlis: 0, bos: 0 },
        not: "Full net!"
      }
    ],
    Pazar: [
      {
        id: "paz-1",
        ders: "turkce",
        konu: "Haftalık Yanlış Defteri Tekrarı",
        hedefSoru: 30,
        tamamlandi: true,
        sonuc: { cozulen: 30, dogru: 29, yanlis: 1, bos: 0 },
        not: "Hatalar aralıklı tekrar sistemine göre gözden geçirildi"
      },
      {
        id: "paz-2",
        ders: "matematik",
        konu: "Haftalık Yanlış Defteri Matematik Tekrarı",
        hedefSoru: 30,
        tamamlandi: true,
        sonuc: { cozulen: 30, dogru: 27, yanlis: 3, bos: 0 },
        not: "Kareköklü ifadeler ve üslü sayılar hatasız çözüldü"
      }
    ]
  };

  // 4. HAFTALIK GEÇMİŞ (Son 4 Hafta Soru ve Başarı Grafiği)
  const haftalikGecmis = [
    {
      id: "w-1",
      etiket: "4 Hafta Önce",
      tarihAraligi: "7 - 13 Temmuz",
      toplamSoru: 560,
      hedefSoru: 500,
      dogru: 490,
      yanlis: 58,
      bos: 12,
      dersler: { turkce: 120, matematik: 110, fen: 130, inkilap: 65, din: 65, ingilizce: 70 }
    },
    {
      id: "w-2",
      etiket: "3 Hafta Önce",
      tarihAraligi: "14 - 20 Temmuz",
      toplamSoru: 670,
      hedefSoru: 600,
      dogru: 595,
      yanlis: 60,
      bos: 15,
      dersler: { turkce: 145, matematik: 150, fen: 160, inkilap: 70, din: 70, ingilizce: 75 }
    },
    {
      id: "w-3",
      etiket: "2 Hafta Önce",
      tarihAraligi: "21 - 27 Temmuz",
      toplamSoru: 780,
      hedefSoru: 700,
      dogru: 705,
      yanlis: 60,
      bos: 15,
      dersler: { turkce: 170, matematik: 180, fen: 190, inkilap: 80, din: 80, ingilizce: 80 }
    },
    {
      id: "w-4",
      etiket: "Geçen Hafta",
      tarihAraligi: "28 Temmuz - 3 Ağustos",
      toplamSoru: 860,
      hedefSoru: 800,
      dogru: 795,
      yanlis: 50,
      bos: 15,
      dersler: { turkce: 190, matematik: 200, fen: 210, inkilap: 85, din: 85, ingilizce: 90 }
    }
  ];

  // 5. KAYNAK TAKİBİ (LGS Popüler Soru Bankaları ve İlerleme)
  const kaynaklar = [
    { id: "k1", ders: "matematik", ad: "Master Matematik Yeni Nesil Soru Bankası", yayin: "Okyanus Yayıncılık", toplamTest: 48, cozulenTest: 36 },
    { id: "k2", ders: "turkce", ad: "Paragraf ve Sözel Mantık Soru Dünyası", yayin: "Hız Yayınları", toplamTest: 38, cozulenTest: 30 },
    { id: "k3", ders: "fen", ad: "Fen Bilimleri Yeni Nesil Soru Bankası", yayin: "Nitelik Yayınları", toplamTest: 42, cozulenTest: 32 },
    { id: "k4", ders: "inkilap", ad: "T.C. İnkılap Tarihi Master Branş Denemeleri", yayin: "Mozaik Yayınları", toplamTest: 24, cozulenTest: 18 },
    { id: "k5", ders: "din", ad: "Din Kültürü ve Ahlak Bilgisi Soru Bankası", yayin: "Karakök Yayınları", toplamTest: 20, cozulenTest: 16 },
    { id: "k6", ders: "ingilizce", ad: "LGS Master Question Bank", yayin: "More & More", toplamTest: 22, cozulenTest: 17 }
  ];

  // 6. YANLIŞ DEFTERİ (Aralıklı Tekrar Uyumlu 7 Kritik Soru)
  const yanlislar = [
    {
      id: "yd-1",
      ders: "matematik",
      konu: "Kareköklü İfadeler",
      tarih: getPastDateISO(2),
      soruMetni: "Alanı 180 cm² olan kare şeklindeki bir kartonun kenar uzunluğunun en yakın olduğu tam sayı kaçtır?",
      dogruCevap: "13 (Çünkü √169 < √180 < √196, 180 - 169 = 11 ve 196 - 180 = 16, dolayısıyla 13'e daha yakındır)",
      ogrenciCevabi: "14",
      hataNedeni: "İşlem Hatası",
      cozumNotu: "Yakınlık hesabında kare farklarına dikkat etmeliyim. 169'a 11 birim, 196'ya 16 birim uzaklıkta.",
      tekrarEdildi: false
    },
    {
      id: "yd-2",
      ders: "fen",
      konu: "Basınç",
      tarih: getPastDateISO(4),
      soruMetni: "U borusunda farklı yoğunluktaki iki sıvının tabana uyguladığı sıvı basınçları karşılaştırması.",
      dogruCevap: "P = h * d * g formülüne göre taban derinliği aynı kaldığında yoğunluğu büyük olanın basıncı fazladır.",
      ogrenciCevabi: "Basınçlar eşittir",
      hataNedeni: "Kavram Yanılgısı",
      cozumNotu: "Sıvı basıncında kabın şekli değil, sadece derinlik ve yoğunluk belirleyicidir.",
      tekrarEdildi: false
    },
    {
      id: "yd-3",
      ders: "matematik",
      konu: "Çarpanlar ve Katlar",
      tarih: getPastDateISO(7),
      soruMetni: "Boyutları 24 m ve 36 m olan bahçenin etrafına eşit aralıklarla dikilecek en az ağaç sayısı.",
      dogruCevap: "EBOB(24, 36) = 12 m. Çevre = 2 * (24 + 36) = 120 m. Ağaç sayısı = 120 / 12 = 10 ağaç.",
      ogrenciCevabi: "12 ağaç",
      hataNedeni: "Dikkatsizlik",
      cozumNotu: "Köşelere de ağaç dikileceğinden çevre / EBOB formülü doğrudan sonucu verir.",
      tekrarEdildi: true
    },
    {
      id: "yd-4",
      ders: "turkce",
      konu: "Fiilimsiler",
      tarih: getPastDateISO(10),
      soruMetni: "'Gelecek hafta yapılacak toplantının kararları açıklandı.' cümlesindeki fiilimsi türü.",
      dogruCevap: "'Gelecek' ve 'yapılacak' sözcükleri sıfat-fiildir (-ecek/-acak).",
      ogrenciCevabi: "Gelecek sözcüğünü çekimli fiil sandım.",
      hataNedeni: "Soru Kökünü Yanlış Okuma",
      cozumNotu: "İsmi niteleyen -ecek/-acak ekleri sıfat-fiil görevindedir.",
      tekrarEdildi: true
    },
    {
      id: "yd-5",
      ders: "fen",
      konu: "DNA ve Genetik Kod",
      tarih: getPastDateISO(14),
      soruMetni: "Heterozigot sarı tohumlu iki bezelyenin çaprazlanması sonucu yeşil tohumlu bezelye oluşma olasılığı.",
      dogruCevap: "Ss x Ss -> SS, Ss, Ss, ss. Yeşil tohum (ss) olasılığı %25'tir.",
      ogrenciCevabi: "%50",
      hataNedeni: "İşlem Hatası",
      cozumNotu: "Çaprazlama tablosunu çizerken homozigot/heterozigot ayrımını dikkatli yaz.",
      tekrarEdildi: true
    },
    {
      id: "yd-6",
      ders: "turkce",
      konu: "Sözel Mantık ve Muhakeme",
      tarih: getPastDateISO(18),
      soruMetni: "5 katlı bir binada oturan kişilerin kat sıralaması ve meslekleri eşleştirme sorusu.",
      dogruCevap: "3. katta oturan kişi Avukattır.",
      ogrenciCevabi: "Doktor",
      hataNedeni: "Dikkatsizlik",
      cozumNotu: "Verilen kesin öncülleri önce tabloya yazıp olasılıkları yan sütunda denemeliyim.",
      tekrarEdildi: true
    },
    {
      id: "yd-7",
      ders: "matematik",
      konu: "Üslü İfadeler",
      tarih: getPastDateISO(25),
      soruMetni: "(-3)⁴ ile -3⁴ ifadelerinin değerleri toplamı.",
      dogruCevap: "(-3)⁴ = +81, -3⁴ = -81. Toplam = 0.",
      ogrenciCevabi: "162",
      hataNedeni: "Kavram Yanılgısı",
      cozumNotu: "Parantez dışındaki çift kuvvet tabanın işaretini artı yapar; parantezsiz kuvvette eksi önde kalır.",
      tekrarEdildi: true
    }
  ];

  // 7. GÜNLÜK REFLEKSİYONLAR (Son 1 Ayın Koçluk & Öğrenci Değerlendirmeleri)
  const refleksiyonlar = [
    {
      tarih: getPastDateISO(1),
      mod: "super",
      not: "Sinan Kuzucu deneme sınavında 86.33 nete ulaştım! Hedef okul Galatasaray Lisesi puan barajını geçtim, çok motiveyim."
    },
    {
      tarih: getPastDateISO(3),
      mod: "harika",
      not: "Matematik yeni nesil problem çözümlerinde süreyi çok iyi yönettik. 4 Pomodoro seansı tam odak tamamlandı."
    },
    {
      tarih: getPastDateISO(6),
      mod: "normal",
      not: "Kareköklü ifadelerde yaklaşık değer sorularında 2 yanlış çıktı, hemen yanlış defterine not edip çözümü inceledim."
    },
    {
      tarih: getPastDateISO(9),
      mod: "super",
      not: "Hız Yayınları denemesinde Türkçe full geldi. Paragraf taktikleri ve zaman yönetimi işe yarıyor."
    },
    {
      tarih: getPastDateISO(13),
      mod: "harika",
      not: "Fen bilimleri DNA çaprazlamaları konusunu pekiştirdim, eksik konu kalmadı."
    },
    {
      tarih: getPastDateISO(17),
      mod: "normal",
      not: "Bugün 140 soru çözdüm, biraz yorucu geçti ama günlük hedefi aştım."
    },
    {
      tarih: getPastDateISO(22),
      mod: "super",
      not: "Mozaik Türkiye Geneli deneme netlerim geçen haftaya göre +3 net arttı. İlerleme net şekilde görünüyor."
    },
    {
      tarih: getPastDateISO(27),
      mod: "harika",
      not: "1 Aylık LGS kampına başladık. Günlük 120 soru hedefini istikrarlı şekilde tutturuyorum."
    }
  ];

  // 8. KONU DURUMLARI (Tüm Derslerde Dengeli Pekişti / Tekrar / Bekliyor Dağılımı)
  const konular = {
    matematik: {
      "Çarpanlar ve Katlar": "pekisti",
      "Üslü İfadeler": "pekisti",
      "Kareköklü İfadeler": "tekrar",
      "Veri Analizi": "pekisti",
      "Basit Olayların Olma Olasılığı": "tekrar",
      "Cebirsel İfadeler ve Özdeşlikler": "bekliyor",
      "Doğrusal Denklemler": "bekliyor",
      "Eşitsizlikler": "bekliyor",
      "Üçgenler": "bekliyor",
      "Eşlik ve Benzerlik": "bekliyor",
      "Dönüşüm Geometrisi": "bekliyor",
      "Geometrik Cisimler": "bekliyor"
    },
    turkce: {
      "Fiilimsiler": "pekisti",
      "Sözcükte Anlam": "pekisti",
      "Cümlede Anlam": "pekisti",
      "Paragrafta Anlam": "pekisti",
      "Cümlenin Ögeleri": "pekisti",
      "Cümle Türleri": "tekrar",
      "Yazım Kuralları": "pekisti",
      "Noktalama İşaretleri": "pekisti",
      "Metin Türleri": "bekliyor",
      "Söz Sanatları": "bekliyor",
      "Sözel Mantık ve Muhakeme": "tekrar"
    },
    fen: {
      "Mevsimler ve İklim": "pekisti",
      "DNA ve Genetik Kod": "pekisti",
      "Basınç": "tekrar",
      "Madde ve Endüstri": "tekrar",
      "Basit Makineler": "bekliyor",
      "Enerji Dönüşümleri ve Çevre Bilimi": "bekliyor",
      "Elektrik Yükleri ve Elektrik Enerjisi": "bekliyor"
    },
    inkilap: {
      "Bir Kahraman Doğuyor": "pekisti",
      "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar": "pekisti",
      "Millî Bir Destan: Ya İstiklal Ya Ölüm!": "tekrar",
      "Atatürkçülük ve Çağdaşlaşan Türkiye": "bekliyor",
      "Demokratikleşme Çabaları": "bekliyor",
      "Atatürk Dönemi Türk Dış Politikası": "bekliyor",
      "Atatürk'ün Ölümü ve Sonrası": "bekliyor"
    },
    din: {
      "Kader İnancı": "pekisti",
      "Zekât ve Sadaka": "pekisti",
      "Din ve Hayat": "tekrar",
      "Hz. Muhammed'in Örnekliği": "bekliyor",
      "Kur'an-ı Kerim ve Özellikleri": "bekliyor"
    },
    ingilizce: {
      "Friendship": "pekisti",
      "Teen Life": "pekisti",
      "In The Kitchen": "tekrar",
      "On The Phone": "bekliyor",
      "The Internet": "bekliyor",
      "Adventures": "bekliyor",
      "Tourism": "bekliyor",
      "Chores": "bekliyor",
      "Science": "bekliyor",
      "Natural Forces": "bekliyor"
    }
  };

  // 9. DETAYLI SORU GEÇMİŞİ (Son 30 Günde Çözülen 30+ Test Oturumu)
  const soruGecmisi = [
    { id: "sg-1", tarih: getPastDateISO(1), ders: "turkce", konu: "Fiilimsiler", cozulen: 40, dogru: 38, yanlis: 2, kaynak: "Hız Yayınları" },
    { id: "sg-2", tarih: getPastDateISO(1), ders: "matematik", konu: "Çarpanlar ve Katlar", cozulen: 35, dogru: 32, yanlis: 3, kaynak: "Master Matematik" },
    { id: "sg-3", tarih: getPastDateISO(2), ders: "fen", konu: "Mevsimler ve İklim", cozulen: 30, dogru: 29, yanlis: 1, kaynak: "Nitelik Fen" },
    { id: "sg-4", tarih: getPastDateISO(3), ders: "matematik", konu: "Üslü İfadeler", cozulen: 40, dogru: 36, yanlis: 4, kaynak: "Master Matematik" },
    { id: "sg-5", tarih: getPastDateISO(4), ders: "turkce", konu: "Paragrafta Anlam", cozulen: 35, dogru: 33, yanlis: 2, kaynak: "Hız Yayınları" },
    { id: "sg-6", tarih: getPastDateISO(5), ders: "fen", konu: "DNA ve Genetik Kod", cozulen: 40, dogru: 37, yanlis: 3, kaynak: "Nitelik Fen" },
    { id: "sg-7", tarih: getPastDateISO(6), ders: "matematik", konu: "Kareköklü İfadeler", cozulen: 35, dogru: 30, yanlis: 5, kaynak: "Master Matematik" },
    { id: "sg-8", tarih: getPastDateISO(7), ders: "inkilap", konu: "Bir Kahraman Doğuyor", cozulen: 30, dogru: 29, yanlis: 1, kaynak: "Mozaik Yayınları" },
    { id: "sg-9", tarih: getPastDateISO(8), ders: "din", konu: "Kader İnancı", cozulen: 25, dogru: 25, yanlis: 0, kaynak: "Karakök" },
    { id: "sg-10", tarih: getPastDateISO(9), ders: "ingilizce", konu: "Friendship", cozulen: 25, dogru: 24, yanlis: 1, kaynak: "More & More" },
    { id: "sg-11", tarih: getPastDateISO(11), ders: "matematik", konu: "Veri Analizi", cozulen: 35, dogru: 33, yanlis: 2, kaynak: "Master Matematik" },
    { id: "sg-12", tarih: getPastDateISO(12), ders: "fen", konu: "Basınç", cozulen: 35, dogru: 31, yanlis: 4, kaynak: "Nitelik Fen" },
    { id: "sg-13", tarih: getPastDateISO(14), ders: "turkce", konu: "Cümlenin Ögeleri", cozulen: 30, dogru: 28, yanlis: 2, kaynak: "Hız Yayınları" },
    { id: "sg-14", tarih: getPastDateISO(16), ders: "matematik", konu: "Basit Olayların Olma Olasılığı", cozulen: 35, dogru: 32, yanlis: 3, kaynak: "Master Matematik" },
    { id: "sg-15", tarih: getPastDateISO(18), ders: "fen", konu: "Madde ve Endüstri", cozulen: 35, dogru: 33, yanlis: 2, kaynak: "Nitelik Fen" },
    { id: "sg-16", tarih: getPastDateISO(20), ders: "turkce", konu: "Sözel Mantık ve Muhakeme", cozulen: 30, dogru: 27, yanlis: 3, kaynak: "Hız Yayınları" },
    { id: "sg-17", tarih: getPastDateISO(23), ders: "inkilap", konu: "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar", cozulen: 30, dogru: 29, yanlis: 1, kaynak: "Mozaik Yayınları" },
    { id: "sg-18", tarih: getPastDateISO(26), ders: "din", konu: "Zekât ve Sadaka", cozulen: 25, dogru: 24, yanlis: 1, kaynak: "Karakök" }
  ];

  return {
    profile,
    denemeler,
    program,
    haftalikGecmis,
    kaynaklar,
    yanlislar,
    refleksiyonlar,
    konular,
    soruGecmisi
  };
}
