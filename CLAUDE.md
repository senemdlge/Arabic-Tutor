# Saudi Survival App — Proje Notları

Türkler için Mısır lehçesi Arapça öğreten, mobil öncelikli PWA. Kullanıcı (Senem) Suudi Arabistan'da yaşıyor, iPhone + Safari kullanıyor. Arayüz ve içerik iki dilli (TR/EN). İçerik pan-Arap odaklı (Mısır'a özgü kültürel referans yok; para birimi riyal).

## Mimari (framework yok, saf HTML/CSS/JS)
- `index.html` — tüm paneller tek sayfada; `data-i18n` öznitelikleriyle çeviri; css/js bağlantıları **sürüm parametreli** (`app.js?v=7`)
- `style.css` — Claude Design v2 tasarımı: gece laciverti `#2e3a5c` + altın `#c9a449` + terrakota, kum zemin, Plus Jakarta Sans, anlamsal doğru/yanlış renkleri (`--dogru/--yanlis*`), karanlık mod (`body.karanlik`)
- `data.js` — müfredat (27 ders, 270 kelime), 7 sesli diyalog, cep rehberi, seviyeler
- `en.js` — `EN_SOZLUK` (TR→EN içerik çevirisi) + `UI_METIN` (arayüz metinleri tr/en, anahtar setleri eşit olmalı)
- `app.js` — tüm mantık; `sw.js` + `manifest.json` + `icon*.{svg,png}` PWA
- `.design/` — Claude Design'a aktarım için bileşen kartları (uygulamayı etkilemez; claude.ai/design "Saudi Survival" projesine yüklendi)

## Özellik haritası (app.js)
- Bugün: günlük hedefler (tıklanabilir), günün kelimesi, SRS özeti, seviye kartı
- Ders: kelime kartları (🔊 dinle / basılı tut=yavaş, 🎤 telaffuz puanı, 💡 AI alternatifler+🔍 kelime analizi), ▶️ tüm dersi dinle
- Pratik: anlam/dinleme quizi (💡 ipuçlu), eşleştirme, flashcard (SRS), ⚡ hız turu, 🔢 sayı antrenörü (`sayiSoyle` 0-999)
- Konuş: telaffuz seansı (10 kelime tek tek), 7 senaryolu sesli diyalog, 🤖 AI Hoca (ipucu tuşlu, kullanıcı mesajının çevirisi balona eklenir)
- Çevirmen: yazılı/sesli çeviri + alternatifler + kelime kelime; 🎙️ Canlı Tercüman (manuel iki tuş + 🔄 Otomatik Sohbet Modu: VAD ile sürekli dinleme, dil otomatik algılama)
- Rehber: dokun-konuşsun ifadeler + 💡 alternatifler
- Plan: yol haritası, aktivite ısı haritası, rozetler, istatistikler, 📤 paylaş
- Native his: swipe ile sekme geçişi (alt ekranda sağa kaydır=geri), yönlü panel animasyonları, sekme başına scroll hafızası, Pratik sekmesinde SRS rozeti, titreşim

## Kritik kurallar
- **Okunuş (transliterasyon)**: Türkçe fonetik, native onaylı. Kelime sonu ة = "a" (hamsa, lahma, ahva). أوي = "avi", أنا = "ene". Uzun ünlü = çift harf (aa, ee), şedde = çift ünsüz, ق/hemze = `'`. EN modda otomatik dönüşüm: ş→sh, v→w, ğ→gh, ê→ei (`okunusGoster()`). **AI üretimleri de aynı sistemi kullanmalı** → tüm AI promptlarında `fonetikYonerge()` geçer.
- **Ses**: OpenAI anahtarı (kullanıcı cihazında localStorage, ASLA repoya girmez) varsa: TTS=gpt-4o-mini-tts (voice: alloy, tek ton — `oaiSesUrl`), STT=gpt-4o-mini-transcribe (beklenen cümle `prompt` ipucu olarak gider; `dil:"auto"` = dil dayatmasız), sohbet/çeviri=gpt-4o-mini. **Anahtar varken tarayıcı sesine ASLA düşülmez.** Tek kalıcı `oaiPlayer` (iOS autoplay kilidi ilk dokunuşta açılır).
- **Telaffuz puanlama**: `telaffuzSkoru` hem Arapça yazı hem Latin çözümlemeyi karşılaştırır (çözümleyici bazen "Yallah." gibi Latin döndürür — doğru kabul edilmeli).
- **Yedek Al** anahtarı dışarıda bırakır; Yedek Yükle cihazdaki anahtarı korur (güvenlik).
- İlerleme `localStorage["misirca"]` içinde (`S` nesnesi).
- **Sürümleme**: css/js değişince `index.html` + `sw.js`'teki `?v=N` BİRLİKTE artırılmalı (karışık sürüm önbelleği önler).

## Test ve yayın
- Test: `node test.js` (statik bütünlük: veri, i18n kapsamı, element id'leri, sayı üretici, telaffuz puanlama, fonetik dönüştürücü) ve `node test-dom.js` (jsdom tıklama testleri; jsdom kurulu değilse `npm install --no-save jsdom`). **Her değişiklikten sonra ikisi de SIFIR HATA vermeli.** Dinamik üretilen element id'leri test.js'teki `dinamik` setine eklenmeli.
- Akış: `claude/...` branch → commit → main'e rebase gerekebilir (squash merge'ler yüzünden) → push → PR → squash merge. Yayın: GitHub Pages (main) → https://senemdlge.github.io/Arabic-Tutor/
- Kullanıcı güncellemeyi görmek için uygulamayı 2 kez kapatıp açar (service worker).

## Yapılanlar / durum
- Claude Design v2 tasarımı uygulandı (PR #18); transliterasyon native onaylı; tüm ana istekler tamamlandı (PR #1-#26).
- Olası sonraki işler: hafta 6-8 tekrar haftalarına gerçek içerik, ElevenLabs ses seçeneği, anahtar gizlemek için Cloudflare Worker proxy'si.
