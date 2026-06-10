// Mısır Lehçesi Arapça Müfredatı
// Her item: ar (Arapça yazılış - sadece ses için), tr (Türkçe okunuş), anlam (Türkçe anlam)

const CURRICULUM = [
  {
    hafta: 1,
    baslik: "Selamlaşma ve Temeller",
    dersler: [
      {
        id: "w1d1",
        gun: 1,
        baslik: "Merhaba Demek",
        items: [
          { ar: "أهلاً", tr: "ehlen", anlam: "Merhaba" },
          { ar: "أهلاً وسهلاً", tr: "ehlen ve sehlen", anlam: "Hoş geldin" },
          { ar: "صباح الخير", tr: "sabaah il-hêr", anlam: "Günaydın" },
          { ar: "صباح النور", tr: "sabaah in-nuur", anlam: "Günaydın (cevap)" },
          { ar: "مساء الخير", tr: "mesee' il-hêr", anlam: "İyi akşamlar" },
          { ar: "إزيك؟", tr: "izzeyyek?", anlam: "Nasılsın? (erkeğe)" },
          { ar: "إزيك؟", tr: "izzeyyik?", anlam: "Nasılsın? (kadına)" },
          { ar: "كويس", tr: "kuveyyis", anlam: "İyiyim (erkek)" },
          { ar: "كويسة", tr: "kuveyyise", anlam: "İyiyim (kadın)" },
          { ar: "الحمد لله", tr: "il-hamdu lilleh", anlam: "Çok şükür / İyiyim" }
        ]
      },
      {
        id: "w1d2",
        gun: 2,
        baslik: "Vedalaşma ve Nezaket",
        items: [
          { ar: "مع السلامة", tr: "mea's-seleeme", anlam: "Güle güle" },
          { ar: "سلام", tr: "seleem", anlam: "Hoşça kal (gündelik)" },
          { ar: "شكراً", tr: "şukran", anlam: "Teşekkürler" },
          { ar: "ألف شكر", tr: "elf şukr", anlam: "Bin teşekkür" },
          { ar: "العفو", tr: "il-afv", anlam: "Rica ederim" },
          { ar: "من فضلك", tr: "min fadlek", anlam: "Lütfen (erkeğe)" },
          { ar: "لو سمحت", tr: "lev semaht", anlam: "Affedersiniz / lütfen" },
          { ar: "آسف", tr: "eesif", anlam: "Üzgünüm (erkek)" },
          { ar: "آسفة", tr: "eesfe", anlam: "Üzgünüm (kadın)" },
          { ar: "مفيش مشكلة", tr: "mefiiş muşkile", anlam: "Sorun değil" }
        ]
      },
      {
        id: "w1d3",
        gun: 3,
        baslik: "Kendini Tanıtma",
        items: [
          { ar: "أنا", tr: "ene", anlam: "Ben" },
          { ar: "إنت", tr: "inte", anlam: "Sen (erkek)" },
          { ar: "إنتي", tr: "inti", anlam: "Sen (kadın)" },
          { ar: "اسمي", tr: "ismii", anlam: "Benim adım" },
          { ar: "اسمك إيه؟", tr: "ismek êh?", anlam: "Adın ne? (erkeğe)" },
          { ar: "أنا من تركيا", tr: "ene min turkiye", anlam: "Ben Türkiye'denim" },
          { ar: "أنا تركي", tr: "ene turki", anlam: "Ben Türküm (erkek)" },
          { ar: "أنا تركية", tr: "ene turkiyye", anlam: "Ben Türküm (kadın)" },
          { ar: "إنت منين؟", tr: "inte mineyn?", anlam: "Nerelisin?" },
          { ar: "تشرفنا", tr: "teşarrafne", anlam: "Memnun oldum" }
        ]
      },
      {
        id: "w1d4",
        gun: 4,
        baslik: "Evet, Hayır ve Temel Kelimeler",
        items: [
          { ar: "أيوة", tr: "eyve", anlam: "Evet" },
          { ar: "لأ", tr: "le'", anlam: "Hayır" },
          { ar: "ماشي", tr: "meeşi", anlam: "Tamam / olur" },
          { ar: "طبعاً", tr: "tab'an", anlam: "Tabii ki" },
          { ar: "يمكن", tr: "yimkin", anlam: "Belki" },
          { ar: "مش عارف", tr: "miş aarif", anlam: "Bilmiyorum (erkek)" },
          { ar: "مش عارفة", tr: "miş aarfe", anlam: "Bilmiyorum (kadın)" },
          { ar: "خلاص", tr: "halaas", anlam: "Tamam / bitti / yeter" },
          { ar: "يلا", tr: "yalla", anlam: "Hadi" },
          { ar: "بس", tr: "bess", anlam: "Sadece / ama / yeter" }
        ]
      },
      {
        id: "w1d5",
        gun: 5,
        baslik: "Sayılar 1-10",
        items: [
          { ar: "واحد", tr: "vaahid", anlam: "Bir (1)" },
          { ar: "اتنين", tr: "itneyn", anlam: "İki (2)" },
          { ar: "تلاتة", tr: "teleete", anlam: "Üç (3)" },
          { ar: "أربعة", tr: "arbaa", anlam: "Dört (4)" },
          { ar: "خمسة", tr: "hamse", anlam: "Beş (5)" },
          { ar: "ستة", tr: "sitte", anlam: "Altı (6)" },
          { ar: "سبعة", tr: "seb'a", anlam: "Yedi (7)" },
          { ar: "تمانية", tr: "temenye", anlam: "Sekiz (8)" },
          { ar: "تسعة", tr: "tis'a", anlam: "Dokuz (9)" },
          { ar: "عشرة", tr: "aşara", anlam: "On (10)" }
        ]
      }
    ]
  },
  {
    hafta: 2,
    baslik: "Günlük Hayat",
    dersler: [
      {
        id: "w2d1",
        gun: 1,
        baslik: "Soru Kelimeleri",
        items: [
          { ar: "إيه؟", tr: "êh?", anlam: "Ne?" },
          { ar: "فين؟", tr: "feyn?", anlam: "Nerede?" },
          { ar: "إمتى؟", tr: "imte?", anlam: "Ne zaman?" },
          { ar: "ليه؟", tr: "lêh?", anlam: "Neden?" },
          { ar: "إزاي؟", tr: "izzey?", anlam: "Nasıl?" },
          { ar: "مين؟", tr: "miin?", anlam: "Kim?" },
          { ar: "كام؟", tr: "keem?", anlam: "Kaç tane? / Ne kadar?" },
          { ar: "بكام؟", tr: "bikeem?", anlam: "Kaça? (fiyat)" },
          { ar: "إيه ده؟", tr: "êh de?", anlam: "Bu ne?" },
          { ar: "فين الحمام؟", tr: "feyn il-hammeem?", anlam: "Tuvalet nerede?" }
        ]
      },
      {
        id: "w2d2",
        gun: 2,
        baslik: "Yiyecek ve İçecek",
        items: [
          { ar: "أكل", tr: "ekl", anlam: "Yemek" },
          { ar: "مية", tr: "mayya", anlam: "Su" },
          { ar: "شاي", tr: "şeey", anlam: "Çay" },
          { ar: "قهوة", tr: "ahve", anlam: "Kahve" },
          { ar: "عيش", tr: "eyş", anlam: "Ekmek" },
          { ar: "فراخ", tr: "firaah", anlam: "Tavuk" },
          { ar: "لحمة", tr: "lahme", anlam: "Et" },
          { ar: "سمك", tr: "semek", anlam: "Balık" },
          { ar: "أنا جعان", tr: "ene gaaeen", anlam: "Açım (erkek)" },
          { ar: "أنا عطشان", tr: "ene atşaan", anlam: "Susadım (erkek)" }
        ]
      },
      {
        id: "w2d3",
        gun: 3,
        baslik: "Restoranda",
        items: [
          { ar: "المنيو لو سمحت", tr: "il-menyu lev semaht", anlam: "Menü lütfen" },
          { ar: "عايز", tr: "aayiz", anlam: "İstiyorum (erkek)" },
          { ar: "عايزة", tr: "ayze", anlam: "İstiyorum (kadın)" },
          { ar: "الحساب لو سمحت", tr: "il-hiseeb lev semaht", anlam: "Hesap lütfen" },
          { ar: "لذيذ", tr: "leziiz", anlam: "Lezzetli" },
          { ar: "حلو أوي", tr: "hilv evi", anlam: "Çok güzel" },
          { ar: "كمان واحد", tr: "kemeen vaahid", anlam: "Bir tane daha" },
          { ar: "من غير سكر", tr: "min ğêr sukker", anlam: "Şekersiz" },
          { ar: "بالهنا والشفا", tr: "bil-hene viş-şife", anlam: "Afiyet olsun" },
          { ar: "شوية", tr: "şuvayya", anlam: "Biraz / azıcık" }
        ]
      },
      {
        id: "w2d4",
        gun: 4,
        baslik: "Alışveriş ve Pazarlık",
        items: [
          { ar: "بكام ده؟", tr: "bikeem de?", anlam: "Bu kaça?" },
          { ar: "غالي أوي", tr: "ğaali evi", anlam: "Çok pahalı" },
          { ar: "رخيص", tr: "rahiis", anlam: "Ucuz" },
          { ar: "فلوس", tr: "filuus", anlam: "Para" },
          { ar: "جنيه", tr: "gineyh", anlam: "Cüneyh (Mısır lirası)" },
          { ar: "ممكن أشوف؟", tr: "mumkin eşuuf?", anlam: "Bakabilir miyim?" },
          { ar: "هاخد ده", tr: "haahod de", anlam: "Bunu alacağım" },
          { ar: "مش عايز حاجة", tr: "miş aayiz haage", anlam: "Bir şey istemiyorum" },
          { ar: "آخر كلام؟", tr: "eehir keleem?", anlam: "Son fiyat mı?" },
          { ar: "كده كتير", tr: "kide kitiir", anlam: "Bu çok fazla" }
        ]
      },
      {
        id: "w2d5",
        gun: 5,
        baslik: "Sayılar 11-100 ve Zaman",
        items: [
          { ar: "حداشر", tr: "hidaaşar", anlam: "On bir (11)" },
          { ar: "اتناشر", tr: "itnaaşar", anlam: "On iki (12)" },
          { ar: "عشرين", tr: "işriin", anlam: "Yirmi (20)" },
          { ar: "تلاتين", tr: "teleetiin", anlam: "Otuz (30)" },
          { ar: "خمسين", tr: "hamsiin", anlam: "Elli (50)" },
          { ar: "مية", tr: "miyya", anlam: "Yüz (100)" },
          { ar: "النهارده", tr: "in-neharda", anlam: "Bugün" },
          { ar: "بكرة", tr: "bukra", anlam: "Yarın" },
          { ar: "امبارح", tr: "imbeerih", anlam: "Dün" },
          { ar: "دلوقتي", tr: "dilva'ti", anlam: "Şimdi" }
        ]
      }
    ]
  },
  {
    hafta: 3,
    baslik: "İletişim Kurma",
    dersler: [
      {
        id: "w3d1",
        gun: 1,
        baslik: "Ulaşım ve Yön",
        items: [
          { ar: "تاكسي", tr: "taksi", anlam: "Taksi" },
          { ar: "على طول", tr: "ale tuul", anlam: "Düz git / direkt" },
          { ar: "يمين", tr: "yimiin", anlam: "Sağ" },
          { ar: "شمال", tr: "şimeel", anlam: "Sol" },
          { ar: "هنا", tr: "hine", anlam: "Burada" },
          { ar: "هناك", tr: "hineek", anlam: "Orada" },
          { ar: "قريب", tr: "urayyib", anlam: "Yakın" },
          { ar: "بعيد", tr: "biiid", anlam: "Uzak" },
          { ar: "وقف هنا", tr: "ve''af hine", anlam: "Burada dur" },
          { ar: "أنا رايح...", tr: "ene raayih...", anlam: "...'e gidiyorum" }
        ]
      },
      {
        id: "w3d2",
        gun: 2,
        baslik: "Aile",
        items: [
          { ar: "عيلة", tr: "êle", anlam: "Aile" },
          { ar: "أبويا", tr: "ebuuye", anlam: "Babam" },
          { ar: "أمي", tr: "ummi", anlam: "Annem" },
          { ar: "أخويا", tr: "ehuuye", anlam: "Erkek kardeşim" },
          { ar: "أختي", tr: "uhti", anlam: "Kız kardeşim" },
          { ar: "جوزي", tr: "gôzi", anlam: "Kocam" },
          { ar: "مراتي", tr: "miraati", anlam: "Karım" },
          { ar: "ابني", tr: "ibni", anlam: "Oğlum" },
          { ar: "بنتي", tr: "binti", anlam: "Kızım" },
          { ar: "صاحبي", tr: "saahbi", anlam: "Arkadaşım" }
        ]
      },
      {
        id: "w3d3",
        gun: 3,
        baslik: "Duygular ve Haller",
        items: [
          { ar: "مبسوط", tr: "mebsuut", anlam: "Mutlu (erkek)" },
          { ar: "زعلان", tr: "zaaleen", anlam: "Üzgün / kırgın" },
          { ar: "تعبان", tr: "taabeen", anlam: "Yorgun / hasta" },
          { ar: "مشغول", tr: "meşğuul", anlam: "Meşgul" },
          { ar: "عيان", tr: "ayyeen", anlam: "Hasta" },
          { ar: "حر", tr: "harr", anlam: "Sıcak (hava)" },
          { ar: "برد", tr: "berd", anlam: "Soğuk" },
          { ar: "خايف", tr: "haayif", anlam: "Korkmuş" },
          { ar: "أنا فرحان أوي", tr: "ene farhaan evi", anlam: "Çok sevinçliyim" },
          { ar: "ولا يهمك", tr: "vele yhimmek", anlam: "Takma kafana" }
        ]
      },
      {
        id: "w3d4",
        gun: 4,
        baslik: "Günlük Fiiller",
        items: [
          { ar: "باكل", tr: "beekul", anlam: "Yiyorum" },
          { ar: "باشرب", tr: "beşrab", anlam: "İçiyorum" },
          { ar: "بانام", tr: "beneem", anlam: "Uyuyorum" },
          { ar: "باشتغل", tr: "beştağal", anlam: "Çalışıyorum" },
          { ar: "باروح", tr: "beruuh", anlam: "Gidiyorum" },
          { ar: "باجي", tr: "beegi", anlam: "Geliyorum" },
          { ar: "باتكلم", tr: "betkellim", anlam: "Konuşuyorum" },
          { ar: "بافهم", tr: "befhem", anlam: "Anlıyorum" },
          { ar: "مش فاهم", tr: "miş feehim", anlam: "Anlamıyorum" },
          { ar: "باحب", tr: "behibb", anlam: "Seviyorum" }
        ]
      },
      {
        id: "w3d5",
        gun: 5,
        baslik: "Hayatta Kalma Cümleleri",
        items: [
          { ar: "ممكن تتكلم بشويش؟", tr: "mumkin titkellim bişviiş?", anlam: "Yavaş konuşabilir misin?" },
          { ar: "تاني لو سمحت", tr: "teeni lev semaht", anlam: "Tekrar lütfen" },
          { ar: "أنا باتعلم عربي", tr: "ene betaallim arabi", anlam: "Arapça öğreniyorum" },
          { ar: "بتتكلم إنجليزي؟", tr: "bititkellim ingiliizi?", anlam: "İngilizce konuşuyor musun?" },
          { ar: "يعني إيه؟", tr: "yaani êh?", anlam: "Ne demek?" },
          { ar: "ساعدني", tr: "saaidni", anlam: "Bana yardım et" },
          { ar: "مش مهم", tr: "miş muhimm", anlam: "Önemli değil" },
          { ar: "معلش", tr: "maaleş", anlam: "Boş ver / olsun" },
          { ar: "إن شاء الله", tr: "inşaallah", anlam: "İnşallah" },
          { ar: "ربنا يخليك", tr: "rabbine yhalliik", anlam: "Allah razı olsun" }
        ]
      }
    ]
  },
  {
    hafta: 4,
    baslik: "Akıcılığa Doğru",
    dersler: [
      {
        id: "w4d1",
        gun: 1,
        baslik: "Geçmiş Zaman",
        items: [
          { ar: "رحت", tr: "ruht", anlam: "Gittim" },
          { ar: "أكلت", tr: "ekelt", anlam: "Yedim" },
          { ar: "شربت", tr: "şiribt", anlam: "İçtim" },
          { ar: "شفت", tr: "şuft", anlam: "Gördüm" },
          { ar: "عملت إيه امبارح؟", tr: "emelt êh imbeerih?", anlam: "Dün ne yaptın?" },
          { ar: "كنت في البيت", tr: "kunt fil-beyt", anlam: "Evdeydim" },
          { ar: "اشتريت", tr: "iştereyt", anlam: "Satın aldım" },
          { ar: "قابلت صاحبي", tr: "aabilt saahbi", anlam: "Arkadaşımla buluştum" },
          { ar: "اتفرجت على فيلم", tr: "itfarragt ale film", anlam: "Film izledim" },
          { ar: "نمت بدري", tr: "nimt bedri", anlam: "Erken uyudum" }
        ]
      },
      {
        id: "w4d2",
        gun: 2,
        baslik: "Gelecek Zaman ve Planlar",
        items: [
          { ar: "هاروح", tr: "haruuh", anlam: "Gideceğim" },
          { ar: "هاعمل", tr: "haamil", anlam: "Yapacağım" },
          { ar: "هاشوفك بكرة", tr: "haşuufek bukra", anlam: "Yarın görüşürüz" },
          { ar: "عندي ميعاد", tr: "andi miaad", anlam: "Randevum var" },
          { ar: "هاتصل بيك", tr: "hattisil biik", anlam: "Seni arayacağım" },
          { ar: "إيه خططك؟", tr: "êh hutatek?", anlam: "Planların ne?" },
          { ar: "هاسافر مصر", tr: "haseefir masr", anlam: "Mısır'a gideceğim" },
          { ar: "الأسبوع الجاي", tr: "il-usbuu il-gey", anlam: "Gelecek hafta" },
          { ar: "بعدين", tr: "baadeyn", anlam: "Sonra" },
          { ar: "مستني", tr: "mistenni", anlam: "Bekliyorum" }
        ]
      },
      {
        id: "w4d3",
        gun: 3,
        baslik: "Sohbet Kalıpları",
        items: [
          { ar: "إيه الأخبار؟", tr: "êh il-ahbaar?", anlam: "Ne haber?" },
          { ar: "كله تمام", tr: "kullu temeem", anlam: "Her şey yolunda" },
          { ar: "والله؟", tr: "vallaahi?", anlam: "Gerçekten mi?" },
          { ar: "بجد؟", tr: "bigedd?", anlam: "Ciddi misin?" },
          { ar: "طب ماشي", tr: "tab meeşi", anlam: "Peki tamam" },
          { ar: "زي الفل", tr: "zeyy il-full", anlam: "Süperim (yasemin gibi)" },
          { ar: "حاجة جميلة", tr: "haage gemiile", anlam: "Güzel bir şey" },
          { ar: "مش معقول", tr: "miş maa'uul", anlam: "İnanılmaz / olamaz" },
          { ar: "خد بالك من نفسك", tr: "hod beelek min nefsek", anlam: "Kendine iyi bak" },
          { ar: "وحشتني", tr: "vahaştini", anlam: "Seni özledim" }
        ]
      },
      {
        id: "w4d4",
        gun: 4,
        baslik: "Mısır'a Özgü İfadeler",
        items: [
          { ar: "يا باشا", tr: "ye başa", anlam: "Paşam (hitap)" },
          { ar: "يا حبيبي", tr: "ye habiibi", anlam: "Canım / dostum" },
          { ar: "فل الفل", tr: "full il-full", anlam: "Mükemmel" },
          { ar: "على راسي", tr: "ale raasi", anlam: "Başım üstüne" },
          { ar: "ربنا يسهل", tr: "rabbine yisehhil", anlam: "Allah kolaylık versin" },
          { ar: "حاضر", tr: "haadir", anlam: "Tamam / emredersin" },
          { ar: "اتفضل", tr: "itfaddal", anlam: "Buyur" },
          { ar: "براحتك", tr: "biraahtek", anlam: "Keyfine bak / rahatına" },
          { ar: "مية مية", tr: "miyya miyya", anlam: "Yüzde yüz / harika" },
          { ar: "صحيح", tr: "sahiih", anlam: "Doğru / bu arada" }
        ]
      },
      {
        id: "w4d5",
        gun: 5,
        baslik: "Mini Diyaloglar",
        items: [
          { ar: "إزيك؟ عامل إيه؟", tr: "izzeyyek? aamil êh?", anlam: "Nasılsın? Ne yapıyorsun?" },
          { ar: "الحمد لله، تمام", tr: "il-hamdu lilleh, temeem", anlam: "Çok şükür, iyiyim" },
          { ar: "عايز أروح وسط البلد", tr: "aayiz aruuh vist il-beled", anlam: "Şehir merkezine gitmek istiyorum" },
          { ar: "الجو حلو النهارده", tr: "il-gevv hilv in-neharda", anlam: "Bugün hava güzel" },
          { ar: "تحب تشرب إيه؟", tr: "tihibb tişrab êh?", anlam: "Ne içmek istersin?" },
          { ar: "أنا ساكن في القاهرة", tr: "ene seekin fil-kahire", anlam: "Kahire'de yaşıyorum" },
          { ar: "ممكن سؤال؟", tr: "mumkin su'eel?", anlam: "Bir soru sorabilir miyim?" },
          { ar: "مصر أم الدنيا", tr: "masr umm id-dunye", anlam: "Mısır dünyanın anasıdır" },
          { ar: "أشوفك على خير", tr: "eşuufek ale hêr", anlam: "Görüşmek üzere" },
          { ar: "تصبح على خير", tr: "tisbah ale hêr", anlam: "İyi geceler" }
        ]
      }
    ]
  },
  {
    hafta: 5,
    baslik: "Tekrar ve Pekiştirme",
    tekrar: true,
    aciklama: "Hafta 1-2 kelimelerini quiz ve konuşma pratiğiyle pekiştir. Her gün en az 2 quiz çöz, 10 kelimeyi mikrofonla sesli oku."
  },
  {
    hafta: 6,
    baslik: "Tekrar ve Pekiştirme II",
    tekrar: true,
    aciklama: "Hafta 3-4 kelimelerini pekiştir. Çevirmen sekmesinde kendi cümlelerini kur, sesli oku ve telaffuzunu test et."
  },
  {
    hafta: 7,
    baslik: "Serbest Konuşma Pratiği",
    tekrar: true,
    aciklama: "Her gün 5 cümleyi mikrofonla %70+ doğrulukla okumayı hedefle. Mini diyalogları ezbere söylemeye çalış."
  },
  {
    hafta: 8,
    baslik: "Genel Değerlendirme",
    tekrar: true,
    aciklama: "Tüm dersleri karışık quiz modunda çöz. %80+ başarıyla bitirince temel seviyeyi tamamlamış olursun. Mabruuk! (Tebrikler!)"
  }
];

// Günlük hedef tanımları
const GUNLUK_HEDEFLER = [
  { id: "ders", baslik: "Günün dersini bitir", xp: 30 },
  { id: "quiz", baslik: "1 quiz çöz (en az %60)", xp: 20 },
  { id: "konusma", baslik: "3 kelimeyi mikrofonla doğru oku", xp: 30 },
  { id: "dinleme", baslik: "10 kelimeyi sesli dinle", xp: 10 }
];
