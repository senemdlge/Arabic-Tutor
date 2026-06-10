/* Saudi Survival App — Egyptian Arabic Tutor */
"use strict";

// ===================== DURUM (STATE) =====================
const VARSAYILAN = {
  xp: 0,
  seri: 0,
  sonGun: null,
  bitenDersler: {},
  gunlukHedef: {},
  rozetler: {},
  srs: {},               // kelime -> { due, aralik, item }
  stats: { quiz: 0, konusma: 0, dinleme: 0, diyalog: 0, ceviri: 0 },
  bitenDiyaloglar: {},
  arapcaGoster: false,
  karanlik: false,
  hiz: 0.8,
  sesURI: null
};

let S = yukle();

function yukle() {
  try {
    const raw = localStorage.getItem("misirca");
    if (raw) {
      const d = JSON.parse(raw);
      return Object.assign({}, VARSAYILAN, d, { stats: Object.assign({}, VARSAYILAN.stats, d.stats) });
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(VARSAYILAN));
}
function kaydet() { localStorage.setItem("misirca", JSON.stringify(S)); }

function bugunStr() { return new Date().toISOString().slice(0, 10); }
function gunNo() { return Math.floor(Date.now() / 86400000); }

function gunlukHedefHazirla() {
  if (S.gunlukHedef.tarih !== bugunStr()) {
    const dun = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (S.sonGun !== bugunStr() && S.sonGun !== dun) S.seri = 0;
    S.gunlukHedef = { tarih: bugunStr(), ders: false, quiz: false, konusma: 0, dinleme: 0, tamamlandi: false };
    kaydet();
  }
}

function xpEkle(miktar, sebep) {
  const onceki = seviyeBul(S.xp);
  S.xp += miktar;
  kaydet();
  ustBilgiGuncelle();
  toast(`+${miktar} XP — ${sebep} ⭐`);
  const sonra = seviyeBul(S.xp);
  if (sonra.ad !== onceki.ad) {
    konfetiAt();
    toast(`${sonra.ikon} SEVİYE ATLADIN: ${sonra.ad}!`, 3500);
  }
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
  if (!h.tamamlandi && h.ders && h.quiz && h.konusma >= 3 && h.dinleme >= 10) {
    h.tamamlandi = true;
    if (S.sonGun !== bugunStr()) { S.seri++; S.sonGun = bugunStr(); }
    xpEkle(25, "Günlük hedefler tamamlandı! 🔥");
    konfetiAt();
  }
  kaydet();
  if ($("#panel-bugun").classList.contains("active")) bugunuCiz();
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

function titret(desen) { if (navigator.vibrate) navigator.vibrate(desen); }

function konfetiAt() {
  const kap = $("#konfeti");
  const semboller = ["🎉", "⭐", "✨", "🎊", "💚", "🏆"];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.className = "konfeti-parca";
    p.textContent = semboller[Math.floor(Math.random() * semboller.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDelay = Math.random() * 0.6 + "s";
    p.style.fontSize = (1 + Math.random()) + "rem";
    kap.appendChild(p);
    setTimeout(() => p.remove(), 3400);
  }
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

function seviyeBul(xp) {
  let s = SEVIYELER[0];
  for (const lv of SEVIYELER) if (xp >= lv.xp) s = lv;
  return s;
}
function sonrakiSeviye(xp) {
  return SEVIYELER.find(lv => lv.xp > xp) || null;
}

// ===================== SES (TTS) =====================
let sesler = [];
function sesleriYukle() {
  sesler = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("ar"));
  const sel = $("#ayarSes");
  sel.innerHTML = "";
  if (!sesler.length) {
    sel.innerHTML = "<option>Arapça ses bulunamadı — cihaz diline Arapça TTS ekleyin</option>";
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

function seslendir(arapca) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(arapca);
  u.lang = "ar-EG";
  u.rate = S.hiz;
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

// Tek aktif tanıma; durum mesajları hedef elemana yazılır
function dinle({ dil, durumEl, sonuc, bitti }) {
  if (!SpeechRec) {
    if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">⚠️ Bu tarayıcı sesli tanımayı desteklemiyor.<br>📱 Android'de <b>Chrome</b>, iPhone'da <b>Safari</b> kullan. iPhone'da Ayarlar → Siri'den dikte açık olmalı.</div>`;
    if (bitti) bitti();
    return;
  }
  let sonucGeldi = false;
  const r = new SpeechRec();
  r.lang = dil;
  r.interimResults = false;
  r.maxAlternatives = 5;

  if (durumEl) durumEl.innerHTML = `<div class="dinleme-durum">👂 Dinliyorum... şimdi konuş!</div>`;

  const guvenlik = setTimeout(() => { try { r.stop(); } catch (e) {} }, 8000);

  r.onresult = (e) => {
    sonucGeldi = true;
    clearTimeout(guvenlik);
    const alternatifler = [];
    for (let i = 0; i < e.results[0].length; i++) alternatifler.push(e.results[0][i].transcript);
    sonuc(alternatifler);
  };
  r.onerror = (e) => {
    sonucGeldi = true;
    clearTimeout(guvenlik);
    let msg = "Tanıma hatası: " + e.error;
    if (e.error === "not-allowed" || e.error === "service-not-allowed")
      msg = "🎙️ Mikrofon izni gerekli. Tarayıcı adres çubuğundaki kilit simgesinden mikrofona izin ver.";
    if (e.error === "no-speech") msg = "🤫 Ses duyamadım. Mikrofona biraz daha yakın ve yüksek sesle konuş.";
    if (e.error === "network") msg = "📡 Ağ hatası — ses tanıma için internet gerekiyor.";
    if (e.error === "language-not-supported") msg = "Bu cihaz Arapça tanımayı desteklemiyor. Google uygulamasından Arapça dil paketi ekleyebilirsin.";
    if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">${msg}</div>`;
  };
  r.onend = () => {
    clearTimeout(guvenlik);
    if (!sonucGeldi && durumEl && durumEl.querySelector(".dinleme-durum"))
      durumEl.innerHTML = `<div class="telaffuz-sonuc orta">🤔 Bir şey duyamadım. Mikrofon tuşuna bas, "dinliyorum" yazısını görünce konuş.</div>`;
    if (bitti) bitti();
  };
  try { r.start(); } catch (e) {
    if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">Mikrofon başlatılamadı, sayfayı yenileyip tekrar dene.</div>`;
    if (bitti) bitti();
  }
}

function arapcaNormalize(s) {
  return s
    .replace(/[ً-ْٰ]/g, "")
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
  "ه": "h", "ة": "a", "و": "v", "ي": "y", "ى": "a", "ء": "'", "ئ": "'", "ؤ": "'"
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

// ===================== SRS (Akıllı Tekrar) =====================
function srsKaydet(item, dogruMu) {
  const key = item.tr;
  const mevcut = S.srs[key];
  if (!dogruMu) {
    S.srs[key] = { due: gunNo() + 1, aralik: 1, item: { ar: item.ar, tr: item.tr, anlam: item.anlam } };
  } else if (mevcut) {
    const yeniAralik = mevcut.aralik * 2;
    if (yeniAralik > 16) delete S.srs[key];
    else S.srs[key] = { ...mevcut, aralik: yeniAralik, due: gunNo() + yeniAralik };
  }
  kaydet();
}

function srsBekleyenler() {
  return Object.values(S.srs).filter(k => k.due <= gunNo());
}

// ===================== SEKMELER =====================
$$(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach(b => b.classList.remove("active"));
    $$(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    $("#panel-" + btn.dataset.tab).classList.add("active");
    speechSynthesis.cancel();
    if (btn.dataset.tab === "ajanda") ajandayiCiz();
    if (btn.dataset.tab === "bugun") bugunuCiz();
    window.scrollTo(0, 0);
  });
});

function sekmeyeGit(ad) { $(`.tab[data-tab="${ad}"]`).click(); }

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

  // Seviye kartı
  const sv = seviyeBul(S.xp), sonraki = sonrakiSeviye(S.xp);
  const yuzde = sonraki ? Math.round(((S.xp - sv.xp) / (sonraki.xp - sv.xp)) * 100) : 100;
  $("#seviyeKarti").innerHTML = `
    <div class="buyuk-ikon">${sv.ikon}</div>
    <div style="flex:1">
      <b>${sv.ad}</b>
      <div class="seviye-bar"><div style="width:${yuzde}%"></div></div>
      <small class="ipucu">${sonraki ? `${sonraki.ad} seviyesine ${sonraki.xp - S.xp} XP kaldı` : "En üst seviyedesin! 👑"}</small>
    </div>`;

  const ders = gununDersi();
  const bitti = S.bitenDersler[ders.id];
  $("#gununDersiCard").innerHTML = `
    <div class="ceviri-etiket">Günün Dersi — Hafta ${ders.hafta}</div>
    <div class="okunus" style="font-size:1.1rem">${ders.baslik} ${bitti ? "✅" : ""}</div>
    <button class="btn primary" id="derseGitBtn" style="margin-top:8px">${bitti ? "Tekrar Et" : "Derse Başla"} →</button>`;
  $("#derseGitBtn").onclick = () => { dersAc(ders.id); sekmeyeGit("ders"); };

  const h = S.gunlukHedef;
  const durumlar = { ders: h.ders, quiz: h.quiz, konusma: h.konusma >= 3, dinleme: h.dinleme >= 10 };
  const ilerlemeYazi = { konusma: `${Math.min(h.konusma, 3)}/3`, dinleme: `${Math.min(h.dinleme, 10)}/10` };
  $("#hedefListesi").innerHTML = GUNLUK_HEDEFLER.map(g => `
    <li class="${durumlar[g.id] ? "tamam" : ""}">
      <span>${durumlar[g.id] ? "✅" : "⬜"} ${g.baslik} ${ilerlemeYazi[g.id] ? `<small>(${ilerlemeYazi[g.id]})</small>` : ""}</span>
      <span class="xp">+${g.xp} XP</span>
    </li>`).join("");

  $("#gunTamamMsg").classList.toggle("hidden", !h.tamamlandi);

  const hepsi = tumDersler().flatMap(d => d.items);
  const k = hepsi[gunNo() % hepsi.length];
  $("#gununKelimesi").innerHTML = kelimeKartiHTML(k, "gk");
  kelimeKartiBagla($("#gununKelimesi"), k, "gk");

  // SRS özeti
  const bekleyen = srsBekleyenler().length;
  $("#srsOzet").innerHTML = bekleyen
    ? `<b>${bekleyen} kelime</b> tekrar bekliyor — zorlandığın kelimeleri unutma!<br>
       <button class="btn primary" id="srsGit" style="margin-top:8px">🃏 Tekrara Başla</button>`
    : `✨ Bekleyen tekrar yok. Quiz çözdükçe zorlandığın kelimeler buraya düşer.`;
  if (bekleyen) $("#srsGit").onclick = () => { sekmeyeGit("pratik"); flashcardBaslat(); };
}

// ===================== DERS PANELİ =====================
function dersSecicileriDoldur() {
  const dersler = tumDersler();
  const html = dersler.map(d =>
    `<option value="${d.id}">H${d.hafta} — ${d.baslik} ${S.bitenDersler[d.id] ? "✅" : ""}</option>`
  ).join("");
  $("#dersSecimi").innerHTML = html;
  $("#quizDersSecimi").innerHTML = `<option value="__hepsi__">🌟 Tüm Dersler (karışık)</option>` + html;
  $("#konusmaDersSecimi").innerHTML = html;
}

function kelimeKartiHTML(item, key) {
  return `
    <div class="kelime-kart">
      <div class="kelime-ust">
        <div style="min-width:0">
          <div class="okunus">${item.tr}</div>
          <div class="anlam">${item.anlam}</div>
          <div class="arapca-yazi">${item.ar}</div>
        </div>
        <div class="kelime-btnler">
          <button class="btn ses" data-rol="dinle" data-key="${key}">🔊</button>
          <button class="btn mic" data-rol="soyle" data-key="${key}">🎤</button>
        </div>
      </div>
      <div class="telaffuz-alani" data-key="${key}"></div>
    </div>`;
}

function kelimeKartiBagla(kapsayici, item, key) {
  kapsayici.querySelector(`[data-rol="dinle"][data-key="${key}"]`).onclick = () => {
    seslendir(item.ar);
    S.stats.dinleme++; kaydet();
    hedefTamamla("dinleme");
  };
  const micBtn = kapsayici.querySelector(`[data-rol="soyle"][data-key="${key}"]`);
  const alan = kapsayici.querySelector(`.telaffuz-alani[data-key="${key}"]`);
  micBtn.onclick = () => {
    micBtn.classList.add("dinliyor");
    micBtn.textContent = "👂";
    dinle({
      dil: "ar-EG",
      durumEl: alan,
      sonuc: (alternatifler) => {
        const skor = benzerlik(item.ar, alternatifler);
        telaffuzSonucuGoster(alan, skor, item, alternatifler[0]);
        S.stats.konusma++; kaydet();
        srsKaydet(item, skor >= 60);
        if (skor >= 60) { hedefTamamla("konusma"); titret(40); }
        else titret([60, 40, 60]);
      },
      bitti: () => { micBtn.classList.remove("dinliyor"); micBtn.textContent = "🎤"; }
    });
  };
}

function telaffuzSonucuGoster(alan, skor, item, duyulan) {
  let sinif, mesaj;
  if (skor >= 75) { sinif = "iyi"; mesaj = `🎉 Harika! <b>%${skor}</b> doğruluk — "${item.tr}" telaffuzun çok iyi!`; }
  else if (skor >= 50) { sinif = "orta"; mesaj = `👍 Fena değil: <b>%${skor}</b>. 🔊 ile bir kez daha dinle ve tekrar dene: "<b>${item.tr}</b>"`; }
  else { sinif = "kotu"; mesaj = `🔄 <b>%${skor}</b> — olmadı ama sorun değil! 🔊 ile dinle, sonra tekrar söyle: "<b>${item.tr}</b>"`; }
  const okunan = duyulan ? `<div class="duyulan">Duyduğum: "${arapcaOkunus(duyulan) || duyulan}"</div>` : "";
  alan.innerHTML = `<div class="telaffuz-sonuc ${sinif}">${mesaj}${okunan}</div>`;
}

function dersAc(dersId) {
  const ders = tumDersler().find(d => d.id === dersId);
  if (!ders) return;
  $("#dersSecimi").value = dersId;
  const icerik = $("#dersIcerik");
  icerik.innerHTML = `
    <div class="card">
      <h2>${ders.baslik}</h2>
      <p class="ipucu">🔊 dinle, 🎤 kendin söyle ve telaffuzunu test et.</p>
      ${ders.items.map((it, i) => kelimeKartiHTML(it, "d" + i)).join("")}
      <button class="btn primary" id="dersiBitirBtn" style="margin-top:12px;width:100%">
        ${S.bitenDersler[dersId] ? "✅ Bu dersi bitirdin" : "Dersi Bitir ✓"}
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
      konfetiAt();
      dersAc(dersId);
    } else {
      hedefTamamla("ders");
      toast("Bu ders zaten tamam — tekrar etmek süper! 💪");
    }
  };
}

document.addEventListener("change", (e) => {
  if (e.target.id === "dersSecimi") dersAc(e.target.value);
  if (e.target.id === "konusmaDersSecimi") konusmaCiz();
});

// ===================== QUIZ =====================
let quiz = null;

function quizHavuzu() {
  const secim = $("#quizDersSecimi").value;
  if (secim === "__hepsi__") return tumDersler().flatMap(d => d.items);
  return tumDersler().find(d => d.id === secim).items;
}

function quizBaslat(tur) {
  const havuz = quizHavuzu();
  const sorular = karistir(havuz).slice(0, Math.min(8, havuz.length));
  quiz = { tur, sorular, indeks: 0, dogru: 0, havuz };
  $("#pratikMenu").classList.add("hidden");
  $("#quizAlani").classList.remove("hidden");
  quizSoruGoster();
}

function quizSoruGoster() {
  const q = quiz.sorular[quiz.indeks];
  const yanlislar = karistir(quiz.havuz.filter(x => x.anlam !== q.anlam)).slice(0, 3);
  const secenekler = karistir([q, ...yanlislar]);
  const alan = $("#quizAlani");
  alan.innerHTML = `
    <button class="btn geri" data-geri="pratik">← Çık</button>
    <div class="quiz-ilerleme">Soru ${quiz.indeks + 1} / ${quiz.sorular.length} — Doğru: ${quiz.dogru}</div>
    <div class="card">
      ${quiz.tur === "dinleme"
        ? `<div style="text-align:center"><button class="btn ses" id="quizSes" style="font-size:1.5rem;padding:14px 26px">🔊 Dinle</button></div>
           <p class="ipucu" style="text-align:center">Sesi dinle — anlamı hangisi?</p>`
        : `<div class="quiz-soru">${q.tr}</div>
           <p class="ipucu" style="text-align:center">Bu ifadenin anlamı hangisi?</p>`}
      <div class="quiz-secenekler">
        ${secenekler.map((s, i) => `<button class="quiz-secenek" data-i="${i}">${s.anlam}</button>`).join("")}
      </div>
    </div>`;
  geriButonlariBagla();
  if (quiz.tur === "dinleme") {
    $("#quizSes").onclick = () => seslendir(q.ar);
    seslendir(q.ar);
  }
  alan.querySelectorAll(".quiz-secenek").forEach((btn, i) => {
    btn.onclick = () => {
      const dogruMu = secenekler[i].anlam === q.anlam;
      alan.querySelectorAll(".quiz-secenek").forEach((b, j) => {
        b.disabled = true;
        if (secenekler[j].anlam === q.anlam) b.classList.add("dogru");
      });
      if (dogruMu) { quiz.dogru++; btn.classList.add("dogru"); titret(40); }
      else { btn.classList.add("yanlis"); titret([60, 40, 60]); }
      srsKaydet(q, dogruMu);
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
  S.stats.quiz++; kaydet();
  $("#quizAlani").innerHTML = `
    <div class="card" style="text-align:center">
      <div class="skor-genis">${yuzde >= 80 ? "🏆" : yuzde >= 60 ? "🎉" : "💪"} %${yuzde}</div>
      <p>${quiz.dogru} / ${quiz.sorular.length} doğru</p>
      <p>${yuzde >= 80 ? "Mumteez! (Mükemmel!)" : yuzde >= 60 ? "Kuveyyis! (İyi!)" : "Tekrar dene — meeşi? (tamam mı?)"}</p>
      <button class="btn primary" data-geri="pratik">Pratik Menüsü</button>
    </div>`;
  geriButonlariBagla();
  if (yuzde >= 60) hedefTamamla("quiz");
  if (yuzde >= 80) konfetiAt();
  xpEkle(Math.max(2, Math.round(yuzde / 10)), "Quiz skoru");
}

// ===================== EŞLEŞTİRME OYUNU =====================
function eslestirmeBaslat() {
  const havuz = karistir(quizHavuzu()).slice(0, 6);
  const kartlar = karistir([
    ...havuz.map(it => ({ tip: "tr", deger: it.tr, es: it.anlam, ar: it.ar })),
    ...havuz.map(it => ({ tip: "anlam", deger: it.anlam, es: it.tr }))
  ]);
  $("#pratikMenu").classList.add("hidden");
  const alan = $("#eslestirmeAlani");
  alan.classList.remove("hidden");
  let secili = null, kalan = havuz.length;
  const baslangic = Date.now();
  alan.innerHTML = `
    <button class="btn geri" data-geri="pratik">← Çık</button>
    <p class="ipucu" style="text-align:center">Okunuş ile anlamı eşleştir 🧩</p>
    <div class="esl-izgara">
      ${kartlar.map((k, i) => `<button class="esl-kart" data-i="${i}">${k.deger}</button>`).join("")}
    </div>`;
  geriButonlariBagla();
  alan.querySelectorAll(".esl-kart").forEach((el, i) => {
    el.onclick = () => {
      const k = kartlar[i];
      if (el.classList.contains("eslesti")) return;
      if (secili === null) {
        alan.querySelectorAll(".esl-kart").forEach(x => x.classList.remove("secili"));
        el.classList.add("secili");
        secili = { el, k };
        if (k.tip === "tr") seslendir(k.ar);
        return;
      }
      if (secili.el === el) { el.classList.remove("secili"); secili = null; return; }
      const eslesti = (secili.k.tip !== k.tip) &&
        (secili.k.es === k.deger || k.es === secili.k.deger);
      if (eslesti) {
        el.classList.add("eslesti");
        secili.el.classList.add("eslesti");
        secili.el.classList.remove("secili");
        titret(40);
        kalan--;
        if (kalan === 0) {
          const sn = Math.round((Date.now() - baslangic) / 1000);
          setTimeout(() => {
            alan.innerHTML = `
              <div class="card" style="text-align:center">
                <div class="skor-genis">🧩⚡</div>
                <p>Hepsini <b>${sn} saniyede</b> eşleştirdin!</p>
                <button class="btn primary" data-geri="pratik">Pratik Menüsü</button>
              </div>`;
            geriButonlariBagla();
            hedefTamamla("quiz");
            xpEkle(10, "Eşleştirme bitti");
            konfetiAt();
          }, 400);
        }
      } else {
        el.classList.add("hata");
        secili.el.classList.add("hata");
        titret([60, 40, 60]);
        const onceki = secili.el;
        setTimeout(() => { el.classList.remove("hata"); onceki.classList.remove("hata", "secili"); }, 400);
      }
      secili = null;
    };
  });
}

// ===================== FLASHCARD (SRS) =====================
let fdeste = null;

function flashcardBaslat() {
  let kartlar = srsBekleyenler().map(x => x.item);
  let srsModu = true;
  if (!kartlar.length) {
    kartlar = karistir(tumDersler().flatMap(d => d.items)).slice(0, 10);
    srsModu = false;
  }
  fdeste = { kartlar: karistir(kartlar), indeks: 0, srsModu };
  $("#pratikMenu").classList.add("hidden");
  $("#flashcardAlani").classList.remove("hidden");
  flashcardGoster();
}

function flashcardGoster() {
  const alan = $("#flashcardAlani");
  if (fdeste.indeks >= fdeste.kartlar.length) {
    alan.innerHTML = `
      <div class="card" style="text-align:center">
        <div class="skor-genis">🃏✅</div>
        <p>Tekrar bitti! ${fdeste.kartlar.length} kart gözden geçirdin.</p>
        <button class="btn primary" data-geri="pratik">Pratik Menüsü</button>
      </div>`;
    geriButonlariBagla();
    xpEkle(8, "Flashcard tekrarı");
    return;
  }
  const k = fdeste.kartlar[fdeste.indeks];
  alan.innerHTML = `
    <button class="btn geri" data-geri="pratik">← Çık</button>
    <div class="quiz-ilerleme">${fdeste.indeks + 1} / ${fdeste.kartlar.length} ${fdeste.srsModu ? "— 🧠 akıllı tekrar" : "— rastgele tekrar"}</div>
    <div class="fkart" id="fkart">
      <div class="fkart-ic">
        <div class="fkart-yuz">
          <div class="anlam" style="font-size:1.2rem">${k.anlam}</div>
          <small class="ipucu">Arapçasını hatırla, karta dokun 👆</small>
        </div>
        <div class="fkart-yuz fkart-arka">
          <div class="okunus" style="font-size:1.5rem">${k.tr}</div>
          <div class="arapca-yazi">${k.ar}</div>
          <button class="btn ses" id="fSes">🔊 Dinle</button>
        </div>
      </div>
    </div>
    <div class="fkart-btnler">
      <button class="btn danger" id="fBilemedim">😵 Bilemedim</button>
      <button class="btn primary" id="fBildim">😎 Bildim</button>
    </div>`;
  geriButonlariBagla();
  const fk = $("#fkart");
  fk.onclick = (e) => { if (e.target.id !== "fSes") fk.classList.toggle("acik"); };
  $("#fSes").onclick = (e) => { e.stopPropagation(); seslendir(k.ar); hedefTamamla("dinleme"); };
  $("#fBildim").onclick = () => { srsKaydet(k, true); titret(40); fdeste.indeks++; flashcardGoster(); };
  $("#fBilemedim").onclick = () => { srsKaydet(k, false); fdeste.indeks++; flashcardGoster(); };
}

// ===================== DİYALOG MODU =====================
let dlg = null;

function diyalogMenuGoster() {
  $("#konusmaMenu").classList.add("hidden");
  const alan = $("#diyalogAlani");
  alan.classList.remove("hidden");
  alan.innerHTML = `
    <button class="btn geri" data-geri="konusma">← Geri</button>
    <h3>💬 Sesli Diyalog — uygulamayla konuş!</h3>
    <p class="ipucu">Karşındaki konuşur (sesli), sıra sana gelince repliğini mikrofonla söylersin.</p>
    ${DIYALOGLAR.map(d => `
      <button class="mod-kart" style="width:100%;margin:6px 0" data-dlg="${d.id}">
        <b>${d.baslik} ${S.bitenDiyaloglar[d.id] ? "✅" : ""}</b>
        <small>${d.seviye} • ${d.adimlar.length} replik</small>
      </button>`).join("")}`;
  geriButonlariBagla();
  alan.querySelectorAll("[data-dlg]").forEach(b => {
    b.onclick = () => diyalogBaslat(b.dataset.dlg);
  });
}

function diyalogBaslat(id) {
  const d = DIYALOGLAR.find(x => x.id === id);
  dlg = { d, adim: 0 };
  const alan = $("#diyalogAlani");
  alan.innerHTML = `
    <button class="btn geri" id="dlgGeri">← Diyaloglar</button>
    <h3>${d.baslik}</h3>
    <div id="dlgBalonlar"></div>
    <div id="dlgSira"></div>`;
  $("#dlgGeri").onclick = () => { speechSynthesis.cancel(); diyalogMenuGoster(); };
  diyalogAdim();
}

function diyalogAdim() {
  const { d } = dlg;
  if (dlg.adim >= d.adimlar.length) {
    if (!S.bitenDiyaloglar[d.id]) {
      S.bitenDiyaloglar[d.id] = true;
      S.stats.diyalog++;
      kaydet();
      xpEkle(40, "Diyalog tamamlandı");
    } else {
      xpEkle(10, "Diyalog tekrarı");
    }
    konfetiAt();
    $("#dlgSira").innerHTML = `
      <div class="kutla">🎭 <b>Mumteez!</b> Diyaloğu tamamladın!<br>
      <button class="btn primary" style="margin-top:8px" id="dlgBitti">Diyaloglara Dön</button></div>`;
    $("#dlgBitti").onclick = () => diyalogMenuGoster();
    rozetKontrol();
    return;
  }
  const adim = d.adimlar[dlg.adim];
  if (adim.rol === "app") {
    balonEkle(adim);
    seslendir(adim.ar);
    dlg.adim++;
    setTimeout(diyalogAdim, 600);
  } else {
    $("#dlgSira").innerHTML = `
      <div class="diyalog-sira">
        <div class="balon-kisi ipucu">🎬 Sıra sende! Şunu söyle:</div>
        <div class="okunus">${adim.tr}</div>
        <div class="anlam">${adim.anlam}</div>
        <div class="kelime-btnler" style="margin-top:8px">
          <button class="btn ses" id="dlgIpucu">🔊 İpucu</button>
          <button class="btn mic" id="dlgMic">🎤 Söyle</button>
          <button class="btn" id="dlgAtla">⏭️ Geç</button>
        </div>
        <div id="dlgDurum"></div>
      </div>`;
    $("#dlgIpucu").onclick = () => seslendir(adim.ar);
    $("#dlgAtla").onclick = () => { balonEkle(adim); dlg.adim++; $("#dlgSira").innerHTML = ""; diyalogAdim(); };
    $("#dlgMic").onclick = () => {
      const mic = $("#dlgMic");
      mic.classList.add("dinliyor");
      dinle({
        dil: "ar-EG",
        durumEl: $("#dlgDurum"),
        sonuc: (alternatifler) => {
          const skor = benzerlik(adim.ar, alternatifler);
          S.stats.konusma++; kaydet();
          if (skor >= 50) {
            titret(40);
            hedefTamamla("konusma");
            balonEkle(adim);
            dlg.adim++;
            $("#dlgSira").innerHTML = "";
            setTimeout(diyalogAdim, 400);
          } else {
            titret([60, 40, 60]);
            $("#dlgDurum").innerHTML = `<div class="telaffuz-sonuc orta">%${skor} — bir daha dene! 🔊 İpucu'ya basıp dinleyebilirsin.<div class="duyulan">Duyduğum: "${arapcaOkunus(alternatifler[0]) || alternatifler[0]}"</div></div>`;
          }
        },
        bitti: () => mic.classList.remove("dinliyor")
      });
    };
  }
}

function balonEkle(adim) {
  const kap = $("#dlgBalonlar");
  const div = document.createElement("div");
  div.className = "diyalog-balon " + adim.rol;
  div.innerHTML = `
    <div class="balon">
      <div class="kisi">${adim.rol === "app" ? adim.kisi : "Sen"}</div>
      <div class="okunus">${adim.tr}</div>
      <div class="anlam">${adim.anlam}</div>
    </div>`;
  div.querySelector(".balon").onclick = () => seslendir(adim.ar);
  kap.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "end" });
}

// ===================== KONUŞMA PANELİ =====================
function konusmaCiz() {
  const dersId = $("#konusmaDersSecimi").value;
  const ders = tumDersler().find(d => d.id === dersId);
  if (!ders) return;
  const alan = $("#konusmaAlani");
  alan.innerHTML = `<div class="card">${ders.items.map((it, i) => kelimeKartiHTML(it, "k" + i)).join("")}</div>`;
  ders.items.forEach((it, i) => kelimeKartiBagla(alan, it, "k" + i));
}

$("#modTelaffuz").onclick = () => {
  $("#konusmaMenu").classList.add("hidden");
  $("#telaffuzAlani").classList.remove("hidden");
  konusmaCiz();
};
$("#modDiyalog").onclick = diyalogMenuGoster;
$("#modAnlam").onclick = () => quizBaslat("anlam");
$("#modDinleme").onclick = () => quizBaslat("dinleme");
$("#modEslestirme").onclick = eslestirmeBaslat;
$("#modFlashcard").onclick = flashcardBaslat;

function geriButonlariBagla() {
  $$("[data-geri]").forEach(b => {
    b.onclick = () => {
      speechSynthesis.cancel();
      const panel = b.dataset.geri;
      if (panel === "pratik") {
        ["#quizAlani", "#eslestirmeAlani", "#flashcardAlani"].forEach(s => $(s).classList.add("hidden"));
        $("#pratikMenu").classList.remove("hidden");
      }
      if (panel === "konusma") {
        ["#telaffuzAlani", "#diyalogAlani"].forEach(s => $(s).classList.add("hidden"));
        $("#konusmaMenu").classList.remove("hidden");
      }
    };
  });
}
geriButonlariBagla();

// ===================== ÇEVİRMEN =====================
let ceviriYonu = "tr-ar";
let sonCeviri = null;

$("#yonTrAr").onclick = () => { ceviriYonu = "tr-ar"; yonGuncelle(); };
$("#yonArTr").onclick = () => { ceviriYonu = "ar-tr"; yonGuncelle(); };
function yonGuncelle() {
  $("#yonTrAr").classList.toggle("active", ceviriYonu === "tr-ar");
  $("#yonArTr").classList.toggle("active", ceviriYonu === "ar-tr");
  $("#ceviriGirdi").placeholder = ceviriYonu === "tr-ar"
    ? "Çevrilecek Türkçe cümleni yaz... ya da 🎤 ile söyle"
    : "Arapça söyle 🎤 (ya da Arapça yaz)";
}

$("#ceviriMic").onclick = () => {
  const btn = $("#ceviriMic");
  btn.classList.add("dinliyor");
  $("#ceviriDurum").classList.remove("hidden");
  dinle({
    dil: ceviriYonu === "tr-ar" ? "tr-TR" : "ar-EG",
    durumEl: $("#ceviriDurum"),
    sonuc: (alternatifler) => {
      $("#ceviriGirdi").value = alternatifler[0];
      $("#ceviriDurum").classList.add("hidden");
      ceviriYap();
    },
    bitti: () => { btn.classList.remove("dinliyor"); }
  });
};

async function ceviriYap() {
  const metin = $("#ceviriGirdi").value.trim();
  if (!metin) { toast("Önce bir cümle yaz ya da söyle."); return; }
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
    S.stats.ceviri++; kaydet();
    $("#ceviriSonuc").classList.remove("hidden");
    $("#ceviriTelaffuz").innerHTML = "";
    if (hedefDil === "ar") {
      $("#ceviriMetin").textContent = arapcaOkunus(ceviri) || ceviri;
      $("#ceviriOkunus").textContent = "Türkçe okunuş (yaklaşık) — 🔊 ile gerçek sesi dinle";
      $("#ceviriArapca").textContent = ceviri;
      seslendir(ceviri);
    } else {
      $("#ceviriMetin").textContent = ceviri;
      $("#ceviriOkunus").textContent = "";
      $("#ceviriArapca").textContent = "";
    }
    $("#ceviriSonuc").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    toast("⚠️ Çeviri yapılamadı. İnternet bağlantını kontrol et.");
  } finally {
    $("#ceviriYap").textContent = "Çevir";
    $("#ceviriYap").disabled = false;
  }
}
$("#ceviriYap").onclick = ceviriYap;
$("#ceviriDinle").onclick = () => {
  if (!sonCeviri) return;
  if (sonCeviri.dil === "ar") seslendir(sonCeviri.metin);
  else turkceSeslendir(sonCeviri.metin);
};
$("#ceviriTekrarla").onclick = () => {
  if (!sonCeviri || sonCeviri.dil !== "ar") { toast("Önce Türkçe→Arapça bir çeviri yap."); return; }
  const btn = $("#ceviriTekrarla");
  btn.classList.add("dinliyor");
  dinle({
    dil: "ar-EG",
    durumEl: $("#ceviriTelaffuz"),
    sonuc: (alternatifler) => {
      const skor = benzerlik(sonCeviri.metin, alternatifler);
      telaffuzSonucuGoster($("#ceviriTelaffuz"), skor,
        { tr: arapcaOkunus(sonCeviri.metin) }, alternatifler[0]);
      if (skor >= 60) hedefTamamla("konusma");
    },
    bitti: () => btn.classList.remove("dinliyor")
  });
};

// ===================== CEP REHBERİ =====================
function rehberiCiz() {
  $("#rehberKategoriler").innerHTML = CEP_REHBERI.map(kat => `
    <div class="rehber-kategori">
      <h3>${kat.kategori}</h3>
      ${kat.ifadeler.map((f, i) => `
        <button class="rehber-ifade" data-kat="${kat.kategori}" data-i="${i}">
          <span>
            <span class="okunus" style="font-size:1rem">${f.tr}</span><br>
            <span class="anlam" style="font-size:.85rem">${f.anlam}</span>
          </span>
          <span class="hoparlor">📢</span>
        </button>`).join("")}
    </div>`).join("");
  $$(".rehber-ifade").forEach(btn => {
    btn.onclick = () => {
      const kat = CEP_REHBERI.find(k => k.kategori === btn.dataset.kat);
      const f = kat.ifadeler[+btn.dataset.i];
      seslendir(f.ar);
      titret(20);
    };
  });
}

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
          <span>${S.bitenDersler[d.id] ? "✅" : "⬜"} ${d.baslik}</span>
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

  $("#istatistikler").innerHTML = `
    <div class="ders-satir"><span>🧠 Çözülen quiz</span><b>${S.stats.quiz}</b></div>
    <div class="ders-satir"><span>🎤 Konuşma denemesi</span><b>${S.stats.konusma}</b></div>
    <div class="ders-satir"><span>👂 Dinlenen kelime</span><b>${S.stats.dinleme}</b></div>
    <div class="ders-satir"><span>💬 Biten diyalog</span><b>${Object.keys(S.bitenDiyaloglar).length}</b></div>
    <div class="ders-satir"><span>🌐 Yapılan çeviri</span><b>${S.stats.ceviri}</b></div>
    <div class="ders-satir"><span>🃏 Tekrar bekleyen kelime</span><b>${srsBekleyenler().length}</b></div>`;

  rozetleriCiz();
}

// ===================== ROZETLER =====================
const ROZETLER = [
  { id: "ilkders", ikon: "🌱", ad: "İlk Ders", kontrol: () => Object.keys(S.bitenDersler).length >= 1 },
  { id: "hafta1", ikon: "🥉", ad: "Hafta 1", kontrol: () => CURRICULUM[0].dersler.every(d => S.bitenDersler[d.id]) },
  { id: "hafta2", ikon: "🥈", ad: "Hafta 2", kontrol: () => CURRICULUM[1].dersler.every(d => S.bitenDersler[d.id]) },
  { id: "tumders", ikon: "🥇", ad: "Tüm Dersler", kontrol: () => tumDersler().every(d => S.bitenDersler[d.id]) },
  { id: "ilkdlg", ikon: "🎭", ad: "İlk Diyalog", kontrol: () => Object.keys(S.bitenDiyaloglar).length >= 1 },
  { id: "tumdlg", ikon: "🗣️", ad: "Konuşkan", kontrol: () => DIYALOGLAR.every(d => S.bitenDiyaloglar[d.id]) },
  { id: "seri3", ikon: "🔥", ad: "3 Gün Seri", kontrol: () => S.seri >= 3 },
  { id: "seri7", ikon: "⚡", ad: "7 Gün Seri", kontrol: () => S.seri >= 7 },
  { id: "xp300", ikon: "⭐", ad: "300 XP", kontrol: () => S.xp >= 300 },
  { id: "xp1000", ikon: "🌟", ad: "1000 XP", kontrol: () => S.xp >= 1000 },
  { id: "xp3000", ikon: "👑", ad: "3000 XP", kontrol: () => S.xp >= 3000 }
];

function rozetKontrol() {
  for (const r of ROZETLER) {
    if (!S.rozetler[r.id] && r.kontrol()) {
      S.rozetler[r.id] = true;
      kaydet();
      toast(`🏅 Yeni rozet: ${r.ikon} ${r.ad}!`, 3000);
      konfetiAt();
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
const ayarDlg = $("#settingsDialog");
$("#settingsBtn").onclick = () => {
  $("#ayarArapca").checked = S.arapcaGoster;
  $("#ayarKaranlik").checked = S.karanlik;
  $("#ayarHiz").value = S.hiz;
  sesleriYukle();
  ayarDlg.showModal();
};
$("#ayarKapat").onclick = () => ayarDlg.close();
$("#ayarArapca").onchange = (e) => { S.arapcaGoster = e.target.checked; kaydet(); gorunumUygula(); };
$("#ayarKaranlik").onchange = (e) => { S.karanlik = e.target.checked; kaydet(); gorunumUygula(); };
$("#ayarHiz").onchange = (e) => { S.hiz = parseFloat(e.target.value); kaydet(); };
$("#ayarSes").onchange = (e) => { S.sesURI = e.target.value; kaydet(); };
$("#ayarSifirla").onclick = () => {
  if (confirm("Tüm ilerlemen (XP, seri, biten dersler) silinecek. Emin misin?")) {
    localStorage.removeItem("misirca");
    location.reload();
  }
};

function gorunumUygula() {
  document.body.classList.toggle("arapca-acik", S.arapcaGoster);
  document.body.classList.toggle("karanlik", S.karanlik);
}

function ustBilgiGuncelle() {
  $("#streakBadge").textContent = "🔥 " + S.seri;
  $("#xpBadge").textContent = "⭐ " + S.xp;
  $("#seviyeBadge").textContent = seviyeBul(S.xp).ikon;
}

// ===================== BAŞLAT =====================
function baslat() {
  gunlukHedefHazirla();
  gorunumUygula();
  ustBilgiGuncelle();
  dersSecicileriDoldur();
  bugunuCiz();
  dersAc(gununDersi().id);
  rehberiCiz();
  yonGuncelle();
  sesleriYukle();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
baslat();
