// Çalışma zamanı duman testi — jsdom içinde uygulamayı gerçekten başlatır ve tıklar.
"use strict";
const fs = require("fs");
const { JSDOM } = require("jsdom");

let hata = 0;
const fail = (m) => { hata++; console.error("❌ " + m); };
const ok = (m) => console.log("✅ " + m);

const html = fs.readFileSync("index.html", "utf8");
const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://app.test/", pretendToBeVisual: true });
const { window } = dom;

// --- Tarayıcı API taklitleri ---
window.localStorage.clear();
window.speechSynthesis = {
  speak: () => {}, cancel: () => {}, getVoices: () => [
    { name: "Majed", lang: "ar-SA", voiceURI: "majed", localService: true },
    { name: "Google Arabic", lang: "ar-EG", voiceURI: "g-ar", localService: false }
  ]
};
window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
window.navigator.vibrate = () => true;
window.matchMedia = window.matchMedia || (() => ({ matches: false }));
window.fetch = async () => ({ ok: true, json: async () => ({ responseData: { translatedText: "مرحبا" } }), blob: async () => new window.Blob() });
window.confirm = () => false;
window.HTMLElement.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};
window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
window.HTMLDialogElement.prototype.close = function () { this.open = false; };

const hatalar = [];
window.addEventListener("error", (e) => hatalar.push(e.message));

// --- Scriptleri yükle ---
// Not: window.eval her çağrıda ayrı sözcüksel kapsam açar (const paylaşılmaz);
// gerçek tarayıcıdaki script-arası paylaşımı taklit etmek için birleştirip tek seferde çalıştırıyoruz.
try {
  const birlesik = ["data.js", "en.js", "app.js"].map(d => fs.readFileSync(d, "utf8")).join("\n;\n");
  dom.window.eval(birlesik);
} catch (e) {
  fail(`Uygulama başlatılırken hata: ${e.message}`);
}
if (!hata) ok("Uygulama jsdom'da hatasız başladı");

const $ = (s) => window.document.querySelector(s);
const $$ = (s) => window.document.querySelectorAll(s);
const tikla = (s, ad) => {
  const el = $(s);
  if (!el) { fail(`Element bulunamadı: ${s} (${ad})`); return false; }
  try { el.click(); return true; } catch (e) { fail(`${ad} tıklanınca hata: ${e.message}`); return false; }
};

// --- 1. Açılış görünümü ---
if (!$("#selamlama").textContent) fail("Selamlama boş");
if (!$("#hedefListesi").children.length) fail("Hedef listesi boş");
if (!$("#gununKelimesi").querySelector(".okunus")) fail("Günün kelimesi yok");
if (!$("#dersIcerik").querySelector(".kelime-kart")) fail("Ders içeriği boş");
if ($("#dersSecimi").options.length !== 27) fail("Ders seçici 27 ders listelemiyor: " + $("#dersSecimi").options.length);
ok("Açılış: bugün paneli + ders yüklendi");

// --- 2. Sekme gezintisi ---
for (const tab of ["ders", "pratik", "konusma", "cevirmen", "rehber", "ajanda", "bugun"]) {
  tikla(`.tab[data-tab="${tab}"]`, "sekme " + tab);
  if (!$(`#panel-${tab}`).classList.contains("active")) fail(`Panel açılmadı: ${tab}`);
}
if (!$("#rehberKategoriler").querySelectorAll(".rehber-ifade").length) fail("Rehber ifadeleri boş");
if (!$("#ajandaListesi").querySelectorAll(".hafta-kart").length) fail("Ajanda boş");
if ($("#aktiviteTakvim").children.length !== 28) fail("Aktivite takvimi 28 gün değil");
ok("7 sekme de açılıyor; rehber, ajanda, takvim dolu");

// --- 3. Quiz akışı ---
tikla('.tab[data-tab="pratik"]', "pratik");
tikla("#modAnlam", "anlam quizi");
if ($("#quizAlani").classList.contains("hidden")) fail("Quiz alanı açılmadı");
let secenek = $("#quizAlani .quiz-secenek");
if (!secenek) fail("Quiz seçenekleri yok");
else { secenek.click(); ok("Quiz başlıyor ve cevap verilebiliyor"); }
// geri dön
tikla('#quizAlani [data-geri]', "quiz çık") || tikla('[data-geri="pratik"]', "geri");

// --- 4. Eşleştirme ---
tikla("#modEslestirme", "eşleştirme");
const eslKartlar = $$("#eslestirmeAlani .esl-kart");
if (eslKartlar.length !== 12) fail("Eşleştirme 12 kart üretmedi: " + eslKartlar.length);
else { eslKartlar[0].click(); eslKartlar[1].click(); ok("Eşleştirme oyunu çalışıyor (12 kart)"); }
tikla('#eslestirmeAlani [data-geri]', "eşleştirme çık");

// --- 5. Flashcard ---
tikla("#modFlashcard", "flashcard");
if (!$("#fkart")) fail("Flashcard görünmedi");
else {
  $("#fkart").click();
  if (!$("#fkart").classList.contains("acik")) fail("Flashcard çevrilmedi");
  tikla("#fBildim", "bildim");
  ok("Flashcard çevriliyor ve ilerliyor");
}
tikla('#flashcardAlani [data-geri]', "fc çık");

// --- 6. Hız turu ---
tikla("#modHiz", "hız turu");
if (!$("#hizAlani .quiz-secenek")) fail("Hız turu soruları yok");
else { $("#hizAlani .quiz-secenek").click(); ok("Hız turu çalışıyor"); }
tikla('#hizAlani [data-geri]', "hız çık");

// --- 7. Sayı antrenörü ---
tikla("#modSayi", "sayı antrenörü");
if (!$("#sayiGirdi")) fail("Sayı girdisi yok");
$("#sayiGirdi").value = "125";
tikla("#sayiCevirBtn", "sayı çevir");
const sayiSonuc = $("#sayiCevirSonuc .okunus");
if (!sayiSonuc || !sayiSonuc.textContent.includes("miyya")) fail("125 çevirisi yanlış: " + (sayiSonuc && sayiSonuc.textContent));
else ok("Sayı antrenörü: 125 → " + sayiSonuc.textContent);
const sayiSec = $("#sayiAlani .quiz-secenek");
if (sayiSec) sayiSec.click();
tikla('#sayiAlani [data-geri]', "sayı çık");

// --- 8. Diyalog modu ---
tikla('.tab[data-tab="konusma"]', "konuşma");
tikla("#modDiyalog", "diyalog menü");
const dlgBtn = $('#diyalogAlani [data-dlg]');
if (!dlgBtn) fail("Diyalog listesi boş");
else {
  dlgBtn.click();
  if (!$("#dlgBalonlar") || !$("#dlgBalonlar").children.length) fail("Diyalog balonları oluşmadı");
  else ok("Diyalog başlıyor, balonlar oluşuyor");
}

// --- 8b. AI Hoca (anahtarsız: uyarı göstermeli) ---
tikla("#modAiHoca", "AI hoca");
if ($("#aiAlani").classList.contains("hidden")) fail("AI ekranı açılmadı");
if (!$("#aiDurum").textContent.includes("OpenAI")) fail("Anahtar uyarısı görünmedi: " + $("#aiDurum").textContent);
else ok("AI Hoca: anahtar yokken yönlendirme gösteriliyor");
tikla('#aiAlani [data-geri]', "ai çık");

// --- 9. Dil değiştirme (EN) ---
tikla("#dilBtn", "dil düğmesi");
const enTab = $('.tab[data-tab="bugun"] em').textContent;
if (enTab !== "Today") fail("Sekme İngilizceye dönmedi: " + enTab);
tikla('.tab[data-tab="bugun"]', "bugün EN");
const selamEn = $("#selamlama").textContent;
if (!/Good|Ahlan|kheir/.test(selamEn)) fail("EN selamlama yanlış: " + selamEn);
const hedefEn = $("#hedefListesi").textContent;
if (!hedefEn.includes("quiz") && !hedefEn.includes("lesson")) fail("Hedefler İngilizceye dönmedi");
tikla('.tab[data-tab="rehber"]', "rehber EN");
if (!$("#rehberKategoriler").textContent.includes("Emergency")) fail("Rehber İngilizceye dönmedi");
// İngilizce fonetik kontrolü: ş -> sh
if ($("#rehberKategoriler").textContent.includes("ş")) fail("EN modunda Türkçe fonetik kaldı (ş)");
ok("Dil değiştirme: arayüz + içerik + fonetik İngilizceye geçiyor");

// --- 10. Geri Türkçeye dön ---
tikla("#dilBtn", "dil düğmesi TR");
if ($('.tab[data-tab="bugun"] em').textContent !== "Bugün") fail("Türkçeye geri dönmedi");
ok("Türkçeye geri dönüş çalışıyor");

// --- 11. Ayarlar ---
tikla("#settingsBtn", "ayarlar");
if (!$("#settingsDialog").open) fail("Ayarlar açılmadı");
$("#ayarOaiKey").value = "sk-test";
$("#ayarOaiKey").dispatchEvent(new window.Event("change", { bubbles: true }));
$("#ayarKaranlik").checked = true;
$("#ayarKaranlik").dispatchEvent(new window.Event("change", { bubbles: true }));
if (!window.document.body.classList.contains("karanlik")) fail("Karanlık mod uygulanmadı");
const kayitli = JSON.parse(window.localStorage.getItem("misirca"));
if (kayitli.oaiKey !== "sk-test") fail("OpenAI anahtarı kaydedilmedi");
if (!kayitli.karanlik) fail("Karanlık mod kaydedilmedi");
tikla("#ayarKapat", "ayar kapat");
ok("Ayarlar: karanlık mod + OpenAI anahtarı kaydediliyor");

// --- 12. Çevirmen (sahte fetch ile) ---
tikla('.tab[data-tab="cevirmen"]', "çevirmen");
$("#ceviriGirdi").value = "merhaba";
(async () => {
  $("#ceviriYap").click();
  await new Promise(r => setTimeout(r, 50));
  if ($("#ceviriSonuc").classList.contains("hidden")) fail("Çeviri sonucu görünmedi");
  if (!$("#ceviriMetin").textContent) fail("Çeviri metni boş");
  else ok("Çevirmen akışı çalışıyor (sahte API): " + $("#ceviriMetin").textContent);

  // --- 13. XP / hedef sistemi ---
  const xpOnce = JSON.parse(window.localStorage.getItem("misirca")).xp;
  tikla('.tab[data-tab="ders"]', "ders");
  const dinleBtn = $('#dersIcerik [data-rol="dinle"]');
  if (dinleBtn) for (let i = 0; i < 10; i++) dinleBtn.click();
  const sonra = JSON.parse(window.localStorage.getItem("misirca"));
  if (sonra.xp <= xpOnce) fail("Dinleme hedefi XP vermedi");
  if (sonra.gunlukHedef.dinleme < 10) fail("Dinleme sayacı ilerlemedi: " + sonra.gunlukHedef.dinleme);
  else ok("Günlük hedef + XP sistemi çalışıyor (dinleme 10/10, +XP)");

  if (hatalar.length) fail("Sayfa hataları: " + hatalar.join("; "));
  console.log(hata ? `\n💥 ${hata} HATA BULUNDU` : "\n🎉 DOM TESTLERİ: SIFIR HATA");
  process.exit(hata ? 1 : 0);
})();
