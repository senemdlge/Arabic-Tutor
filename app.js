/* Mısırca Hocam — Egyptian Arabic Tutor */
"use strict";

// ===================== DURUM (STATE) =====================
const VARSAYILAN = {
  xp: 0,
  seri: 0,
  sonGun: null,
  bitenDersler: {},        // dersId -> true
  gunlukHedef: {},         // { tarih, ders, quiz, konusma: sayac, dinleme: sayac }
  rozetler: {},
  arapcaGoster: false,
  hiz: 0.8,
  sesURI: null
};

let S = yukle();

function yukle() {
  try {
    const raw = localStorage.getItem("misirca");
    if (raw) return Object.assign({}, VARSAYILAN, JSON.parse(raw));
  } catch (e) {}
  return Object.assign({}, VARSAYILAN);
}
function kaydet() { localStorage.setItem("misirca", JSON.stringify(S)); }

function bugunStr() { return new Date().toISOString().slice(0, 10); }

function gunlukHedefHazirla() {
  if (S.gunlukHedef.tarih !== bugunStr()) {
    // Seri kontrolü: dün hedef tamamlandıysa seri devam, değilse sıfırla
    const dun = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (S.sonGun !== bugunStr() && S.sonGun !== dun) S.seri = 0;
    S.gunlukHedef = { tarih: bugunStr(), ders: false, quiz: false, konusma: 0, dinleme: 0, tamamlandi: false };
    kaydet();
  }
}

function xpEkle(miktar, sebep) {
  S.xp += miktar;
  kaydet();
  ustBilgiGuncelle();
  toast(`+${miktar} XP — ${sebep} ⭐`);
  rozetKontrol();
}

function hedefTamamla(id) {
  gunlukHedefHazirla();
  const h = S.gunlukHedef;
  if (id === "ders" && !h.ders) { h.ders = true; xpEkle(30, "Günün dersi bitti"); }
  if (id === "quiz" && !h.quiz) { h.quiz = true; xpEkle(20, "Quiz tamamlandı"); }
  if (id === "konusma") {
    h.konusma++;
    if (h.konusma === 3) xpEkle(30, "Konuşma hedefi tamam");
  }
  if (id === "dinleme") {
    h.dinleme++;
    if (h.dinleme === 10) xpEkle(10, "Dinleme hedefi tamam");
  }
  // Tüm hedefler tamam mı?
  if (!h.tamamlandi && h.ders && h.quiz && h.konusma >= 3 && h.dinleme >= 10) {
    h.tamamlandi = true;
    if (S.sonGun !== bugunStr()) { S.seri++; S.sonGun = bugunStr(); }
    xpEkle(25, "Günlük hedefler tamamlandı! 🔥");
  }
  kaydet();
  bugunuCiz();
  ustBilgiGuncelle();
}

// ===================== YARDIMCILAR =====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function toast(msg, sure = 2200) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._z);
  t._z = setTimeout(() => t.classList.add("hidden"), sure);
}

function tumDersler() {
  const liste = [];
  for (const hafta of CURRICULUM) {
    if (hafta.tekrar) continue;
    for (const d of hafta.dersler) liste.push({ ...d, hafta: hafta.hafta, haftaBaslik: hafta.baslik });
  }
  return liste;
}

function karistir(dizi) {
  const a = dizi.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===================== SES (TTS) =====================
let sesler = [];
function sesleriYukle() {
  sesler = speechSynthesis.getVoices().filter(v => v.lang.startsWith("ar"));
  const sel = $("#ayarSes");
  sel.innerHTML = "";
  if (!sesler.length) {
    sel.innerHTML = "<option>Arapça ses bulunamadı</option>";
    return;
  }
  for (const v of sesler) {
    const o = document.createElement("option");
    o.value = v.voiceURI;
    o.textContent = `${v.name} (${v.lang})`;
    if (v.voiceURI === S.sesURI) o.selected = true;
    sel.appendChild(o);
  }
}
speechSynthesis.onvoiceschanged = sesleriYukle;

function seslendir(arapca, hizCarpan = 1) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(arapca);
  u.lang = "ar-EG";
  u.rate = S.hiz * hizCarpan;
  const secili = sesler.find(v => v.voiceURI === S.sesURI) ||
                 sesler.find(v => v.lang === "ar-EG") || sesler[0];
  if (secili) u.voice = secili;
  speechSynthesis.speak(u);
}

function turkceSeslendir(metin) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(metin);
  u.lang = "tr-TR";
  speechSynthesis.speak(u);
}

// ===================== KONUŞMA TANIMA (STT) =====================
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

function dinle(dil, callback, hataCallback) {
  if (!SpeechRec) {
    toast("⚠️ Tarayıcın konuşma tanımayı desteklemiyor. Chrome veya Safari dene.");
    if (hataCallback) hataCallback();
    return null;
  }
  const r = new SpeechRec();
  r.lang = dil;
  r.interimResults = false;
  r.maxAlternatives = 3;
  r.onresult = (e) => {
    const alternatifler = [];
    for (let i = 0; i < e.results[0].length; i++) alternatifler.push(e.results[0][i].transcript);
    callback(alternatifler);
  };
  r.onerror = (e) => {
    if (e.error === "not-allowed") toast("⚠️ Mikrofon izni gerekli.");
    else if (e.error === "no-speech") toast("Ses algılanamadı, tekrar dene.");
    else toast("Tanıma hatası: " + e.error);
    if (hataCallback) hataCallback();
  };
  r.onend = () => { if (hataCallback) hataCallback(true); };
  r.start();
  return r;
}

// Arapça metni normalize et (harekeler, elif çeşitleri vs.)
function arapcaNormalize(s) {
  return s
    .replace(/[ً-ْٰ]/g, "")  // harekeler
    .replace(/[أإآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[؟?!.،,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function benzerlik(hedefAr, soylenenler) {
  const hedef = arapcaNormalize(hedefAr);
  let enIyi = 0;
  for (const s of soylenenler) {
    const aday = arapcaNormalize(s);
    const mesafe = levenshtein(hedef, aday);
    const skor = Math.max(0, 1 - mesafe / Math.max(hedef.length, aday.length, 1));
    if (skor > enIyi) enIyi = skor;
  }
  return Math.round(enIyi * 100);
}

// ===================== ARAPÇA → TÜRKÇE OKUNUŞ =====================
const HARF_MAP = {
  "ا": "a", "أ": "e", "إ": "i", "آ": "ee", "ب": "b", "ت": "t", "ث": "s",
  "ج": "g", "ح": "h", "خ": "h", "د": "d", "ذ": "z", "ر": "r", "ز": "z",
  "س": "s", "ش": "ş", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
  "غ": "ğ", "ف": "f", "ق": "'", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "ة": "a", "و": "v", "ي": "y", "ى": "a", "ء": "'", "ئ": "'",
  "ؤ": "'", "لا": "le"
};
const HAREKE_MAP = { "َ": "e", "ُ": "u", "ِ": "i", "ّ": "", "ْ": "", "ً": "en", "ٌ": "un", "ٍ": "in" };

function arapcaOkunus(metin) {
  let out = "";
  for (const ch of metin) {
    if (HARF_MAP[ch] !== undefined) out += HARF_MAP[ch];
    else if (HAREKE_MAP[ch] !== undefined) out += HAREKE_MAP[ch];
    else if (/[a-zA-Z0-9\s.,!?؟]/.test(ch)) out += ch === "؟" ? "?" : ch;
  }
  return out.replace(/\s+/g, " ").trim();
}

// ===================== SEKMELER =====================
$$(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach(b => b.classList.remove("active"));
    $$(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    $("#panel-" + btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "ajanda") ajandayiCiz();
    if (btn.dataset.tab === "bugun") bugunuCiz();
  });
});

function sekmeyeGit(ad) {
  $(`.tab[data-tab="${ad}"]`).click();
}

// ===================== BUGÜN PANELİ =====================
function gununDersi() {
  const dersler = tumDersler();
  return dersler.find(d => !S.bitenDersler[d.id]) || dersler[dersler.length - 1];
}

function bugunuCiz() {
  gunlukHedefHazirla();
  const saat = new Date().getHours();
  const selam = saat < 12 ? "Sabaah il-hêr! ☀️ (Günaydın!)" :
                saat < 18 ? "Ehlen! 👋 (Merhaba!)" : "Mesee' il-hêr! 🌙 (İyi akşamlar!)";
  $("#selamlama").textContent = selam;

  const ders = gununDersi();
  const bitti = S.bitenDersler[ders.id];
  $("#gununDersiCard").innerHTML = `
    <div class="ceviri-etiket">Günün Dersi — Hafta ${ders.hafta}, Gün ${ders.gun}</div>
    <div class="okunus" style="font-size:1.15rem">${ders.baslik} ${bitti ? "✅" : ""}</div>
    <button class="btn primary" id="derseGitBtn" style="margin-top:8px">${bitti ? "Tekrar Et" : "Derse Başla"} →</button>`;
  $("#derseGitBtn").onclick = () => { dersAc(ders.id); sekmeyeGit("ders"); };

  const h = S.gunlukHedef;
  const durumlar = {
    ders: h.ders,
    quiz: h.quiz,
    konusma: h.konusma >= 3,
    dinleme: h.dinleme >= 10
  };
  const ilerlemeYazi = { konusma: `${Math.min(h.konusma, 3)}/3`, dinleme: `${Math.min(h.dinleme, 10)}/10` };
  $("#hedefListesi").innerHTML = GUNLUK_HEDEFLER.map(g => `
    <li class="${durumlar[g.id] ? "tamam" : ""}">
      <span>${durumlar[g.id] ? "✅" : "⬜"} ${g.baslik} ${ilerlemeYazi[g.id] ? `<small>(${ilerlemeYazi[g.id]})</small>` : ""}</span>
      <span class="xp">+${g.xp} XP</span>
    </li>`).join("");

  $("#gunTamamMsg").classList.toggle("hidden", !h.tamamlandi);

  // Günün kelimesi (tarihe göre sabit seçim)
  const hepsi = tumDersler().flatMap(d => d.items);
  const gunNo = Math.floor(Date.now() / 86400000);
  const k = hepsi[gunNo % hepsi.length];
  $("#gununKelimesi").innerHTML = kelimeKartiHTML(k, "gk");
  kelimeKartiBagla($("#gununKelimesi"), k, "gk");
}

// ===================== DERS PANELİ =====================
function dersSecicileriDoldur() {
  const dersler = tumDersler();
  const html = dersler.map(d =>
    `<option value="${d.id}">Hafta ${d.hafta} / Gün ${d.gun} — ${d.baslik} ${S.bitenDersler[d.id] ? "✅" : ""}</option>`
  ).join("");
  $("#dersSecimi").innerHTML = html;
  $("#quizDersSecimi").innerHTML = html + `<option value="__hepsi__">🌟 Tüm Dersler (karışık)</option>`;
  $("#konusmaDersSecimi").innerHTML = html;
}

function kelimeKartiHTML(item, key) {
  return `
    <div class="kelime-kart">
      <div class="kelime-ust">
        <div>
          <div class="okunus">${item.tr}</div>
          <div class="anlam">${item.anlam}</div>
          <div class="arapca-yazi">${item.ar}</div>
        </div>
        <div class="kelime-btnler">
          <button class="btn ses" data-rol="dinle" data-key="${key}">🔊</button>
          <button class="btn ses" data-rol="yavas" data-key="${key}" title="Yavaş dinle">🐢</button>
          <button class="btn mic" data-rol="soyle" data-key="${key}">🎤</button>
        </div>
      </div>
      <div class="telaffuz-alani" data-key="${key}"></div>
    </div>`;
}

function kelimeKartiBagla(kapsayici, item, key) {
  kapsayici.querySelector(`[data-rol="dinle"][data-key="${key}"]`).onclick = () => {
    seslendir(item.ar);
    hedefTamamla("dinleme");
  };
  kapsayici.querySelector(`[data-rol="yavas"][data-key="${key}"]`).onclick = () => {
    seslendir(item.ar, 0.7);
    hedefTamamla("dinleme");
  };
  const micBtn = kapsayici.querySelector(`[data-rol="soyle"][data-key="${key}"]`);
  const alan = kapsayici.querySelector(`.telaffuz-alani[data-key="${key}"]`);
  micBtn.onclick = () => {
    micBtn.classList.add("dinliyor");
    micBtn.textContent = "👂...";
    alan.innerHTML = "";
    dinle("ar-EG", (alternatifler) => {
      const skor = benzerlik(item.ar, alternatifler);
      telaffuzSonucuGoster(alan, skor, item);
      if (skor >= 60) hedefTamamla("konusma");
    }, (bittiMi) => {
      micBtn.classList.remove("dinliyor");
      micBtn.textContent = "🎤";
    });
  };
}

function telaffuzSonucuGoster(alan, skor, item) {
  let sinif, mesaj;
  if (skor >= 75) { sinif = "iyi"; mesaj = `🎉 Harika! <b>%${skor}</b> doğruluk. "${item.tr}" telaffuzun çok iyi!`; }
  else if (skor >= 50) { sinif = "orta"; mesaj = `👍 Fena değil: <b>%${skor}</b>. Bir kez daha dinle ve tekrar dene: "<b>${item.tr}</b>"`; }
  else { sinif = "kotu"; mesaj = `🔄 <b>%${skor}</b> — olmadı ama sorun yok! 🐢 tuşuyla yavaş dinle, sonra tekrar söyle: "<b>${item.tr}</b>"`; }
  alan.innerHTML = `<div class="telaffuz-sonuc ${sinif}">${mesaj}</div>`;
}

function dersAc(dersId) {
  const ders = tumDersler().find(d => d.id === dersId);
  if (!ders) return;
  $("#dersSecimi").value = dersId;
  const icerik = $("#dersIcerik");
  icerik.innerHTML = `
    <div class="card">
      <h2>${ders.baslik}</h2>
      <p class="ipucu">🔊 dinle, 🐢 yavaş dinle, 🎤 kendin söyle ve telaffuzunu test et.</p>
      ${ders.items.map((it, i) => kelimeKartiHTML(it, "d" + i)).join("")}
      <button class="btn primary" id="dersiBitirBtn" style="margin-top:12px;width:100%">
        ${S.bitenDersler[dersId] ? "✅ Bu dersi bitirdin — tekrar işaretle" : "Dersi Bitir ✓"}
      </button>
    </div>`;
  ders.items.forEach((it, i) => kelimeKartiBagla(icerik, it, "d" + i));
  $("#dersiBitirBtn").onclick = () => {
    if (!S.bitenDersler[dersId]) {
      S.bitenDersler[dersId] = true;
      kaydet();
      hedefTamamla("ders");
      xpEkle(15, "Yeni ders bitti");
      dersSecicileriDoldur();
      toast("🎉 Ders tamamlandı!");
    } else {
      hedefTamamla("ders");
    }
    dersAc(dersId);
  };
}

$("#dersSecimi") && document.addEventListener("change", (e) => {
  if (e.target.id === "dersSecimi") dersAc(e.target.value);
});

// ===================== QUIZ =====================
let quiz = null;

function quizBaslat(tur) {
  const secim = $("#quizDersSecimi").value;
  let havuz;
  if (secim === "__hepsi__") havuz = tumDersler().flatMap(d => d.items);
  else havuz = tumDersler().find(d => d.id === secim).items;
  const sorular = karistir(havuz).slice(0, Math.min(8, havuz.length));
  quiz = { tur, sorular, indeks: 0, dogru: 0, havuz };
  $("#quizBaslangic").classList.add("hidden");
  $("#quizAlani").classList.remove("hidden");
  quizSoruGoster();
}

function quizSoruGoster() {
  const q = quiz.sorular[quiz.indeks];
  const yanlislar = karistir(quiz.havuz.filter(x => x.anlam !== q.anlam)).slice(0, 3);
  const secenekler = karistir([q, ...yanlislar]);
  const alan = $("#quizAlani");
  alan.innerHTML = `
    <div class="quiz-ilerleme">Soru ${quiz.indeks + 1} / ${quiz.sorular.length} — Doğru: ${quiz.dogru}</div>
    <div class="card">
      ${quiz.tur === "dinleme"
        ? `<div style="text-align:center"><button class="btn ses" id="quizSes" style="font-size:1.6rem;padding:16px 28px">🔊 Dinle</button></div>
           <p class="ipucu" style="text-align:center">Sesi dinle — anlamı hangisi?</p>`
        : `<div class="quiz-soru">${q.tr}</div>
           <p class="ipucu" style="text-align:center">Bu ifadenin anlamı hangisi?</p>`}
      <div class="quiz-secenekler">
        ${secenekler.map((s, i) => `<button class="quiz-secenek" data-i="${i}">${s.anlam}</button>`).join("")}
      </div>
    </div>`;
  if (quiz.tur === "dinleme") {
    $("#quizSes").onclick = () => seslendir(q.ar);
    seslendir(q.ar);
  }
  alan.querySelectorAll(".quiz-secenek").forEach((btn, i) => {
    btn.onclick = () => {
      const secilen = secenekler[i];
      const dogruMu = secilen.anlam === q.anlam;
      alan.querySelectorAll(".quiz-secenek").forEach((b, j) => {
        b.disabled = true;
        if (secenekler[j].anlam === q.anlam) b.classList.add("dogru");
      });
      if (dogruMu) { quiz.dogru++; btn.classList.add("dogru"); }
      else btn.classList.add("yanlis");
      if (quiz.tur !== "dinleme") seslendir(q.ar);
      setTimeout(() => {
        quiz.indeks++;
        if (quiz.indeks < quiz.sorular.length) quizSoruGoster();
        else quizBitir();
      }, 1300);
    };
  });
}

function quizBitir() {
  const yuzde = Math.round((quiz.dogru / quiz.sorular.length) * 100);
  $("#quizAlani").innerHTML = `
    <div class="card" style="text-align:center">
      <div class="skor-genis">${yuzde >= 80 ? "🏆" : yuzde >= 60 ? "🎉" : "💪"} %${yuzde}</div>
      <p>${quiz.dogru} / ${quiz.sorular.length} doğru</p>
      <p>${yuzde >= 80 ? "Mumteez! (Mükemmel!)" : yuzde >= 60 ? "Kuveyyis! (İyi!)" : "Tekrar dene — meeşi? (tamam mı?)"}</p>
      <button class="btn primary" id="quizTekrar">Yeni Quiz</button>
    </div>`;
  if (yuzde >= 60) hedefTamamla("quiz");
  xpEkle(Math.round(yuzde / 10), "Quiz skoru");
  $("#quizTekrar").onclick = () => {
    $("#quizAlani").classList.add("hidden");
    $("#quizBaslangic").classList.remove("hidden");
  };
}

$("#quizBaslatAnlam").onclick = () => quizBaslat("anlam");
$("#quizBaslatDinleme").onclick = () => quizBaslat("dinleme");

// ===================== KONUŞMA PANELİ =====================
function konusmaCiz() {
  const dersId = $("#konusmaDersSecimi").value;
  const ders = tumDersler().find(d => d.id === dersId);
  if (!ders) return;
  const alan = $("#konusmaAlani");
  alan.innerHTML = `<div class="card">${ders.items.map((it, i) => kelimeKartiHTML(it, "k" + i)).join("")}</div>`;
  ders.items.forEach((it, i) => kelimeKartiBagla(alan, it, "k" + i));
}
document.addEventListener("change", (e) => {
  if (e.target.id === "konusmaDersSecimi") konusmaCiz();
});

// ===================== ÇEVİRMEN =====================
let ceviriYonu = "tr-ar";

$("#yonTrAr").onclick = () => { ceviriYonu = "tr-ar"; yonGuncelle(); };
$("#yonArTr").onclick = () => { ceviriYonu = "ar-tr"; yonGuncelle(); };
function yonGuncelle() {
  $("#yonTrAr").classList.toggle("active", ceviriYonu === "tr-ar");
  $("#yonArTr").classList.toggle("active", ceviriYonu === "ar-tr");
  $("#ceviriGirdi").placeholder = ceviriYonu === "tr-ar"
    ? "Çevrilecek Türkçe metni yaz... ya da mikrofonla söyle 🎤"
    : "Arapça söyle 🎤 (ya da Arapça yaz)";
}

$("#ceviriMic").onclick = () => {
  const btn = $("#ceviriMic");
  btn.classList.add("dinliyor");
  btn.textContent = "👂 Dinliyorum...";
  dinle(ceviriYonu === "tr-ar" ? "tr-TR" : "ar-EG", (alternatifler) => {
    $("#ceviriGirdi").value = alternatifler[0];
    ceviriYap();
  }, () => {
    btn.classList.remove("dinliyor");
    btn.textContent = "🎤 Sesle Söyle";
  });
};

async function ceviriYap() {
  const metin = $("#ceviriGirdi").value.trim();
  if (!metin) { toast("Önce bir metin yaz ya da söyle."); return; }
  const [kaynak, hedefDil] = ceviriYonu === "tr-ar" ? ["tr", "ar"] : ["ar", "tr"];
  $("#ceviriYap").textContent = "Çevriliyor...";
  $("#ceviriYap").disabled = true;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(metin)}&langpair=${kaynak}|${hedefDil}`;
    const res = await fetch(url);
    const data = await res.json();
    const ceviri = data.responseData && data.responseData.translatedText;
    if (!ceviri) throw new Error("boş");
    sonCeviri = { metin: ceviri, dil: hedefDil };
    $("#ceviriSonuc").classList.remove("hidden");
    if (hedefDil === "ar") {
      $("#ceviriMetin").textContent = arapcaOkunus(ceviri) || ceviri;
      $("#ceviriOkunus").innerHTML = `<small class="ipucu">Türkçe okunuş (yaklaşık — sesli versiyonu mutlaka dinle)</small>`;
      $("#ceviriArapca").textContent = ceviri;
    } else {
      $("#ceviriMetin").textContent = ceviri;
      $("#ceviriOkunus").textContent = "";
      $("#ceviriArapca").textContent = "";
    }
  } catch (e) {
    toast("⚠️ Çeviri yapılamadı. İnternet bağlantını kontrol et.");
  } finally {
    $("#ceviriYap").textContent = "Çevir";
    $("#ceviriYap").disabled = false;
  }
}
let sonCeviri = null;
$("#ceviriYap").onclick = ceviriYap;
$("#ceviriDinle").onclick = () => {
  if (!sonCeviri) return;
  if (sonCeviri.dil === "ar") seslendir(sonCeviri.metin);
  else turkceSeslendir(sonCeviri.metin);
};

// ===================== AJANDA =====================
function ajandayiCiz() {
  const liste = $("#ajandaListesi");
  let toplamDers = 0, bitenSayisi = 0;
  liste.innerHTML = CURRICULUM.map(hafta => {
    if (hafta.tekrar) {
      return `<div class="card hafta-kart">
        <div class="hafta-baslik"><h3>Hafta ${hafta.hafta}: ${hafta.baslik}</h3><span>🔁</span></div>
        <p class="ipucu">${hafta.aciklama}</p>
      </div>`;
    }
    const biten = hafta.dersler.filter(d => S.bitenDersler[d.id]).length;
    toplamDers += hafta.dersler.length;
    bitenSayisi += biten;
    const yuzde = Math.round((biten / hafta.dersler.length) * 100);
    return `<div class="card hafta-kart">
      <div class="hafta-baslik">
        <h3>Hafta ${hafta.hafta}: ${hafta.baslik}</h3>
        <span class="hafta-yuzde">%${yuzde}</span>
      </div>
      ${hafta.dersler.map(d => `
        <div class="ders-satir">
          <span><span class="durum">${S.bitenDersler[d.id] ? "✅" : "⬜"}</span> Gün ${d.gun}: ${d.baslik}</span>
          <button class="btn" data-ders="${d.id}">Aç</button>
        </div>`).join("")}
    </div>`;
  }).join("");

  liste.querySelectorAll("[data-ders]").forEach(btn => {
    btn.onclick = () => { dersAc(btn.dataset.ders); sekmeyeGit("ders"); };
  });

  const genelYuzde = toplamDers ? Math.round((bitenSayisi / toplamDers) * 100) : 0;
  $("#genelBar").style.width = genelYuzde + "%";
  $("#genelYuzde").textContent = "%" + genelYuzde;

  rozetleriCiz();
}

// ===================== ROZETLER =====================
const ROZETLER = [
  { id: "ilkders", ikon: "🌱", ad: "İlk Ders", kontrol: () => Object.keys(S.bitenDersler).length >= 1 },
  { id: "hafta1", ikon: "🥉", ad: "Hafta 1 Bitti", kontrol: () => CURRICULUM[0].dersler.every(d => S.bitenDersler[d.id]) },
  { id: "hafta2", ikon: "🥈", ad: "Hafta 2 Bitti", kontrol: () => CURRICULUM[1].dersler.every(d => S.bitenDersler[d.id]) },
  { id: "tumders", ikon: "🥇", ad: "Tüm Dersler", kontrol: () => tumDersler().every(d => S.bitenDersler[d.id]) },
  { id: "seri3", ikon: "🔥", ad: "3 Gün Seri", kontrol: () => S.seri >= 3 },
  { id: "seri7", ikon: "⚡", ad: "7 Gün Seri", kontrol: () => S.seri >= 7 },
  { id: "xp100", ikon: "⭐", ad: "100 XP", kontrol: () => S.xp >= 100 },
  { id: "xp500", ikon: "🌟", ad: "500 XP", kontrol: () => S.xp >= 500 },
  { id: "xp1000", ikon: "👑", ad: "1000 XP", kontrol: () => S.xp >= 1000 }
];

function rozetKontrol() {
  for (const r of ROZETLER) {
    if (!S.rozetler[r.id] && r.kontrol()) {
      S.rozetler[r.id] = true;
      kaydet();
      toast(`🏅 Yeni rozet: ${r.ikon} ${r.ad}!`, 3000);
    }
  }
}

function rozetleriCiz() {
  rozetKontrol();
  $("#rozetler").innerHTML = ROZETLER.map(r => `
    <div class="rozet ${S.rozetler[r.id] ? "" : "kilitli"}">
      <div class="ikon">${r.ikon}</div>
      <div class="ad">${r.ad}</div>
    </div>`).join("");
}

// ===================== AYARLAR =====================
const dlg = $("#settingsDialog");
$("#settingsBtn").onclick = () => {
  $("#ayarArapca").checked = S.arapcaGoster;
  $("#ayarHiz").value = S.hiz;
  sesleriYukle();
  dlg.showModal();
};
$("#ayarKapat").onclick = () => dlg.close();
$("#ayarArapca").onchange = (e) => {
  S.arapcaGoster = e.target.checked;
  kaydet();
  arapcaGorunum();
};
$("#ayarHiz").onchange = (e) => { S.hiz = parseFloat(e.target.value); kaydet(); };
$("#ayarSes").onchange = (e) => { S.sesURI = e.target.value; kaydet(); };
$("#ayarSifirla").onclick = () => {
  if (confirm("Tüm ilerlemen (XP, seri, biten dersler) silinecek. Emin misin?")) {
    localStorage.removeItem("misirca");
    location.reload();
  }
};

function arapcaGorunum() {
  document.body.classList.toggle("arapca-acik", S.arapcaGoster);
}

function ustBilgiGuncelle() {
  $("#streakBadge").textContent = "🔥 " + S.seri;
  $("#xpBadge").textContent = "⭐ " + S.xp + " XP";
}

// ===================== BAŞLAT =====================
function baslat() {
  gunlukHedefHazirla();
  arapcaGorunum();
  ustBilgiGuncelle();
  dersSecicileriDoldur();
  bugunuCiz();
  dersAc(gununDersi().id);
  konusmaCiz();
  yonGuncelle();
  sesleriYukle();
}
baslat();
