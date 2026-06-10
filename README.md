# 🇪🇬 Mısırca Hocam — Egyptian Arabic Tutor

Türkler için sıfırdan **Mısır lehçesi Arapça** öğreten interaktif web uygulaması.
Harf öğrenmeye gerek yok — tüm kelimeler **Türkçe okunuşuyla** yazılır (ör. *izzeyyek?* = Nasılsın?).

## Özellikler

- 📅 **Günlük hedefler** (~15 dk/gün): günün dersi, quiz, konuşma ve dinleme hedefleri; XP ve 🔥 seri takibi
- 🗓️ **8 haftalık ajanda**: 20 ders + 4 pekiştirme haftası, ilerleme çubuğu ve rozetler
- 🔊 **Sesli okuma**: her kelimeyi normal veya 🐢 yavaş hızda dinle (tarayıcı TTS, Arapça ses)
- 🎤 **Telaffuz kontrolü**: mikrofona söyle, uygulama Arapça konuşma tanımayla karşılaştırıp % doğruluk puanı verir
- 🌐 **Çevirmen**: yazılı veya sesli Türkçe↔Arapça çeviri + otomatik Türkçe okunuş + sesli okuma (MyMemory API, ücretsiz)
- 🧠 **Quiz modları**: anlam quizi ve dinleme quizi
- ⚙️ Arapça yazı varsayılan olarak **gizli** — istersen ayarlardan açabilirsin

## Nasıl Çalıştırılır

Kurulum gerekmez. İki seçenek:

1. **GitHub Pages** (önerilen): Repo ayarlarından *Settings → Pages → Deploy from branch* seç. Telefonda tarayıcıdan açıp "Ana ekrana ekle" diyebilirsin.
2. **Lokal**: `index.html` dosyasını tarayıcıda aç (mikrofon için `https` veya `localhost` gerekir: `python3 -m http.server` ile açabilirsin).

## Tarayıcı Notları

- 🎤 Konuşma tanıma için **Chrome** (Android/masaüstü) veya **Safari** (iOS) kullan.
- 🔊 Arapça ses, cihazda yüklü TTS seslerine bağlıdır; ayarlardan ses seçebilirsin.
- İlerleme tarayıcıda (localStorage) saklanır.

## Dosyalar

- `index.html` — arayüz
- `style.css` — tasarım (mobil + masaüstü responsive)
- `data.js` — müfredat: 4 haftalık ders içeriği + günlük hedef tanımları
- `app.js` — uygulama mantığı (TTS, konuşma tanıma, quiz, çeviri, ilerleme)
