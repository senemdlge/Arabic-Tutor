/* Saudi Survival App — Egyptian Arabic Tutor (TR/EN) */
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
  dil: "tr",
  hiz: 0.8,
  sesURI: null,
  oaiKey: "",
  iosBanner: true,
  aktivite: {}          // tarih -> o gün kazanılan XP
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

// ===================== ÇOK DİLLİLİK =====================
function t(key) {
  return (UI_METIN[S.dil] && UI_METIN[S.dil][key]) || UI_METIN.tr[key] || key;
}
function tf(key, degerler) {
  let s = t(key);
  for (const k in degerler) s = s.split("{" + k + "}").join(degerler[k]);
  return s;
}
// İçerik çevirisi: Türkçe metin -> seçili dile
function cAl(s) {
  if (S.dil === "en") return EN_SOZLUK[s] || s;
  return s;
}
// Türkçe fonetik -> İngilizce fonetik (ş->sh, v->w...)
const EN_FONETIK = { "ş": "sh", "Ş": "Sh", "ç": "ch", "Ç": "Ch", "ğ": "gh", "Ğ": "Gh", "ı": "i", "I": "I", "İ": "I", "ö": "o", "Ö": "O", "ü": "u", "Ü": "U", "ê": "ei", "v": "w", "V": "W" };
function okunusGoster(tr) {
  if (S.dil !== "en") return tr;
  let out = "";
  for (const ch of tr) out += EN_FONETIK[ch] !== undefined ? EN_FONETIK[ch] : ch;
  return out;
}

function applyI18n() {
  document.documentElement.lang = S.dil;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $("#dilBtn").textContent = S.dil === "tr" ? "EN" : "TR";
  yonGuncelle();
}

// ===================== GÜNLÜK HEDEF / XP =====================
function gunlukHedefHazirla() {
  if (S.gunlukHedef.tarih !== bugunStr()) {
    const dun = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (S.sonGun !== bugunStr() && S.sonGun !== dun) S.seri = 0;
    S.gunlukHedef = { tarih: bugunStr(), ders: false, quiz: false, konusma: 0, dinleme: 0, tamamlandi: false };
    kaydet();
  }
}

function xpEkle(miktar, sebepKey) {
  const onceki = seviyeBul(S.xp);
  S.xp += miktar;
  if (!S.aktivite) S.aktivite = {};
  S.aktivite[bugunStr()] = (S.aktivite[bugunStr()] || 0) + miktar;
  kaydet();
  ustBilgiGuncelle();
  toast(`+${miktar} XP — ${t(sebepKey)} ⭐`);
  const sonra = seviyeBul(S.xp);
  if (sonra.ad !== onceki.ad) {
    konfetiAt();
    toast(`${sonra.ikon} ${t("seviye_atla")}: ${cAl(sonra.ad)}!`, 3500);
  }
  rozetKontrol();
}

function hedefTamamla(id) {
  gunlukHedefHazirla();
  const h = S.gunlukHedef;
  if (id === "ders" && !h.ders) { h.ders = true; xpEkle(30, "xp_ders"); }
  if (id === "quiz" && !h.quiz) { h.quiz = true; xpEkle(20, "xp_quiz"); }
  if (id === "konusma") {
    h.konusma++;
    if (h.konusma === 3) xpEkle(30, "xp_konusma");
  }
  if (id === "dinleme") {
    h.dinleme++;
    if (h.dinleme === 10) xpEkle(10, "xp_dinleme");
  }
  if (!h.tamamlandi && h.ders && h.quiz && h.konusma >= 3 && h.dinleme >= 10) {
    h.tamamlandi = true;
    if (S.sonGun !== bugunStr()) { S.seri++; S.sonGun = bugunStr(); }
    xpEkle(25, "xp_gun");
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
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(el._z);
  el._z = setTimeout(() => el.classList.add("hidden"), sure);
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
    for (const d of hafta.dersler) liste.push({ ...d, hafta: hafta.hafta });
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
const sesOnbellek = new Map(); // OpenAI ses önbelleği: metin -> ObjectURL
const SESSIZ_SES = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
// iOS otomatik çalmaları engellemesin diye tek bir oynatıcı kullanılır;
// ilk kullanıcı dokunuşunda kilidi açılır ve sonraki tüm sesler ondan çalınır.
const oaiPlayer = new Audio();

const EGYPT_YONERGE = "Speak in clear Egyptian Arabic dialect, at a slightly slow pace suitable for a language learner.";

async function oaiSesUrl(metin, yonerge) {
  const anahtar = (yonerge || "") + "|" + metin;
  let url = sesOnbellek.get(anahtar);
  if (url) return url;
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { "Authorization": "Bearer " + S.oaiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // tek sabit ses: her sekmede aynı ton
      input: metin,
      instructions: yonerge || EGYPT_YONERGE,
      response_format: "mp3"
    })
  });
  if (!res.ok) throw new Error("TTS " + res.status);
  url = URL.createObjectURL(await res.blob());
  sesOnbellek.set(anahtar, url);
  return url;
}

function sesleriYukle() {
  sesler = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("ar"));
  const sel = $("#ayarSes");
  if (!sel) return;
  sel.innerHTML = "";
  if (!sesler.length) {
    sel.innerHTML = `<option>${t("ses_bulunamadi")}</option>`;
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

// En kaliteli tarayıcı sesini seç: ar-EG > Google/doğal sesler > herhangi bir Arapça
function enIyiSes() {
  if (S.sesURI) {
    const secili = sesler.find(v => v.voiceURI === S.sesURI);
    if (secili) return secili;
  }
  const kalite = ["majed", "google", "natural", "neural", "premium", "enhanced"];
  const puan = (v) => {
    let p = 0;
    if (v.lang === "ar-EG") p += 10;
    const ad = v.name.toLowerCase();
    kalite.forEach((k, i) => { if (ad.includes(k)) p += 5 - i * 0.5; });
    if (!v.localService) p += 1; // bulut sesleri genelde daha doğal
    return p;
  };
  return sesler.slice().sort((a, b) => puan(b) - puan(a))[0];
}

function tarayiciSeslendir(arapca) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(arapca);
  u.lang = "ar-EG";
  u.rate = S.hiz;
  const v = enIyiSes();
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// Sesi tamamen durdur (sekme değişimi, çalma listesi iptali)
let calmaAktif = false;
function sesiDurdur() {
  calmaAktif = false;
  speechSynthesis.cancel();
  oaiPlayer.pause();
}

async function seslendir(arapca) {
  speechSynthesis.cancel();
  oaiPlayer.pause();
  if (S.oaiKey) {
    try {
      const url = await oaiSesUrl(arapca);
      oaiPlayer.onended = null;
      oaiPlayer.onpause = null;
      oaiPlayer.src = url;
      oaiPlayer.playbackRate = Math.min(1, S.hiz + 0.2);
      await oaiPlayer.play();
      return;
    } catch (e) {
      // Yalnızca API hatasında bilgilendir; çalma engellenirse sessizce tarayıcıya düş
      if (String(e && e.message).startsWith("TTS")) toast(t("oai_hata"), 3000);
    }
  }
  tarayiciSeslendir(arapca);
}

// Sırayla okuma için: bitince çözülen Promise döner
function seslendirAsync(arapca) {
  return new Promise(async (resolve) => {
    speechSynthesis.cancel();
    oaiPlayer.pause();
    if (S.oaiKey) {
      try {
        const url = await oaiSesUrl(arapca);
        oaiPlayer.src = url;
        oaiPlayer.playbackRate = Math.min(1, S.hiz + 0.2);
        oaiPlayer.onended = resolve;
        oaiPlayer.onpause = resolve; // elle durdurulursa da ilerle
        await oaiPlayer.play();
        return;
      } catch (e) { /* tarayıcıya düş */ }
    }
    const u = new SpeechSynthesisUtterance(arapca);
    u.lang = "ar-EG";
    u.rate = S.hiz;
    const v = enIyiSes();
    if (v) u.voice = v;
    u.onend = resolve;
    u.onerror = resolve;
    speechSynthesis.speak(u);
    setTimeout(resolve, 9000); // güvenlik: takılırsa devam et
  });
}

// Ana dilde (TR/EN) seslendirme — anahtar varsa aynı OpenAI sesiyle (ton tutarlılığı için)
async function anadilSeslendir(metin) {
  speechSynthesis.cancel();
  oaiPlayer.pause();
  if (S.oaiKey) {
    try {
      const url = await oaiSesUrl(metin, "Speak naturally and clearly in " + (S.dil === "en" ? "English" : "Turkish") + ".");
      oaiPlayer.onended = null;
      oaiPlayer.onpause = null;
      oaiPlayer.src = url;
      oaiPlayer.playbackRate = 1;
      await oaiPlayer.play();
      return;
    } catch (e) { /* tarayıcıya düş */ }
  }
  const u = new SpeechSynthesisUtterance(metin);
  u.lang = S.dil === "en" ? "en-US" : "tr-TR";
  speechSynthesis.speak(u);
}

// ===================== KONUŞMA TANIMA (STT) =====================
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

// Dinleme yönlendirici: OpenAI anahtarı varsa Whisper tabanlı çözümleme (çok daha doğru Arapça),
// yoksa tarayıcının yerleşik tanıması.
function dinle(opts) {
  if (S.oaiKey && navigator.mediaDevices && window.MediaRecorder) return kayitDinle(opts);
  return tarayiciDinle(opts);
}

// OpenAI ile: mikrofon kaydı + gpt-4o-mini-transcribe çözümlemesi
// ipucu: beklenen Arapça cümle — çözümleyiciyi doğru yöne yönlendirir, tanıma çok daha isabetli olur
function kayitDinle({ dil, durumEl, sonuc, bitti, ipucu }) {
  let rec = null, durduruldu = false, timer = null, stream = null;
  const durdur = () => {
    durduruldu = true;
    clearTimeout(timer);
    if (rec && rec.state !== "inactive") { try { rec.stop(); } catch (e) {} }
  };
  (async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">${t("err_izin")}</div>`;
      if (bitti) bitti();
      return;
    }
    if (durduruldu) { stream.getTracks().forEach(tr => tr.stop()); if (bitti) bitti(); return; }
    if (durumEl) durumEl.innerHTML = `<div class="dinleme-durum">${t("dinliyorum")}</div>`;
    const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm"
               : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
    rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    const parcalar = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) parcalar.push(e.data); };
    rec.onstop = async () => {
      stream.getTracks().forEach(tr => tr.stop());
      const blob = new Blob(parcalar, { type: rec.mimeType || "audio/webm" });
      if (blob.size < 1500) {
        if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc orta">${t("err_duyamadim")}</div>`;
        if (bitti) bitti();
        return;
      }
      if (durumEl) durumEl.innerHTML = `<div class="dinleme-durum">${t("cozumleniyor")}</div>`;
      try {
        const fd = new FormData();
        fd.append("file", blob, "konusma." + (blob.type.includes("mp4") ? "mp4" : "webm"));
        fd.append("model", "gpt-4o-mini-transcribe");
        fd.append("language", dil.slice(0, 2));
        if (dil.startsWith("ar")) {
          fd.append("prompt", (ipucu ? ipucu + " — " : "") + "كلام باللهجة المصرية، اكتبه بالحروف العربية.");
        }
        const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: { "Authorization": "Bearer " + S.oaiKey },
          body: fd
        });
        if (!res.ok) throw new Error("stt " + res.status);
        const data = await res.json();
        const metin = (data.text || "").trim();
        if (!metin) {
          if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc orta">${t("err_duyamadim")}</div>`;
        } else {
          if (durumEl) durumEl.innerHTML = "";
          sonuc([metin]);
        }
      } catch (e) {
        if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">${t("oai_stt_hata")}</div>`;
      }
      if (bitti) bitti();
    };
    rec.start();
    timer = setTimeout(durdur, 6000); // 6 sn sonra otomatik bitir
  })();
  return durdur;
}

// Tarayıcının yerleşik tanıması (anahtarsız mod)
// iOS Safari dahil tüm tarayıcılarda güvenilir dinleme:
// - interimResults açık (iOS sonuçları parça parça verir), tüm adaylar biriktirilir
// - değerlendirme dinleme BİTİNCE yapılır (erken "geçme" olmaz)
// - konuşma bittikten ~1.5 sn sonra veya 10 sn'de otomatik durur; mikrofona tekrar basınca elle durur
// Dönüş: durdurma fonksiyonu
function tarayiciDinle({ dil, durumEl, sonuc, bitti }) {
  if (!SpeechRec) {
    if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">${t("err_destek")}</div>`;
    if (bitti) bitti();
    return null;
  }
  const adaylar = new Set();
  let kapandi = false;
  let hataGosterildi = false;
  const r = new SpeechRec();
  // iOS'un yerleşik tanıması ar-EG'yi bilmiyor; Arapça için ar-SA kullan
  if (/^ar/.test(dil) && /iPad|iPhone|iPod/.test(navigator.userAgent)) dil = "ar-SA";
  r.lang = dil;
  r.interimResults = true;
  r.continuous = true;
  r.maxAlternatives = 5;

  if (durumEl) durumEl.innerHTML = `<div class="dinleme-durum">${t("dinliyorum")}</div>`;

  const durdur = () => { try { r.stop(); } catch (e) {} };
  const guvenlik = setTimeout(durdur, 10000);
  let sessizlik = null;

  r.onresult = (e) => {
    for (let i = 0; i < e.results.length; i++) {
      for (let j = 0; j < e.results[i].length; j++) {
        const tx = (e.results[i][j].transcript || "").trim();
        if (tx) adaylar.add(tx);
      }
    }
    // Konuşma geldikten 1.5 sn sonra kendiliğinden bitir
    clearTimeout(sessizlik);
    sessizlik = setTimeout(durdur, 1500);
  };
  r.onerror = (e) => {
    if (adaylar.size) return; // sonuç zaten var, hatayı yut
    hataGosterildi = true;
    let msg = t("err_hata") + " " + e.error;
    if (e.error === "not-allowed" || e.error === "service-not-allowed") msg = t("err_izin");
    if (e.error === "no-speech") msg = t("err_ses_yok");
    if (e.error === "network") msg = t("err_ag");
    if (e.error === "language-not-supported") msg = t("err_dil");
    if (e.error === "aborted") { hataGosterildi = false; return; }
    if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">${msg}</div>`;
  };
  r.onend = () => {
    clearTimeout(guvenlik);
    clearTimeout(sessizlik);
    if (kapandi) return;
    kapandi = true;
    if (adaylar.size) {
      if (durumEl && durumEl.querySelector(".dinleme-durum")) durumEl.innerHTML = "";
      sonuc([...adaylar]);
    } else if (!hataGosterildi && durumEl) {
      durumEl.innerHTML = `<div class="telaffuz-sonuc orta">${t("err_duyamadim")}</div>`;
    }
    if (bitti) bitti();
  };
  try { r.start(); } catch (e) {
    if (durumEl) durumEl.innerHTML = `<div class="telaffuz-sonuc kotu">${t("err_baslat")}</div>`;
    if (bitti) bitti();
    return null;
  }
  return durdur;
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

// Latin harfli metni karşılaştırma için sadeleştir: aksanlar düşer, çift harfler teklenir
function latinKatla(s) {
  return (s || "").toLowerCase()
    .replace(/sh/g, "ş").replace(/kh/g, "h").replace(/gh/g, "ğ").replace(/ch/g, "ç")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[êéèë]/g, "e").replace(/[ıîï]/g, "i").replace(/[öô]/g, "o").replace(/[üû]/g, "u")
    .replace(/[âà]/g, "a").replace(/w/g, "v")
    .replace(/[^a-z0-9]/g, "")
    .replace(/(.)\1+/g, "$1");
}

// Telaffuz puanı: Arapça yazıyla VE Latin okunuşla karşılaştır, en iyisini al.
// (Çözümleyici bazen "Yallah." gibi Latin harf döndürür — bu da doğru kabul edilmeli.)
function telaffuzSkoru(item, soylenenler) {
  let skor = benzerlik(item.ar, soylenenler);
  const hedefL = latinKatla(item.tr);
  if (hedefL) {
    for (const s of soylenenler) {
      if (/[؀-ۿ]/.test(s)) continue; // Arapça yazı zaten yukarıda karşılaştırıldı
      const aday = latinKatla(s);
      if (!aday) continue;
      const mesafe = levenshtein(hedefL, aday);
      const sk = Math.round(Math.max(0, 1 - mesafe / Math.max(hedefL.length, aday.length, 1)) * 100);
      if (sk > skor) skor = sk;
    }
  }
  return skor;
}

// ===================== ARAPÇA → OKUNUŞ =====================
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
  return okunusGoster(out.replace(/\s+/g, " ").trim());
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
    sesiDurdur();
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
  $("#selamlama").textContent = saat < 12 ? t("selam_sabah") : saat < 18 ? t("selam_gun") : t("selam_aksam");

  // Seviye kartı
  const sv = seviyeBul(S.xp), sonraki = sonrakiSeviye(S.xp);
  const yuzde = sonraki ? Math.round(((S.xp - sv.xp) / (sonraki.xp - sv.xp)) * 100) : 100;
  const kalanYazi = sonraki
    ? (S.dil === "en"
        ? `${tf("kalan_xp", { n: sonraki.xp - S.xp })} ${cAl(sonraki.ad)}`
        : `${cAl(sonraki.ad)} ${tf("kalan_xp", { n: sonraki.xp - S.xp })}`)
    : t("ust_seviye");
  $("#seviyeKarti").innerHTML = `
    <div class="buyuk-ikon">${sv.ikon}</div>
    <div style="flex:1">
      <b>${cAl(sv.ad)}</b>
      <div class="seviye-bar"><div style="width:${yuzde}%"></div></div>
      <small class="ipucu">${kalanYazi}</small>
    </div>`;

  const ders = gununDersi();
  const bitti = S.bitenDersler[ders.id];
  $("#gununDersiCard").innerHTML = `
    <div class="ceviri-etiket">${t("gunun_dersi")} ${ders.hafta}</div>
    <div class="okunus" style="font-size:1.1rem">${cAl(ders.baslik)} ${bitti ? "✅" : ""}</div>
    <button class="btn primary" id="derseGitBtn" style="margin-top:8px">${bitti ? t("tekrar_et") : t("derse_basla")} →</button>`;
  $("#derseGitBtn").onclick = () => { dersAc(ders.id); sekmeyeGit("ders"); };

  const h = S.gunlukHedef;
  const durumlar = { ders: h.ders, quiz: h.quiz, konusma: h.konusma >= 3, dinleme: h.dinleme >= 10 };
  const ilerlemeYazi = { konusma: `${Math.min(h.konusma, 3)}/3`, dinleme: `${Math.min(h.dinleme, 10)}/10` };
  $("#hedefListesi").innerHTML = GUNLUK_HEDEFLER.map(g => `
    <li class="${durumlar[g.id] ? "tamam" : ""}" data-hedef="${g.id}" style="cursor:pointer">
      <span>${durumlar[g.id] ? "✅" : "⬜"} ${cAl(g.baslik)} ${ilerlemeYazi[g.id] ? `<small>(${ilerlemeYazi[g.id]})</small>` : ""} <span style="opacity:.45">›</span></span>
      <span class="xp">+${g.xp} XP</span>
    </li>`).join("");
  // Hedefe dokununca ilgili bölüme git
  $("#hedefListesi").querySelectorAll("[data-hedef]").forEach(li => {
    li.onclick = () => {
      const id = li.dataset.hedef;
      if (id === "ders" || id === "dinleme") { dersAc(gununDersi().id); sekmeyeGit("ders"); }
      if (id === "quiz") sekmeyeGit("pratik");
      if (id === "konusma") sekmeyeGit("konusma");
    };
  });

  $("#gunTamamMsg").classList.toggle("hidden", !h.tamamlandi);

  const hepsi = tumDersler().flatMap(d => d.items);
  const k = hepsi[gunNo() % hepsi.length];
  $("#gununKelimesi").innerHTML = kelimeKartiHTML(k, "gk");
  kelimeKartiBagla($("#gununKelimesi"), k, "gk");

  // SRS özeti
  const bekleyen = srsBekleyenler().length;
  $("#srsOzet").innerHTML = bekleyen
    ? `${tf("srs_bekleyen", { n: bekleyen })}<br>
       <button class="btn primary" id="srsGit" style="margin-top:8px">${t("srs_basla")}</button>`
    : t("srs_yok");
  if (bekleyen) $("#srsGit").onclick = () => { sekmeyeGit("pratik"); flashcardBaslat(); };

}

// ===================== DERS PANELİ =====================
function dersSecicileriDoldur() {
  const dersler = tumDersler();
  const secenek = (d) => `<option value="${d.id}">${t("hafta").charAt(0)}${d.hafta} — ${cAl(d.baslik)} ${S.bitenDersler[d.id] ? "✅" : ""}</option>`;
  const html = dersler.map(secenek).join("");
  const dersSecili = $("#dersSecimi").value;
  const quizSecili = $("#quizDersSecimi").value;
  const konusmaSecili = $("#konusmaDersSecimi").value;
  $("#dersSecimi").innerHTML = html;
  $("#quizDersSecimi").innerHTML = `<option value="__hepsi__">${t("tum_dersler")}</option>` + html;
  $("#konusmaDersSecimi").innerHTML = html;
  if (dersSecili) $("#dersSecimi").value = dersSecili;
  if (quizSecili) $("#quizDersSecimi").value = quizSecili;
  if (konusmaSecili) $("#konusmaDersSecimi").value = konusmaSecili;
}

function kelimeKartiHTML(item, key) {
  return `
    <div class="kelime-kart">
      <div class="kelime-ust">
        <div style="min-width:0">
          <div class="okunus">${okunusGoster(item.tr)}</div>
          <div class="anlam">${cAl(item.anlam)}</div>
          <div class="arapca-yazi">${item.ar}</div>
        </div>
        <div class="kelime-btnler">
          <button class="btn ses" data-rol="dinle" data-key="${key}">🔊</button>
          <button class="btn mic" data-rol="soyle" data-key="${key}">🎤</button>
          <button class="btn" data-rol="alt" data-key="${key}" title="${t("alt_baslik")}">💡</button>
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
    if (micBtn._durdur) { micBtn._durdur(); return; } // ikinci dokunuş: dinlemeyi bitir
    micBtn.classList.add("dinliyor");
    micBtn.textContent = "👂";
    micBtn._durdur = dinle({
      dil: "ar-EG",
      durumEl: alan,
      ipucu: item.ar,
      sonuc: (alternatifler) => {
        const skor = telaffuzSkoru(item, alternatifler);
        telaffuzSonucuGoster(alan, skor, item, alternatifler[0]);
        S.stats.konusma++; kaydet();
        srsKaydet(item, skor >= 60);
        if (skor >= 60) { hedefTamamla("konusma"); titret(40); }
        else titret([60, 40, 60]);
      },
      bitti: () => { micBtn._durdur = null; micBtn.classList.remove("dinliyor"); micBtn.textContent = "🎤"; }
    });
  };
  // 💡 Alternatif söyleyişler
  kapsayici.querySelector(`[data-rol="alt"][data-key="${key}"]`).onclick = async () => {
    if (!S.oaiKey) {
      alan.innerHTML = `<div class="telaffuz-sonuc orta">${t("alt_anahtar")}</div>`;
      return;
    }
    alan.innerHTML = `<div class="dinleme-durum">${t("yukleniyor")}</div>`;
    try {
      alternatifleriGoster(alan, await aiAlternatifler(item));
    } catch (e) {
      alan.innerHTML = `<div class="telaffuz-sonuc kotu">${t("alt_hata")}</div>`;
    }
  };
}

// ===================== 💡 ALTERNATİF SÖYLEYİŞLER =====================
const altOnbellek = new Map(); // item.tr -> [{ar, tr, anlam}]

// "ARABIC ||| translit ||| meaning" satırlarını çöz
function aiSatirlariCoz(metin) {
  return metin.split("\n")
    .filter(s => s.includes("|||"))
    .map(s => {
      const p = s.split("|||").map(x => x.trim().replace(/^[-*\d.\s]+/, ""));
      return { ar: p[0], tr: p[1] || "", anlam: p[2] || "" };
    })
    .filter(x => x.ar);
}

async function aiAlternatifler(item) {
  if (altOnbellek.has(item.tr)) return altOnbellek.get(item.tr);
  const anaDil = S.dil === "en" ? "English" : "Turkish";
  const fonetik = anaDil === "Turkish" ? "Turkish phonetics (ş, ğ, ı)" : "English phonetics (sh, kh)";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": "Bearer " + S.oaiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        { role: "system", content: "You are an Egyptian Arabic phrasebook expert. Output only the requested lines, nothing else." },
        { role: "user", content: `Give 2-3 common ALTERNATIVE Egyptian Arabic ways to express the same meaning as "${item.ar}" (meaning: ${item.anlam}). Do not repeat the original. One per line, format exactly:\nARABIC ||| transliteration in ${fonetik} ||| very short ${anaDil} note on meaning/nuance` }
      ]
    })
  });
  if (!res.ok) throw new Error("alt " + res.status);
  const data = await res.json();
  const liste = aiSatirlariCoz((data.choices && data.choices[0].message.content) || "");
  if (!liste.length) throw new Error("bos");
  altOnbellek.set(item.tr, liste);
  return liste;
}

function alternatifleriGoster(alan, liste) {
  alan.innerHTML = `
    <div class="telaffuz-sonuc iyi">
      <b>${t("alt_baslik")}</b>
      ${liste.map((a, i) => `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px">
          <span><span class="okunus" style="font-size:1rem">${a.tr}</span><br>
          <span class="anlam" style="font-size:.85rem">${a.anlam}</span>
          <span class="arapca-yazi" style="font-size:1rem">${a.ar}</span></span>
          <button class="btn ses" data-alt-ses="${i}">🔊</button>
        </div>`).join("")}
    </div>`;
  alan.querySelectorAll("[data-alt-ses]").forEach(b => {
    b.onclick = () => { seslendir(liste[+b.dataset.altSes].ar); hedefTamamla("dinleme"); };
  });
}

function telaffuzSonucuGoster(alan, skor, item, duyulan) {
  const key = skor >= 75 ? "tel_iyi" : skor >= 50 ? "tel_orta" : "tel_kotu";
  const sinif = skor >= 75 ? "iyi" : skor >= 50 ? "orta" : "kotu";
  const mesaj = tf(key, { s: skor, w: okunusGoster(item.tr) });
  const okunan = duyulan ? `<div class="duyulan">${t("duydugum")} "${arapcaOkunus(duyulan) || duyulan}"</div>` : "";
  alan.innerHTML = `<div class="telaffuz-sonuc ${sinif}">${mesaj}${okunan}</div>`;
}

function dersAc(dersId) {
  const ders = tumDersler().find(d => d.id === dersId);
  if (!ders) return;
  $("#dersSecimi").value = dersId;
  const icerik = $("#dersIcerik");
  icerik.innerHTML = `
    <div class="card">
      <h2>${cAl(ders.baslik)}</h2>
      <p class="ipucu">${t("ders_ipucu")}</p>
      <button class="btn ses" id="dersCal" style="width:100%;margin-bottom:8px">${t("ders_dinle")}</button>
      ${ders.items.map((it, i) => kelimeKartiHTML(it, "d" + i)).join("")}
      <button class="btn primary" id="dersiBitirBtn" style="margin-top:12px;width:100%">
        ${S.bitenDersler[dersId] ? t("ders_bitti") : t("dersi_bitir")}
      </button>
    </div>`;
  ders.items.forEach((it, i) => kelimeKartiBagla(icerik, it, "d" + i));
  $("#dersCal").onclick = async () => {
    const btn = $("#dersCal");
    if (calmaAktif) { sesiDurdur(); btn.textContent = t("ders_dinle"); return; }
    calmaAktif = true;
    btn.textContent = t("ders_dinle_dur");
    for (const it of ders.items) {
      if (!calmaAktif) break;
      const kart = btn.parentElement.querySelectorAll(".kelime-kart")[ders.items.indexOf(it)];
      if (kart) kart.scrollIntoView({ behavior: "smooth", block: "center" });
      await seslendirAsync(it.ar);
      S.stats.dinleme++;
      hedefTamamla("dinleme");
      if (!calmaAktif) break;
      await new Promise(r => setTimeout(r, 700));
    }
    calmaAktif = false;
    kaydet();
    if ($("#dersCal")) $("#dersCal").textContent = t("ders_dinle");
  };
  $("#dersiBitirBtn").onclick = () => {
    if (!S.bitenDersler[dersId]) {
      S.bitenDersler[dersId] = true;
      kaydet();
      hedefTamamla("ders");
      xpEkle(15, "xp_yeniders");
      dersSecicileriDoldur();
      konfetiAt();
      dersAc(dersId);
    } else {
      hedefTamamla("ders");
      toast(t("ders_tekrar_toast"));
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
  const ders = tumDersler().find(d => d.id === secim);
  return ders ? ders.items : tumDersler().flatMap(d => d.items);
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
    <button class="btn geri" data-geri="pratik">${t("cik")}</button>
    <div class="quiz-ilerleme">${t("soru")} ${quiz.indeks + 1} / ${quiz.sorular.length} — ${t("dogru")}: ${quiz.dogru}</div>
    <div class="card">
      ${quiz.tur === "dinleme"
        ? `<div style="text-align:center"><button class="btn ses" id="quizSes" style="font-size:1.5rem;padding:14px 26px">🔊</button></div>
           <p class="ipucu" style="text-align:center">${t("dinleme_ipucu")}</p>`
        : `<div class="quiz-soru">${okunusGoster(q.tr)}</div>
           <p class="ipucu" style="text-align:center">${t("quiz_soru_ipucu")}</p>`}
      <div class="quiz-secenekler">
        ${secenekler.map((s, i) => `<button class="quiz-secenek" data-i="${i}">${cAl(s.anlam)}</button>`).join("")}
      </div>
    </div>`;
  geriButonlariBagla();
  if (quiz.tur === "dinleme") {
    $("#quizSes").onclick = () => seslendir(q.ar);
    seslendir(q.ar);
  }
  alan.querySelectorAll(".quiz-secenek").forEach((btn, i) => {
    btn.onclick = () => {
      const dogruMu = secenekler[i] === q;
      alan.querySelectorAll(".quiz-secenek").forEach((b, j) => {
        b.disabled = true;
        if (secenekler[j] === q) b.classList.add("dogru");
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
      <p>${quiz.dogru} / ${quiz.sorular.length}</p>
      <p>${yuzde >= 80 ? t("mukemmel") : yuzde >= 60 ? t("iyi") : t("tekrar_dene")}</p>
      <button class="btn primary" data-geri="pratik">${t("yeni_quiz")}</button>
    </div>`;
  geriButonlariBagla();
  if (yuzde >= 60) hedefTamamla("quiz");
  if (yuzde >= 80) konfetiAt();
  xpEkle(Math.max(2, Math.round(yuzde / 10)), "xp_skor");
}

// ===================== EŞLEŞTİRME OYUNU =====================
function eslestirmeBaslat() {
  const havuz = karistir(quizHavuzu()).slice(0, 6);
  const kartlar = karistir([
    ...havuz.map(it => ({ tip: "tr", deger: okunusGoster(it.tr), key: it.tr, ar: it.ar })),
    ...havuz.map(it => ({ tip: "anlam", deger: cAl(it.anlam), key: it.tr }))
  ]);
  $("#pratikMenu").classList.add("hidden");
  const alan = $("#eslestirmeAlani");
  alan.classList.remove("hidden");
  let secili = null, kalan = havuz.length;
  const baslangic = Date.now();
  alan.innerHTML = `
    <button class="btn geri" data-geri="pratik">${t("cik")}</button>
    <p class="ipucu" style="text-align:center">${t("esl_ipucu")}</p>
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
      const eslesti = secili.k.tip !== k.tip && secili.k.key === k.key;
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
                <p>${tf("esl_sonuc", { n: sn })}</p>
                <button class="btn primary" data-geri="pratik">${t("yeni_quiz")}</button>
              </div>`;
            geriButonlariBagla();
            hedefTamamla("quiz");
            xpEkle(10, "xp_esl");
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
        <p>${tf("fc_bitti", { n: fdeste.kartlar.length })}</p>
        <button class="btn primary" data-geri="pratik">${t("yeni_quiz")}</button>
      </div>`;
    geriButonlariBagla();
    xpEkle(8, "xp_fc");
    return;
  }
  const k = fdeste.kartlar[fdeste.indeks];
  alan.innerHTML = `
    <button class="btn geri" data-geri="pratik">${t("cik")}</button>
    <div class="quiz-ilerleme">${fdeste.indeks + 1} / ${fdeste.kartlar.length} ${fdeste.srsModu ? t("fc_akilli") : t("fc_rastgele")}</div>
    <div class="fkart" id="fkart">
      <div class="fkart-ic">
        <div class="fkart-yuz">
          <div class="anlam" style="font-size:1.2rem">${cAl(k.anlam)}</div>
          <small class="ipucu">${t("fc_on")}</small>
        </div>
        <div class="fkart-yuz fkart-arka">
          <div class="okunus" style="font-size:1.5rem">${okunusGoster(k.tr)}</div>
          <div class="arapca-yazi">${k.ar}</div>
          <button class="btn ses" id="fSes">${t("dinle")}</button>
        </div>
      </div>
    </div>
    <div class="fkart-btnler">
      <button class="btn danger" id="fBilemedim">${t("bilemedim")}</button>
      <button class="btn primary" id="fBildim">${t("bildim")}</button>
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
  $("#telaffuzAlani").classList.add("hidden");
  $("#aiAlani").classList.add("hidden");
  const alan = $("#diyalogAlani");
  alan.classList.remove("hidden");
  alan.innerHTML = `
    <button class="btn geri" data-geri="konusma">${t("geri")}</button>
    <h3>${t("dlg_baslik")}</h3>
    <p class="ipucu">${t("dlg_ipucu")}</p>
    ${DIYALOGLAR.map(d => `
      <button class="mod-kart" style="width:100%;margin:6px 0" data-dlg="${d.id}">
        <b>${cAl(d.baslik)} ${S.bitenDiyaloglar[d.id] ? "✅" : ""}</b>
        <small>${cAl(d.seviye)} • ${d.adimlar.length} ${t("replik")}</small>
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
    <button class="btn geri" id="dlgGeri">${t("geri")}</button>
    <h3>${cAl(d.baslik)}</h3>
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
      xpEkle(40, "xp_dlg");
    } else {
      xpEkle(10, "xp_dlg2");
    }
    konfetiAt();
    $("#dlgSira").innerHTML = `
      <div class="kutla">${t("dlg_tamamlandi")}<br>
      <button class="btn primary" style="margin-top:8px" id="dlgBitti">${t("dlg_don")}</button></div>`;
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
        <div class="balon-kisi ipucu">${t("dlg_sira")}</div>
        <div class="okunus">${okunusGoster(adim.tr)}</div>
        <div class="anlam">${cAl(adim.anlam)}</div>
        <div class="kelime-btnler" style="margin-top:8px">
          <button class="btn ses" id="dlgIpucu">${t("ipucu_btn")}</button>
          <button class="btn mic" id="dlgMic">${t("soyle")}</button>
          <button class="btn" id="dlgAtla">${t("gec")}</button>
        </div>
        <div id="dlgDurum"></div>
      </div>`;
    $("#dlgIpucu").onclick = () => seslendir(adim.ar);
    $("#dlgAtla").onclick = () => { balonEkle(adim); dlg.adim++; $("#dlgSira").innerHTML = ""; diyalogAdim(); };
    $("#dlgMic").onclick = () => {
      const mic = $("#dlgMic");
      if (mic._durdur) { mic._durdur(); return; }
      mic.classList.add("dinliyor");
      mic._durdur = dinle({
        dil: "ar-EG",
        durumEl: $("#dlgDurum"),
        ipucu: adim.ar,
        sonuc: (alternatifler) => {
          const skor = telaffuzSkoru(adim, alternatifler);
          S.stats.konusma++; kaydet();
          if (skor >= 50) {
            titret(40);
            hedefTamamla("konusma");
            // Önce sonucu göster, sonra ilerle
            $("#dlgDurum").innerHTML = `<div class="telaffuz-sonuc iyi">🎉 <b>%${skor}</b> — ${okunusGoster(adim.tr)} ✓</div>`;
            setTimeout(() => {
              balonEkle(adim);
              dlg.adim++;
              $("#dlgSira").innerHTML = "";
              diyalogAdim();
            }, 1400);
          } else {
            titret([60, 40, 60]);
            $("#dlgDurum").innerHTML = `<div class="telaffuz-sonuc orta">${tf("dlg_yanlis", { s: skor })}<div class="duyulan">${t("duydugum")} "${arapcaOkunus(alternatifler[0]) || alternatifler[0]}"</div></div>`;
          }
        },
        bitti: () => { mic._durdur = null; mic.classList.remove("dinliyor"); }
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
      <div class="kisi">${adim.rol === "app" ? cAl(adim.kisi) : t("sen")}</div>
      <div class="okunus">${okunusGoster(adim.tr)}</div>
      <div class="anlam">${cAl(adim.anlam)}</div>
    </div>`;
  div.querySelector(".balon").onclick = () => seslendir(adim.ar);
  kap.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "end" });
}

// ===================== 🤖 AI HOCA (ChatGPT sohbeti) =====================
let aiGecmis = [];

function aiHocaAc() {
  $("#konusmaMenu").classList.add("hidden");
  $("#telaffuzAlani").classList.add("hidden");
  $("#diyalogAlani").classList.add("hidden");
  $("#aiAlani").classList.remove("hidden");
  $("#aiGirdi").placeholder = t("ai_placeholder");
  geriButonlariBagla();
  if (!S.oaiKey) {
    $("#aiDurum").innerHTML = `<div class="telaffuz-sonuc orta">${t("ai_anahtar_gerek")}</div>`;
    return;
  }
  $("#aiDurum").innerHTML = "";
  if (!$("#aiBalonlar").children.length) {
    aiBalonEkle("app", { tr: "", anlam: t("ai_hosgeldin"), ar: "" });
  }
}

function aiBalonEkle(rol, { ar, tr, anlam }) {
  const kap = $("#aiBalonlar");
  const div = document.createElement("div");
  div.className = "diyalog-balon " + (rol === "app" ? "app" : "sen");
  div.innerHTML = `
    <div class="balon">
      <div class="kisi">${rol === "app" ? t("ai_hoca_adi") : t("sen")}</div>
      ${tr ? `<div class="okunus">${tr}</div>` : ""}
      <div class="anlam">${anlam || ""}</div>
      ${ar ? `<div class="arapca-yazi">${ar}</div>` : ""}
    </div>`;
  if (ar) div.querySelector(".balon").onclick = () => seslendir(ar);
  kap.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "end" });
}

async function aiGonderMesaj(mesaj) {
  if (!mesaj.trim()) return;
  if (!S.oaiKey) {
    $("#aiDurum").innerHTML = `<div class="telaffuz-sonuc orta">${t("ai_anahtar_gerek")}</div>`;
    return;
  }
  aiBalonEkle("sen", { tr: "", anlam: mesaj, ar: "" });
  $("#aiGirdi").value = "";
  $("#aiDurum").innerHTML = `<div class="dinleme-durum">${t("ai_dusunuyor")}</div>`;
  aiGecmis.push({ role: "user", content: mesaj });
  const anaDil = S.dil === "en" ? "English" : "Turkish";
  const sistem = `You are a warm, encouraging Egyptian Arabic tutor chatting with a beginner whose native language is ${anaDil}. Carry a natural conversation and ask simple follow-up questions. ALWAYS reply with 1-2 SHORT Egyptian Arabic sentences suitable for a beginner. Reply STRICTLY in this exact format on a single line:\nARABIC_SCRIPT ||| LATIN_TRANSLITERATION (use ${anaDil === "Turkish" ? "Turkish phonetics, e.g. ş, ğ, izzeyyek" : "English phonetics, e.g. sh, kh, izzayyak"}) ||| ${anaDil} translation (if the user made an Arabic mistake, add a very brief correction here in ${anaDil})\nThe user may write in ${anaDil}, in transliterated Arabic, or in Arabic script.`;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + S.oaiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 200,
        messages: [{ role: "system", content: sistem }, ...aiGecmis.slice(-12)]
      })
    });
    if (!res.ok) throw new Error("api " + res.status);
    const data = await res.json();
    const icerik = (data.choices && data.choices[0].message.content || "").trim();
    aiGecmis.push({ role: "assistant", content: icerik });
    const parcalar = icerik.split("|||").map(s => s.trim());
    const cevap = parcalar.length >= 3
      ? { ar: parcalar[0], tr: parcalar[1], anlam: parcalar[2] }
      : { ar: icerik, tr: arapcaOkunus(icerik), anlam: "" };
    $("#aiDurum").innerHTML = "";
    aiBalonEkle("app", cevap);
    if (cevap.ar) seslendir(cevap.ar);
    S.stats.konusma++; kaydet();
  } catch (e) {
    $("#aiDurum").innerHTML = `<div class="telaffuz-sonuc kotu">${t("ai_hata")}</div>`;
    aiGecmis.pop();
  }
}

// 💡 İpucu: hocanın son sorusuna verilebilecek basit bir cevap öner
$("#aiHint").onclick = async () => {
  if (!S.oaiKey) {
    $("#aiDurum").innerHTML = `<div class="telaffuz-sonuc orta">${t("ai_anahtar_gerek")}</div>`;
    return;
  }
  $("#aiDurum").innerHTML = `<div class="dinleme-durum">${t("yukleniyor")}</div>`;
  const sonAsistan = [...aiGecmis].reverse().find(m => m.role === "assistant");
  const anaDil = S.dil === "en" ? "English" : "Turkish";
  const fonetik = anaDil === "Turkish" ? "Turkish phonetics (ş, ğ)" : "English phonetics (sh, kh)";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + S.oaiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.5,
        max_tokens: 120,
        messages: [
          { role: "system", content: "You help a beginner reply in Egyptian Arabic. Output only the requested line." },
          { role: "user", content: `The tutor's last message was: "${sonAsistan ? sonAsistan.content : "izzeyyek?"}". Suggest ONE very simple, natural reply the learner could say. Format exactly:\nARABIC ||| transliteration in ${fonetik} ||| short ${anaDil} meaning` }
        ]
      })
    });
    if (!res.ok) throw new Error("hint");
    const data = await res.json();
    const oneri = aiSatirlariCoz((data.choices && data.choices[0].message.content) || "")[0];
    if (!oneri) throw new Error("bos");
    $("#aiDurum").innerHTML = `
      <div class="telaffuz-sonuc iyi">
        <b>${t("ai_ipucu_baslik")}</b><br>
        <span class="okunus" style="font-size:1.05rem">${oneri.tr}</span><br>
        <span class="anlam">${oneri.anlam}</span>
        <div class="kelime-btnler" style="margin-top:8px">
          <button class="btn ses" id="aiHintSes">🔊</button>
          <button class="btn primary" id="aiHintGonder">${t("ai_ipucu_gonder")}</button>
        </div>
      </div>`;
    $("#aiHintSes").onclick = () => seslendir(oneri.ar);
    $("#aiHintGonder").onclick = () => { $("#aiDurum").innerHTML = ""; aiGonderMesaj(oneri.tr); };
  } catch (e) {
    $("#aiDurum").innerHTML = `<div class="telaffuz-sonuc kotu">${t("ai_hata")}</div>`;
  }
};

$("#modAiHoca").onclick = aiHocaAc;
$("#aiGonder").onclick = () => aiGonderMesaj($("#aiGirdi").value);
$("#aiGirdi").addEventListener("keydown", (e) => { if (e.key === "Enter") aiGonderMesaj($("#aiGirdi").value); });
$("#aiMic").onclick = () => {
  const btn = $("#aiMic");
  if (btn._durdur) { btn._durdur(); return; }
  btn.classList.add("dinliyor");
  btn._durdur = dinle({
    dil: "ar-EG",
    durumEl: $("#aiDurum"),
    sonuc: (alternatifler) => { aiGonderMesaj(alternatifler[0]); },
    bitti: () => { btn._durdur = null; btn.classList.remove("dinliyor"); }
  });
};

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
$("#modHiz").onclick = hizTuruBaslat;
$("#modSayi").onclick = sayiAntrenorBaslat;

function geriButonlariBagla() {
  $$("[data-geri]").forEach(b => {
    b.onclick = () => {
      sesiDurdur();
      if (hizSayac) { clearInterval(hizSayac); hizSayac = null; }
      const panel = b.dataset.geri;
      if (panel === "pratik") {
        ["#quizAlani", "#eslestirmeAlani", "#flashcardAlani", "#hizAlani", "#sayiAlani"].forEach(s => $(s).classList.add("hidden"));
        $("#pratikMenu").classList.remove("hidden");
      }
      if (panel === "konusma") {
        ["#telaffuzAlani", "#diyalogAlani", "#aiAlani"].forEach(s => $(s).classList.add("hidden"));
        $("#konusmaMenu").classList.remove("hidden");
      }
    };
  });
}
geriButonlariBagla();

// ===================== ⚡ HIZ TURU =====================
let hizSayac = null;

function hizTuruBaslat() {
  const havuz = tumDersler().flatMap(d => d.items);
  let skor = 0, kalanSn = 60;
  $("#pratikMenu").classList.add("hidden");
  const alan = $("#hizAlani");
  alan.classList.remove("hidden");

  function soruGoster() {
    const q = havuz[Math.floor(Math.random() * havuz.length)];
    const yanlislar = karistir(havuz.filter(x => x.tr !== q.tr)).slice(0, 3);
    const secenekler = karistir([q, ...yanlislar]);
    alan.innerHTML = `
      <button class="btn geri" data-geri="pratik">${t("cik")}</button>
      <div class="quiz-ilerleme">⏱️ ${t("sure")}: <b id="hizSure">${kalanSn}</b> — ${t("skor")}: <b>${skor}</b></div>
      <div class="sure-bar"><div id="hizBar" style="width:${(kalanSn / 60) * 100}%"></div></div>
      <div class="card">
        <div class="quiz-soru">${okunusGoster(q.tr)}</div>
        <div class="quiz-secenekler">
          ${secenekler.map((s, i) => `<button class="quiz-secenek" data-i="${i}">${cAl(s.anlam)}</button>`).join("")}
        </div>
      </div>`;
    geriButonlariBagla();
    alan.querySelectorAll(".quiz-secenek").forEach((btn, i) => {
      btn.onclick = () => {
        if (secenekler[i] === q) { skor++; titret(30); }
        else { srsKaydet(q, false); titret([50, 30, 50]); btn.classList.add("yanlis"); }
        soruGoster();
      };
    });
  }

  hizSayac = setInterval(() => {
    kalanSn--;
    const sureEl = $("#hizSure"), barEl = $("#hizBar");
    if (sureEl) sureEl.textContent = kalanSn;
    if (barEl) barEl.style.width = (kalanSn / 60) * 100 + "%";
    if (kalanSn <= 0) {
      clearInterval(hizSayac);
      hizSayac = null;
      alan.innerHTML = `
        <div class="card" style="text-align:center">
          <div class="skor-genis">⚡ ${skor}</div>
          <p>${tf("hiz_bitti", { n: skor })}</p>
          <button class="btn primary" data-geri="pratik">${t("yeni_quiz")}</button>
        </div>`;
      geriButonlariBagla();
      if (skor >= 5) hedefTamamla("quiz");
      if (skor >= 12) konfetiAt();
      xpEkle(Math.max(2, skor), "xp_hiz");
    }
  }, 1000);

  soruGoster();
}

// ===================== 🔢 SAYI ANTRENÖRÜ =====================
const SAYI_BIRIM = {
  ar: ["صفر", "واحد", "اتنين", "تلاتة", "أربعة", "خمسة", "ستة", "سبعة", "تمانية", "تسعة", "عشرة"],
  tr: ["sifr", "vaahid", "itneyn", "teleete", "arbaa", "hamse", "sitte", "seb'a", "temenye", "tis'a", "aşara"]
};
const SAYI_ONLU = {
  ar: ["حداشر", "اتناشر", "تلتاشر", "أربعتاشر", "خمستاشر", "ستاشر", "سبعتاشر", "تمنتاشر", "تسعتاشر"],
  tr: ["hidaaşar", "itnaaşar", "talattaaşar", "arbaataaşar", "hamastaaşar", "sittaaşar", "sabaataaşar", "tamantaaşar", "tisaataaşar"]
};
const SAYI_ONLAR = {
  ar: ["عشرين", "تلاتين", "أربعين", "خمسين", "ستين", "سبعين", "تمانين", "تسعين"],
  tr: ["işriin", "teleetiin", "arbaiin", "hamsiin", "sittiin", "sabaiin", "tamaniin", "tisaiin"]
};
const SAYI_YUZLER = {
  ar: ["مية", "ميتين", "تلتمية", "ربعمية", "خمسمية", "ستمية", "سبعمية", "تمنمية", "تسعمية"],
  tr: ["miyya", "miteyn", "tultumiyya", "rubumiyya", "humsumiyya", "suttumiyya", "subumiyya", "tumnumiyya", "tusumiyya"]
};

// 0-999 arası sayıyı Mısır Arapçasıyla söyle: { ar, tr }
function sayiSoyle(n) {
  if (n < 0 || n > 999) return null;
  const arP = [], trP = [];
  const yuz = Math.floor(n / 100), kalan = n % 100;
  if (yuz > 0) { arP.push(SAYI_YUZLER.ar[yuz - 1]); trP.push(SAYI_YUZLER.tr[yuz - 1]); }
  if (kalan > 0 || n === 0) {
    let arK, trK;
    if (kalan <= 10) { arK = SAYI_BIRIM.ar[kalan]; trK = SAYI_BIRIM.tr[kalan]; }
    else if (kalan < 20) { arK = SAYI_ONLU.ar[kalan - 11]; trK = SAYI_ONLU.tr[kalan - 11]; }
    else {
      const on = Math.floor(kalan / 10), bir = kalan % 10;
      if (bir === 0) { arK = SAYI_ONLAR.ar[on - 2]; trK = SAYI_ONLAR.tr[on - 2]; }
      else {
        // Arapçada önce birlik sonra onluk: 25 = "beş ve yirmi"
        arK = SAYI_BIRIM.ar[bir] + " و" + SAYI_ONLAR.ar[on - 2];
        trK = SAYI_BIRIM.tr[bir] + " ve " + SAYI_ONLAR.tr[on - 2];
      }
    }
    arP.push(arK); trP.push(trK);
  }
  return { ar: arP.join(" و"), tr: trP.join(" ve ") };
}

function sayiAntrenorBaslat() {
  $("#pratikMenu").classList.add("hidden");
  const alan = $("#sayiAlani");
  alan.classList.remove("hidden");
  sayiSoruGoster();
}

function sayiSoruGoster() {
  const alan = $("#sayiAlani");
  const n = Math.floor(Math.random() * 999) + 1;
  const dogru = sayiSoyle(n);
  const yanlislar = [];
  while (yanlislar.length < 3) {
    const m = Math.floor(Math.random() * 999) + 1;
    if (m !== n && !yanlislar.some(x => x.n === m)) yanlislar.push({ n: m, ...sayiSoyle(m) });
  }
  const secenekler = karistir([{ n, ...dogru }, ...yanlislar]);
  alan.innerHTML = `
    <button class="btn geri" data-geri="pratik">${t("cik")}</button>
    <div class="card">
      <p class="ipucu">${t("sayi_cevir_ipucu")}</p>
      <div style="display:flex;gap:8px">
        <input type="number" id="sayiGirdi" min="0" max="999" placeholder="125"
          style="flex:1;padding:12px;border-radius:12px;border:1.5px solid var(--cizgi);background:var(--kart);color:var(--metin);font-size:1.1rem;font-family:inherit">
        <button class="btn ses" id="sayiCevirBtn">🔊</button>
      </div>
      <div id="sayiCevirSonuc" style="margin-top:8px"></div>
    </div>
    <div class="card">
      <div class="quiz-soru">${n}</div>
      <p class="ipucu" style="text-align:center">${t("sayi_quiz_ipucu")}</p>
      <div class="quiz-secenekler">
        ${secenekler.map((s, i) => `<button class="quiz-secenek" data-i="${i}">${okunusGoster(s.tr)}</button>`).join("")}
      </div>
    </div>`;
  geriButonlariBagla();
  $("#sayiCevirBtn").onclick = () => {
    const v = parseInt($("#sayiGirdi").value, 10);
    const s = isNaN(v) ? null : sayiSoyle(v);
    if (!s) return;
    $("#sayiCevirSonuc").innerHTML = `<div class="okunus">${okunusGoster(s.tr)}</div><div class="arapca-yazi">${s.ar}</div>`;
    seslendir(s.ar);
  };
  alan.querySelectorAll(".quiz-secenek").forEach((btn, i) => {
    btn.onclick = () => {
      const dogruMu = secenekler[i].n === n;
      alan.querySelectorAll(".quiz-secenek").forEach((b, j) => {
        b.disabled = true;
        if (secenekler[j].n === n) b.classList.add("dogru");
      });
      if (dogruMu) { btn.classList.add("dogru"); titret(40); xpEkle(3, "xp_sayi"); }
      else { btn.classList.add("yanlis"); titret([60, 40, 60]); }
      seslendir(dogru.ar);
      setTimeout(sayiSoruGoster, 1600);
    };
  });
}

// ===================== ÇEVİRMEN =====================
let ceviriYonu = "kaynak-ar"; // kaynak: kullanıcının dili (tr veya en)
let sonCeviri = null;

function kaynakDilKodu() { return S.dil === "en" ? "en" : "tr"; }
function kaynakKonusmaDili() { return S.dil === "en" ? "en-US" : "tr-TR"; }

$("#yonTrAr").onclick = () => { ceviriYonu = "kaynak-ar"; yonGuncelle(); };
$("#yonArTr").onclick = () => { ceviriYonu = "ar-kaynak"; yonGuncelle(); };
function yonGuncelle() {
  $("#yonTrAr").classList.toggle("active", ceviriYonu === "kaynak-ar");
  $("#yonArTr").classList.toggle("active", ceviriYonu === "ar-kaynak");
  $("#ceviriGirdi").placeholder = ceviriYonu === "kaynak-ar" ? t("ceviri_placeholder") : t("ceviri_placeholder_ar");
}

$("#ceviriMic").onclick = () => {
  const btn = $("#ceviriMic");
  if (btn._durdur) { btn._durdur(); return; }
  btn.classList.add("dinliyor");
  $("#ceviriDurum").classList.remove("hidden");
  btn._durdur = dinle({
    dil: ceviriYonu === "kaynak-ar" ? kaynakKonusmaDili() : "ar-EG",
    durumEl: $("#ceviriDurum"),
    sonuc: (alternatifler) => {
      $("#ceviriGirdi").value = alternatifler[0];
      $("#ceviriDurum").innerHTML = "";
      $("#ceviriDurum").classList.add("hidden");
      ceviriYap();
    },
    bitti: () => { btn._durdur = null; btn.classList.remove("dinliyor"); }
  });
};

async function ceviriYap() {
  const metin = $("#ceviriGirdi").value.trim();
  if (!metin) { toast(t("cev_once")); return; }
  const [kaynak, hedefDil] = ceviriYonu === "kaynak-ar" ? [kaynakDilKodu(), "ar"] : ["ar", kaynakDilKodu()];
  $("#ceviriYap").textContent = t("cevriliyor");
  $("#ceviriYap").disabled = true;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(metin)}&langpair=${kaynak}|${hedefDil}`;
    const res = await fetch(url);
    const data = await res.json();
    const ceviri = data.responseData && data.responseData.translatedText;
    if (!ceviri) throw new Error("bos");
    sonCeviri = { metin: ceviri, dil: hedefDil };
    S.stats.ceviri++; kaydet();
    $("#ceviriSonuc").classList.remove("hidden");
    $("#ceviriTelaffuz").innerHTML = "";
    if (hedefDil === "ar") {
      $("#ceviriMetin").textContent = arapcaOkunus(ceviri) || ceviri;
      $("#ceviriOkunus").textContent = t("okunus_not");
      $("#ceviriArapca").textContent = ceviri;
      seslendir(ceviri);
    } else {
      $("#ceviriMetin").textContent = ceviri;
      $("#ceviriOkunus").textContent = "";
      $("#ceviriArapca").textContent = "";
    }
    $("#ceviriSonuc").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    toast(t("cev_hata"));
  } finally {
    $("#ceviriYap").textContent = t("cevir");
    $("#ceviriYap").disabled = false;
  }
}
$("#ceviriYap").onclick = ceviriYap;
$("#ceviriDinle").onclick = () => {
  if (!sonCeviri) return;
  if (sonCeviri.dil === "ar") seslendir(sonCeviri.metin);
  else anadilSeslendir(sonCeviri.metin);
};
$("#ceviriTekrarla").onclick = () => {
  if (!sonCeviri || sonCeviri.dil !== "ar") { toast(t("cev_yon_uyari")); return; }
  const btn = $("#ceviriTekrarla");
  if (btn._durdur) { btn._durdur(); return; }
  btn.classList.add("dinliyor");
  btn._durdur = dinle({
    dil: "ar-EG",
    durumEl: $("#ceviriTelaffuz"),
    ipucu: sonCeviri.metin,
    sonuc: (alternatifler) => {
      const hedefItem = { ar: sonCeviri.metin, tr: arapcaOkunus(sonCeviri.metin) };
      const skor = telaffuzSkoru(hedefItem, alternatifler);
      telaffuzSonucuGoster($("#ceviriTelaffuz"), skor, hedefItem, alternatifler[0]);
      if (skor >= 60) hedefTamamla("konusma");
    },
    bitti: () => { btn._durdur = null; btn.classList.remove("dinliyor"); }
  });
};

// ===================== CEP REHBERİ =====================
function rehberiCiz() {
  $("#rehberKategoriler").innerHTML = CEP_REHBERI.map((kat, ki) => `
    <div class="rehber-kategori">
      <h3>${cAl(kat.kategori)}</h3>
      ${kat.ifadeler.map((f, i) => `
        <button class="rehber-ifade" data-kat="${ki}" data-i="${i}">
          <span>
            <span class="okunus" style="font-size:1rem">${okunusGoster(f.tr)}</span><br>
            <span class="anlam" style="font-size:.85rem">${cAl(f.anlam)}</span>
          </span>
          <span class="hoparlor">📢</span>
        </button>`).join("")}
    </div>`).join("");
  $$(".rehber-ifade").forEach(btn => {
    btn.onclick = () => {
      const f = CEP_REHBERI[+btn.dataset.kat].ifadeler[+btn.dataset.i];
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
        <div class="hafta-baslik"><h3>${t("hafta")} ${hafta.hafta}: ${cAl(hafta.baslik)}</h3><span>🔁</span></div>
        <p class="ipucu">${cAl(hafta.aciklama)}</p>
      </div>`;
    }
    const biten = hafta.dersler.filter(d => S.bitenDersler[d.id]).length;
    toplamDers += hafta.dersler.length;
    bitenSayisi += biten;
    const yuzde = Math.round((biten / hafta.dersler.length) * 100);
    return `<div class="card hafta-kart">
      <div class="hafta-baslik">
        <h3>${t("hafta")} ${hafta.hafta}: ${cAl(hafta.baslik)}</h3>
        <span class="hafta-yuzde">%${yuzde}</span>
      </div>
      ${hafta.dersler.map(d => `
        <div class="ders-satir">
          <span>${S.bitenDersler[d.id] ? "✅" : "⬜"} ${cAl(d.baslik)}</span>
          <button class="btn" data-ders="${d.id}">${t("ac")}</button>
        </div>`).join("")}
    </div>`;
  }).join("");

  liste.querySelectorAll("[data-ders]").forEach(btn => {
    btn.onclick = () => { dersAc(btn.dataset.ders); sekmeyeGit("ders"); };
  });

  const genelYuzde = toplamDers ? Math.round((bitenSayisi / toplamDers) * 100) : 0;
  $("#genelBar").style.width = genelYuzde + "%";
  $("#genelYuzde").textContent = "%" + genelYuzde;

  const istatistikEtiket = S.dil === "en"
    ? ["🧠 Quizzes taken", "🎤 Speaking attempts", "👂 Words listened", "💬 Dialogues completed", "🌐 Translations made", "🃏 Words awaiting review"]
    : ["🧠 Çözülen quiz", "🎤 Konuşma denemesi", "👂 Dinlenen kelime", "💬 Biten diyalog", "🌐 Yapılan çeviri", "🃏 Tekrar bekleyen kelime"];
  const degerler = [S.stats.quiz, S.stats.konusma, S.stats.dinleme, Object.keys(S.bitenDiyaloglar).length, S.stats.ceviri, srsBekleyenler().length];
  $("#istatistikler").innerHTML = istatistikEtiket.map((e, i) =>
    `<div class="ders-satir"><span>${e}</span><b>${degerler[i]}</b></div>`).join("");

  aktiviteTakvimiCiz();
  rozetleriCiz();
}

// Son 28 günün XP ısı haritası
function aktiviteTakvimiCiz() {
  const kap = $("#aktiviteTakvim");
  if (!kap) return;
  const gunler = [];
  for (let i = 27; i >= 0; i--) {
    const tarih = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const xp = (S.aktivite && S.aktivite[tarih]) || 0;
    const seviye = xp === 0 ? 0 : xp < 30 ? 1 : xp < 80 ? 2 : 3;
    gunler.push(`<div class="takvim-gun s${seviye}" title="${tarih}: ${xp} XP"></div>`);
  }
  kap.innerHTML = gunler.join("");
}

// ===================== ROZETLER =====================
const ROZETLER = [
  { id: "ilkders", ikon: "🌱", ad: "İlk Ders", adEn: "First Lesson", kontrol: () => Object.keys(S.bitenDersler).length >= 1 },
  { id: "hafta1", ikon: "🥉", ad: "Hafta 1", adEn: "Week 1", kontrol: () => CURRICULUM[0].dersler.every(d => S.bitenDersler[d.id]) },
  { id: "hafta2", ikon: "🥈", ad: "Hafta 2", adEn: "Week 2", kontrol: () => CURRICULUM[1].dersler.every(d => S.bitenDersler[d.id]) },
  { id: "tumders", ikon: "🥇", ad: "Tüm Dersler", adEn: "All Lessons", kontrol: () => tumDersler().every(d => S.bitenDersler[d.id]) },
  { id: "ilkdlg", ikon: "🎭", ad: "İlk Diyalog", adEn: "First Dialogue", kontrol: () => Object.keys(S.bitenDiyaloglar).length >= 1 },
  { id: "tumdlg", ikon: "🗣️", ad: "Konuşkan", adEn: "Talkative", kontrol: () => DIYALOGLAR.every(d => S.bitenDiyaloglar[d.id]) },
  { id: "seri3", ikon: "🔥", ad: "3 Gün Seri", adEn: "3-Day Streak", kontrol: () => S.seri >= 3 },
  { id: "seri7", ikon: "⚡", ad: "7 Gün Seri", adEn: "7-Day Streak", kontrol: () => S.seri >= 7 },
  { id: "xp300", ikon: "⭐", ad: "300 XP", adEn: "300 XP", kontrol: () => S.xp >= 300 },
  { id: "xp1000", ikon: "🌟", ad: "1000 XP", adEn: "1000 XP", kontrol: () => S.xp >= 1000 },
  { id: "xp3000", ikon: "👑", ad: "3000 XP", adEn: "3000 XP", kontrol: () => S.xp >= 3000 }
];
function rozetAd(r) { return S.dil === "en" ? r.adEn : r.ad; }

function rozetKontrol() {
  for (const r of ROZETLER) {
    if (!S.rozetler[r.id] && r.kontrol()) {
      S.rozetler[r.id] = true;
      kaydet();
      toast(`🏅 ${t("rozet_yeni")}: ${r.ikon} ${rozetAd(r)}!`, 3000);
      konfetiAt();
    }
  }
}

function rozetleriCiz() {
  rozetKontrol();
  $("#rozetler").innerHTML = ROZETLER.map(r => `
    <div class="rozet ${S.rozetler[r.id] ? "" : "kilitli"}">
      <div class="ikon">${r.ikon}</div>
      <div class="ad">${rozetAd(r)}</div>
    </div>`).join("");
}

// ===================== AYARLAR =====================
const ayarDlg = $("#settingsDialog");
$("#settingsBtn").onclick = () => {
  $("#ayarArapca").checked = S.arapcaGoster;
  $("#ayarKaranlik").checked = S.karanlik;
  $("#ayarHiz").value = S.hiz;
  $("#ayarDil").value = S.dil;
  $("#ayarOaiKey").value = S.oaiKey;
  sesleriYukle();
  ayarDlg.showModal();
};
$("#ayarKapat").onclick = () => ayarDlg.close();
$("#ayarArapca").onchange = (e) => { S.arapcaGoster = e.target.checked; kaydet(); gorunumUygula(); };
$("#ayarKaranlik").onchange = (e) => { S.karanlik = e.target.checked; kaydet(); gorunumUygula(); };
$("#ayarHiz").onchange = (e) => { S.hiz = parseFloat(e.target.value); kaydet(); };
$("#ayarSes").onchange = (e) => { S.sesURI = e.target.value; kaydet(); };
$("#ayarDil").onchange = (e) => { dilDegistir(e.target.value); };
$("#ayarOaiKey").onchange = (e) => { S.oaiKey = e.target.value.trim(); sesOnbellek.clear(); kaydet(); };
$("#yedekAl").onclick = async () => {
  const veri = localStorage.getItem("misirca") || "{}";
  if (navigator.share) {
    try { await navigator.share({ text: veri }); return; } catch (e) {}
  }
  try { await navigator.clipboard.writeText(veri); toast(t("yedek_kopyalandi"), 3500); } catch (e) {}
};
$("#yedekYukle").onclick = () => {
  const metin = prompt(t("yedek_sor"));
  if (!metin) return;
  try {
    const veri = JSON.parse(metin);
    if (typeof veri.xp !== "number") throw new Error("gecersiz");
    localStorage.setItem("misirca", metin);
    toast(t("yedek_tamam"));
    setTimeout(() => location.reload(), 800);
  } catch (e) { toast(t("yedek_hata")); }
};
$("#ayarSifirla").onclick = () => {
  if (confirm(t("sifir_onay"))) {
    localStorage.removeItem("misirca");
    location.reload();
  }
};
$("#dilBtn").onclick = () => dilDegistir(S.dil === "tr" ? "en" : "tr");

$("#paylasBtn").onclick = async () => {
  const metin = tf("paylas_metin", { xp: S.xp, seviye: cAl(seviyeBul(S.xp).ad) });
  if (navigator.share) {
    try { await navigator.share({ text: metin }); } catch (e) {}
  } else {
    try { await navigator.clipboard.writeText(metin); toast(t("kopyalandi")); } catch (e) {}
  }
};

function dilDegistir(yeni) {
  S.dil = yeni;
  kaydet();
  applyI18n();
  dersSecicileriDoldur();
  bugunuCiz();
  rehberiCiz();
  ajandayiCiz();
  const acikDers = $("#dersSecimi").value;
  if (acikDers) dersAc(acikDers);
  if (!$("#telaffuzAlani").classList.contains("hidden")) konusmaCiz();
  if (!$("#diyalogAlani").classList.contains("hidden")) diyalogMenuGoster();
}

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
  applyI18n();
  ustBilgiGuncelle();
  dersSecicileriDoldur();
  bugunuCiz();
  dersAc(gununDersi().id);
  rehberiCiz();
  sesleriYukle();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  // iOS Safari: ses motoru ancak kullanıcı dokunuşuyla uyanır; ilk dokunuşta sessizce hazırla
  document.addEventListener("click", function uyandir() {
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch (e) {}
    // Kalıcı oynatıcının kilidini aç: sonraki otomatik çalmalar (quiz, diyalog) engellenmesin
    try {
      oaiPlayer.src = SESSIZ_SES;
      oaiPlayer.play().catch(() => {});
    } catch (e) {}
    setTimeout(sesleriYukle, 300);
  }, { once: true });
}
baslat();
