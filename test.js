// Statik bütünlük testleri — node test.js
// Veri yapıları, çeviri kapsamı, element kimlikleri ve sayı üretici doğrulanır.
"use strict";
const fs = require("fs");

let hata = 0;
function fail(msg) { hata++; console.error("❌ " + msg); }
function ok(msg) { console.log("✅ " + msg); }

const dataCode = fs.readFileSync("data.js", "utf8");
const enCode = fs.readFileSync("en.js", "utf8");
const appCode = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");

const { CURRICULUM, DIYALOGLAR, CEP_REHBERI, SEVIYELER, GUNLUK_HEDEFLER, EN_SOZLUK, UI_METIN } =
  new Function(dataCode + ";" + enCode + "; return {CURRICULUM,DIYALOGLAR,CEP_REHBERI,SEVIYELER,GUNLUK_HEDEFLER,EN_SOZLUK,UI_METIN};")();

// ---- 1. Veri bütünlüğü ----
let kelime = 0;
const dersIds = [];
for (const h of CURRICULUM) {
  if (!h.baslik) fail(`Hafta ${h.hafta}: başlık yok`);
  if (h.tekrar) { if (!h.aciklama) fail(`Hafta ${h.hafta}: açıklama yok`); continue; }
  for (const d of h.dersler) {
    dersIds.push(d.id);
    if (!d.id || !d.baslik) fail(`Hafta ${h.hafta}: ders id/başlık eksik`);
    for (const it of d.items) {
      kelime++;
      if (!it.ar || !it.tr || !it.anlam) fail(`${d.id}: eksik alan ${JSON.stringify(it)}`);
      if (!/[؀-ۿ]/.test(it.ar)) fail(`${d.id}: '${it.tr}' Arapça yazı içermiyor`);
    }
  }
}
if (new Set(dersIds).size !== dersIds.length) fail("Tekrarlanan ders id var");
ok(`Müfredat: ${dersIds.length} ders, ${kelime} kelime`);

for (const dg of DIYALOGLAR) {
  for (const a of dg.adimlar) {
    if (!a.rol || !a.ar || !a.tr || !a.anlam) fail(`${dg.id}: eksik adım alanı`);
    if (a.rol === "app" && !a.kisi) fail(`${dg.id}: app adımında kişi yok`);
    if (!["app", "sen"].includes(a.rol)) fail(`${dg.id}: geçersiz rol ${a.rol}`);
  }
}
ok(`Diyaloglar: ${DIYALOGLAR.length} senaryo`);

for (const k of CEP_REHBERI)
  for (const f of k.ifadeler)
    if (!f.ar || !f.tr || !f.anlam) fail(`Rehber '${k.kategori}': eksik alan`);
ok(`Cep rehberi: ${CEP_REHBERI.length} kategori`);

// ---- 2. İngilizce çeviri kapsamı ----
const gerekli = new Set();
for (const h of CURRICULUM) {
  gerekli.add(h.baslik);
  if (h.tekrar) { gerekli.add(h.aciklama); continue; }
  for (const d of h.dersler) { gerekli.add(d.baslik); for (const it of d.items) gerekli.add(it.anlam); }
}
for (const dg of DIYALOGLAR) {
  gerekli.add(dg.baslik); gerekli.add(dg.seviye);
  for (const a of dg.adimlar) { gerekli.add(a.anlam); if (a.kisi) gerekli.add(a.kisi); }
}
for (const k of CEP_REHBERI) { gerekli.add(k.kategori); for (const f of k.ifadeler) gerekli.add(f.anlam); }
for (const g of GUNLUK_HEDEFLER) gerekli.add(g.baslik);
for (const s of SEVIYELER) gerekli.add(s.ad);

const eksikEn = [...gerekli].filter(k => !EN_SOZLUK[k]);
if (eksikEn.length) fail(`EN_SOZLUK'ta eksik ${eksikEn.length} çeviri:\n   - ` + eksikEn.join("\n   - "));
else ok(`İngilizce içerik sözlüğü: ${gerekli.size} metnin tamamı çevrildi`);

// ---- 3. UI_METIN tr/en anahtar eşitliği ----
const trK = Object.keys(UI_METIN.tr), enK = Object.keys(UI_METIN.en);
const sadeceTr = trK.filter(k => !enK.includes(k));
const sadeceEn = enK.filter(k => !trK.includes(k));
if (sadeceTr.length) fail("UI_METIN.en'de eksik: " + sadeceTr.join(", "));
if (sadeceEn.length) fail("UI_METIN.tr'de eksik: " + sadeceEn.join(", "));
if (!sadeceTr.length && !sadeceEn.length) ok(`Arayüz metinleri: ${trK.length} anahtar, tr/en eşit`);

// ---- 4. app.js'te kullanılan t()/tf() anahtarları ----
const kullanilan = new Set();
for (const m of appCode.matchAll(/\bt(?:f)?\(\s*"([^"]+)"/g)) kullanilan.add(m[1]);
const tanimsiz = [...kullanilan].filter(k => !UI_METIN.tr[k]);
if (tanimsiz.length) fail("app.js'te tanımsız i18n anahtarı: " + tanimsiz.join(", "));
else ok(`app.js i18n: ${kullanilan.size} anahtarın tamamı tanımlı`);

// ---- 5. index.html data-i18n anahtarları ----
const htmlKeys = new Set();
for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) htmlKeys.add(m[1]);
const htmlTanimsiz = [...htmlKeys].filter(k => !UI_METIN.tr[k]);
if (htmlTanimsiz.length) fail("index.html'de tanımsız i18n anahtarı: " + htmlTanimsiz.join(", "));
else ok(`index.html i18n: ${htmlKeys.size} anahtarın tamamı tanımlı`);

// ---- 6. app.js'in kullandığı statik elemanlar index.html'de var mı ----
const htmlIds = new Set();
for (const m of html.matchAll(/id="([^"]+)"/g)) htmlIds.add(m[1]);
// Çalışma anında JS'in oluşturduğu kimlikler:
const dinamik = new Set(["derseGitBtn", "srsGit", "iosBanner", "iosBannerKapat", "dersiBitirBtn", "dersCal",
  "quizSes", "fkart", "fSes", "fBildim", "fBilemedim", "dlgGeri", "dlgBalonlar", "dlgSira", "dlgIpucu",
  "dlgMic", "dlgAtla", "dlgDurum", "dlgBitti", "hizSure", "hizBar", "sayiGirdi", "sayiCevirBtn", "sayiCevirSonuc", "aiHintSes", "aiHintGonder", "telYeniSeans", "telSes", "telGec", "telMic", "telDurum", "quizHint", "quizHintAlan"]);
const eksikId = [];
for (const m of appCode.matchAll(/\$\("#([A-Za-z0-9_-]+)"\)/g)) {
  const id = m[1];
  if (!htmlIds.has(id) && !dinamik.has(id)) eksikId.push(id);
}
const benzersizEksik = [...new Set(eksikId)];
if (benzersizEksik.length) fail("index.html'de olmayan id: " + benzersizEksik.join(", "));
else ok("Tüm statik element kimlikleri index.html'de mevcut");

// ---- 7. index.html'deki id'lere app.js'ten erişim (ters yön: ölü id kontrolü değil, kritik olanlar) ----
["dersSecimi", "quizDersSecimi", "konusmaDersSecimi", "modAnlam", "modDinleme", "modEslestirme",
 "modFlashcard", "modHiz", "modSayi", "modTelaffuz", "modDiyalog", "modAiHoca", "aiGonder", "aiMic", "aiHint",
 "ceviriMic", "ceviriYap", "ceviriDinle", "ceviriTekrarla", "paylasBtn", "dilBtn", "settingsBtn",
 "ayarDil", "ayarOaiKey", "yedekAl", "yedekYukle"].forEach(id => {
  if (!htmlIds.has(id)) fail(`Kritik id index.html'de yok: ${id}`);
  if (!appCode.includes(`"#${id}"`)) fail(`app.js '${id}' elementini hiç kullanmıyor`);
});
ok("Kritik etkileşim elemanları iki yönde de bağlı");

// ---- 8. sayiSoyle birim testleri ----
const sayiTest = new Function(appCode.slice(appCode.indexOf("const SAYI_BIRIM"), appCode.indexOf("function sayiAntrenorBaslat"))
  + "; return sayiSoyle;")();
const beklenen = {
  0: "sifr", 1: "vaahid", 7: "seb'a", 10: "aşara", 11: "hidaaşar", 15: "hamastaaşar",
  20: "işriin", 25: "hamsa ve işriin", 99: "tis'a ve tisaiin", 100: "miyya",
  101: "miyya ve vaahid", 125: "miyya ve hamsa ve işriin", 200: "miteyn",
  350: "tultumiyya ve hamsiin", 999: "tusumiyya ve tis'a ve tisaiin"
};
let sayiHata = 0;
for (const [n, b] of Object.entries(beklenen)) {
  const s = sayiTest(parseInt(n, 10));
  if (!s || s.tr !== b) { fail(`sayiSoyle(${n}) = "${s && s.tr}" beklenen "${b}"`); sayiHata++; }
}
if (!sayiHata) ok("Sayı üretici: 15 örnek doğru (0-999)");
if (sayiTest(1000) !== null || sayiTest(-1) !== null) fail("sayiSoyle sınır kontrolü hatalı");

// ---- 9. EN fonetik dönüştürücü ----
const fonetikTest = new Function(
  "const S={dil:'en'};" +
  appCode.slice(appCode.indexOf("const EN_FONETIK"), appCode.indexOf("function applyI18n")) +
  "; return okunusGoster;")();
const fonetikBeklenen = { "şukran": "shukran", "vaahid": "waahid", "ğaali avi": "ghaali awi", "sabaah il-hêr": "sabaah il-heir" };
for (const [g, b] of Object.entries(fonetikBeklenen)) {
  const s = fonetikTest(g);
  if (s !== b) fail(`okunusGoster("${g}") = "${s}" beklenen "${b}"`);
}
ok("İngilizce fonetik dönüştürücü doğru");

// ---- 9b. Telaffuz puanlama: Latin harfli çözümlemeler de kabul edilmeli ----
const skorKodu = appCode.slice(appCode.indexOf("function levenshtein"), appCode.indexOf("// ===================== ARAPÇA"));
const { telaffuzSkoru } = new Function(
  "const arapcaNormalize = " + appCode.slice(appCode.indexOf("function arapcaNormalize"), appCode.indexOf("function levenshtein")) +
  skorKodu + "; return { telaffuzSkoru };")();
const yalla = { ar: "يلا", tr: "yalla" };
if (telaffuzSkoru(yalla, ["Yallah."]) < 75) fail(`"Yallah." için düşük puan: ${telaffuzSkoru(yalla, ["Yallah."])}`);
if (telaffuzSkoru(yalla, ["يلا"]) !== 100) fail("Arapça tam eşleşme 100 değil");
const shukran = { ar: "شكراً", tr: "şukran" };
if (telaffuzSkoru(shukran, ["shukran"]) < 80) fail(`"shukran" için düşük puan: ${telaffuzSkoru(shukran, ["shukran"])}`);
if (telaffuzSkoru(yalla, ["tamamen alakasız bir cümle"]) > 40) fail("Alakasız söze yüksek puan verildi");
ok("Telaffuz puanlama: Arapça + Latin çözümlemeler doğru puanlanıyor");

// ---- 10. manifest & sw ----
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
if (!manifest.icons.length || !manifest.name) fail("manifest.json eksik");
const sw = fs.readFileSync("sw.js", "utf8");
for (const dosya of ["index.html", "style.css", "app.js", "data.js", "en.js", "icon-180.png"]) {
  if (!fs.existsSync(dosya)) fail(`Dosya yok: ${dosya}`);
  if (!sw.includes(dosya)) fail(`sw.js önbelleğinde eksik: ${dosya}`);
}
if (!html.includes('src="en.js')) fail("index.html en.js'i yüklemiyor");
const scriptSira = html.indexOf('src="data.js') < html.indexOf('src="en.js') && html.indexOf('src="en.js') < html.indexOf('src="app.js');
if (!scriptSira) fail("Script yükleme sırası yanlış (data → en → app olmalı)");
ok("Manifest, service worker ve script sırası doğru");

// ---- Sonuç ----
console.log(hata ? `\n💥 ${hata} HATA BULUNDU` : "\n🎉 SIFIR HATA — tüm testler geçti");
process.exit(hata ? 1 : 0);
