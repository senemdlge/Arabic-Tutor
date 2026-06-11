# Saudi Survival App — Proje Notları

Türkler için Mısır lehçesi Arapça öğreten, mobil öncelikli PWA. Kullanıcı (Senem) Suudi Arabistan'da yaşıyor, iPhone + Safari kullanıyor. Arayüz ve içerik iki dilli (TR/EN).

## Mimari (framework yok, saf HTML/CSS/JS)
- `index.html` — tüm paneller tek sayfada; `data-i18n` öznitelikleriyle çeviri
- `style.css` — tasarım sistemi: gece laciverti `#2e3a5c` + altın `#c9a449` + terrakota, kum zemin `#f7f5f0`, Plus Jakarta Sans, karanlık mod (`body.karanlik`)
- `data.js` — müfredat (27 ders, 270 kelime), 7 sesli diyalog, cep rehberi, seviyeler
- `en.js` — `EN_SOZLUK` (TR→EN içerik çevirisi) + `UI_METIN` (arayüz metinleri tr/en)
- `app.js` — tüm mantık; `sw.js` + `manifest.json` + `icon*.{svg,png}` PWA
- `.design/` — Claude Design'a aktarım için bileşen önizleme kartları (uygulamayı etkilemez)

## Kritik kurallar
- **Okunuş (transliterasyon)**: Türkçe fonetik, native onaylı. Kelime sonu ة = "a" (hamsa, lahma, ahva). أوي = "avi". Uzun ünlü = çift harf (aa, ee), şedde = çift ünsüz, ق/hemze = `'`. EN modda otomatik dönüşüm: ş→sh, v→w, ğ→gh, ê→ei (`okunusGoster()`).
- **Ses**: OpenAI anahtarı (kullanıcı cihazında localStorage, ASLA repoya girmez) varsa: TTS=gpt-4o-mini-tts (voice: alloy, tek ton), STT=gpt-4o-mini-transcribe, sohbet/çeviri=gpt-4o-mini. Anahtar varken tarayıcı sesine ASLA düşülmez. Tek kalıcı `oaiPlayer` (iOS autoplay kilidi ilk dokunuşta açılır).
- **Yedek Al** anahtarı dışarıda bırakır (güvenlik).
- İlerleme `localStorage["misirca"]` içinde (`S` nesnesi).

## Test ve yayın
- Test: `node test.js` (statik bütünlük: veri, i18n kapsamı, element id'leri, sayı üretici) ve `node test-dom.js` (jsdom tıklama testleri). **Her değişiklikten sonra ikisi de SIFIR HATA vermeli.**
- Akış: `claude/...` branch → commit → main'e rebase gerekebilir (squash merge'ler yüzünden) → push → PR → squash merge. Yayın: GitHub Pages (main) → https://senemdlge.github.io/Arabic-Tutor/
- Kullanıcı güncellemeyi görmek için uygulamayı 2 kez kapatıp açar (service worker).

## Bekleyen iş
- Kullanıcı claude.ai/design ile tasarımı iyileştirmek istiyor. `.design/` kartları hazır; terminalde `/login` sonrası DesignSync ile "Saudi Survival" projesi olarak yüklenebilir. Dönen tasarımı `style.css`'e uyarla (yapı ve işlevsellik korunarak), testlerden geçir, yayınla.
