# 🏜️ Saudi Survival App

Türkler için sıfırdan konuşma Arapçası öğreten, mobil öncelikli interaktif uygulama.
Lehçe olarak **Mısır lehçesi** kullanılır (Arap dünyasının her yerinde — Suudi Arabistan dahil — anlaşılan, en yaygın ve en kolay lehçe), içerik ise her Arap ülkesinde geçen günlük ifadelere odaklanır.
Harf öğrenmeye gerek yok — her şey **Türkçe okunuşuyla** yazılır (ör. *halaas!*, *yalla!*, *izzeyyek?*).

## Özellikler

- 🌍 **İki dilli**: arayüz ve tüm içerik Türkçe + İngilizce (üst bardaki TR/EN düğmesiyle anında geçiş; İngilizce modda okunuşlar da İngilizce fonetiğe çevrilir: *şukran → shukran*)
- 🗣️ **Doğal ses (isteğe bağlı)**: ayarlara OpenAI API anahtarı girersen kelimeler ChatGPT'nin doğal sesiyle (gpt-4o-mini-tts) okunur; girmezsen tarayıcı sesi kullanılır
- ⚡ **Hız Turu**: 60 saniyede kaç doğru yapabilirsin?
- 🔢 **Sayı Antrenörü**: 0-999 arası her sayının Arapça okunuşu — pazarlık için! (125 → *miyya ve hamse ve işriin*)
- ▶️ **Dersi baştan sona dinle**: yolda/sporda dinlemek için otomatik çalma
- 📆 **Aktivite takvimi** ve 📤 ilerleme paylaşma

- 📅 **Günlük hedefler** (~15 dk/gün): günün dersi, quiz, konuşma ve dinleme; XP, 🔥 seri ve seviye sistemi (Yeni Başlayan → Yarı Mısırlı 👑)
- 🗓️ **8 haftalık ajanda**: en çok kullanılan kelimelerden başlayan 26 ders (selamlaşma, sayılar, restoran, pazarlık, **iş hayatı/ofis**) + pekiştirme haftaları, rozetler, istatistikler
- 🔊 **Sesli okuma** ve 🎤 **telaffuz kontrolü**: mikrofona söyle, % doğruluk puanı al; ne duyduğunu da gösterir
- 💬 **Sesli diyalog modu**: uygulama karşındaki kişiyi seslendirir (kafe, taksi, ofis, toplantı), repliğini mikrofonla söylersin
- 🃏 **Akıllı tekrar (flashcard)**: zorlandığın kelimeler otomatik tekrar destesine düşer (aralıklı tekrar algoritması)
- 🧩 **Eşleştirme oyunu** + 📝 anlam ve 👂 dinleme quizleri
- 🌐 **Çevirmen**: yazılı veya sesli Türkçe↔Arapça çeviri + Türkçe okunuş + sesli okuma + "sen söyle" telaffuz testi (MyMemory API)
- 🆘 **Cep Rehberi**: gerçek hayatta sıkışınca dokun, telefon senin yerine Arapça konuşsun (acil durum, taksi, restoran, ofis...)
- 🌙 Karanlık mod, konfeti, titreşim geri bildirimi, PWA (ana ekrana eklenir, dersler internetsiz çalışır)
- ⚙️ Arapça yazı varsayılan **gizli** — istersen ayarlardan aç

## Kurulum

1. **GitHub Pages**: *Settings → Pages → Deploy from a branch → main* seç.
2. Telefonda `https://<kullanıcı>.github.io/Arabic-Tutor/` adresini aç → tarayıcı menüsünden **"Ana ekrana ekle"**.

> 🎤 Konuşma tanıma için Android'de **Chrome**, iPhone'da **Safari** kullan. İlk kullanımda mikrofon izni ver.

## Dosyalar

- `index.html` / `style.css` — arayüz (mobil öncelikli, modern tasarım)
- `data.js` — müfredat, diyaloglar, cep rehberi, seviye tanımları
- `app.js` — uygulama mantığı (TTS, konuşma tanıma, SRS, quiz, çeviri, ilerleme)
- `manifest.json` / `sw.js` / `icon.svg` — PWA desteği
