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
        baslik: "⭐ Süper Kelimeler — Her Cümlede Duyacakların",
        items: [
          { ar: "يلا", tr: "yalla", anlam: "Hadi / gidelim" },
          { ar: "خلاص", tr: "halaas", anlam: "Tamam / bitti / yeter" },
          { ar: "ماشي", tr: "meeşi", anlam: "Tamam / olur / anlaştık" },
          { ar: "معلش", tr: "maaleş", anlam: "Boş ver / olsun / kusura bakma" },
          { ar: "إن شاء الله", tr: "inşaallah", anlam: "İnşallah" },
          { ar: "الحمد لله", tr: "il-hamdu lilleh", anlam: "Çok şükür" },
          { ar: "يا حبيبي", tr: "ye habiibi", anlam: "Canım / dostum (habibi!)" },
          { ar: "كده", tr: "kide", anlam: "Böyle / öyle / işte" },
          { ar: "بس", tr: "bess", anlam: "Sadece / ama / yeter" },
          { ar: "شوية", tr: "şuvayya", anlam: "Biraz / azıcık" }
        ]
      },
      {
        id: "w1d2",
        gun: 2,
        baslik: "Merhaba Demek",
        items: [
          { ar: "أهلاً", tr: "ehlen", anlam: "Merhaba" },
          { ar: "أهلاً وسهلاً", tr: "ehlen ve sehlen", anlam: "Hoş geldin" },
          { ar: "صباح الخير", tr: "sabaah il-hêr", anlam: "Günaydın" },
          { ar: "صباح النور", tr: "sabaah in-nuur", anlam: "Günaydın (cevap)" },
          { ar: "مساء الخير", tr: "mesee' il-hêr", anlam: "İyi akşamlar" },
          { ar: "إزيك؟", tr: "izzeyyek?", anlam: "Nasılsın? (erkeğe denir)" },
          { ar: "إزيك؟", tr: "izzeyyik?", anlam: "Nasılsın? (kadına denir)" },
          { ar: "كويس", tr: "kuveyyis", anlam: "İyiyim (erkek söyler)" },
          { ar: "كويسة", tr: "kuveyyise", anlam: "İyiyim (kadın söyler)" },
          { ar: "تمام", tr: "temeem", anlam: "İyi / tamam / harika" }
        ]
      },
      {
        id: "w1d3",
        gun: 3,
        baslik: "Vedalaşma ve Nezaket",
        items: [
          { ar: "مع السلامة", tr: "mea's-seleeme", anlam: "Güle güle" },
          { ar: "سلام", tr: "seleem", anlam: "Hoşça kal (gündelik)" },
          { ar: "شكراً", tr: "şukran", anlam: "Teşekkürler" },
          { ar: "ألف شكر", tr: "elf şukr", anlam: "Bin teşekkür" },
          { ar: "العفو", tr: "il-afv", anlam: "Rica ederim" },
          { ar: "من فضلك", tr: "min fadlek", anlam: "Lütfen (erkeğe denir)" },
          { ar: "لو سمحت", tr: "lev semaht", anlam: "Affedersiniz / lütfen" },
          { ar: "آسف", tr: "eesif", anlam: "Üzgünüm (erkek söyler)" },
          { ar: "آسفة", tr: "eesfe", anlam: "Üzgünüm (kadın söyler)" },
          { ar: "مفيش مشكلة", tr: "mefiiş muşkile", anlam: "Sorun değil" }
        ]
      },
      {
        id: "w1d3b",
        gun: 4,
        baslik: "🙏 'Rica Ederim' Demenin 8 Yolu",
        items: [
          { ar: "العفو", tr: "il-afv", anlam: "Rica ederim (en yaygın)" },
          { ar: "عفواً", tr: "afvan", anlam: "Rica ederim / pardon" },
          { ar: "على الرحب والسعة", tr: "ala'r-rahb vis-sea", anlam: "Rica ederim, baş üstüne (çok kibar)" },
          { ar: "أي خدمة", tr: "ayyi hidme", anlam: "Rica ederim / her zaman hizmetindeyim" },
          { ar: "ولا يهمك", tr: "vele yhimmek", anlam: "Rica ederim / takma kafana" },
          { ar: "ده واجبي", tr: "de vegbi", anlam: "Rica ederim, bu benim görevim" },
          { ar: "اتفضل", tr: "itfaddal", anlam: "Buyur (erkeğe denir)" },
          { ar: "اتفضلي", tr: "itfaddali", anlam: "Buyur (kadına denir)" },
          { ar: "تسلم", tr: "tislem", anlam: "Sağ ol / eline sağlık (erkeğe denir)" },
          { ar: "ربنا يكرمك", tr: "rabbine yikramek", anlam: "Allah senden razı olsun (teşekküre cevap)" }
        ]
      },
      {
        id: "w1d4",
        gun: 5,
        baslik: "Kendini Tanıtma",
        items: [
          { ar: "أنا", tr: "ene", anlam: "Ben" },
          { ar: "إنت", tr: "inte", anlam: "Sen (erkeğe denir)" },
          { ar: "إنتي", tr: "inti", anlam: "Sen (kadına denir)" },
          { ar: "اسمي", tr: "ismii", anlam: "Benim adım" },
          { ar: "اسمك إيه؟", tr: "ismek êh?", anlam: "Adın ne? (erkeğe sorulur)" },
          { ar: "أنا من تركيا", tr: "ene min turkiye", anlam: "Ben Türkiye'denim" },
          { ar: "أنا تركي", tr: "ene turki", anlam: "Ben Türküm (erkek söyler)" },
          { ar: "أنا تركية", tr: "ene turkiyye", anlam: "Ben Türküm (kadın söyler)" },
          { ar: "إنت منين؟", tr: "inte mineyn?", anlam: "Nerelisin?" },
          { ar: "تشرفنا", tr: "teşarrafne", anlam: "Memnun oldum" }
        ]
      },
      {
        id: "w1d4b",
        gun: 6,
        baslik: "Evet, Hayır ve Tepkiler",
        items: [
          { ar: "أيوة", tr: "eyve", anlam: "Evet" },
          { ar: "لأ", tr: "le'", anlam: "Hayır" },
          { ar: "طبعاً", tr: "tab'an", anlam: "Tabii ki" },
          { ar: "يمكن", tr: "yimkin", anlam: "Belki" },
          { ar: "ممكن", tr: "mumkin", anlam: "Olabilir / mümkün" },
          { ar: "مش عارف", tr: "miş aarif", anlam: "Bilmiyorum (erkek söyler)" },
          { ar: "مش عارفة", tr: "miş aarfe", anlam: "Bilmiyorum (kadın söyler)" },
          { ar: "والله؟", tr: "vallaahi?", anlam: "Gerçekten mi?" },
          { ar: "بجد؟", tr: "bigedd?", anlam: "Ciddi misin?" },
          { ar: "طب", tr: "tab", anlam: "Peki / o zaman" }
        ]
      },
      {
        id: "w1d5",
        gun: 7,
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
          { ar: "أنا جعان", tr: "ene gaaeen", anlam: "Açım (erkek söyler)" },
          { ar: "أنا عطشان", tr: "ene atşaan", anlam: "Susadım (erkek söyler)" }
        ]
      },
      {
        id: "w2d3",
        gun: 3,
        baslik: "Restoranda",
        items: [
          { ar: "المنيو لو سمحت", tr: "il-menyu lev semaht", anlam: "Menü lütfen" },
          { ar: "عايز", tr: "aayiz", anlam: "İstiyorum (erkek söyler)" },
          { ar: "عايزة", tr: "ayze", anlam: "İstiyorum (kadın söyler)" },
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
          { ar: "ريال", tr: "riyaal", anlam: "Riyal" },
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
          { ar: "مبسوط", tr: "mebsuut", anlam: "Mutlu (erkek için)" },
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
          { ar: "هاسافر الشهر الجاي", tr: "haseefir iş-şahr ig-gey", anlam: "Gelecek ay seyahate çıkacağım" },
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
        baslik: "Her Yerde Geçen Kalıplar",
        items: [
          { ar: "السلام عليكم", tr: "is-seleemu aleykum", anlam: "Selamün aleyküm" },
          { ar: "وعليكم السلام", tr: "ve aleykum is-seleem", anlam: "Aleyküm selam (cevap)" },
          { ar: "الله يعطيك العافية", tr: "allah yatiik il-aafye", anlam: "Kolay gelsin (çok yaygın)" },
          { ar: "يا أخي", tr: "ye ahi", anlam: "Kardeşim (hitap)" },
          { ar: "حاضر", tr: "haadir", anlam: "Tamam / emredersin" },
          { ar: "على راسي", tr: "ale raasi", anlam: "Başım üstüne" },
          { ar: "ربنا يسهل", tr: "rabbine yisehhil", anlam: "Allah kolaylık versin" },
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
          { ar: "أنا ساكن في الرياض", tr: "ene seekin fir-riyaad", anlam: "Riyad'da yaşıyorum" },
          { ar: "ممكن سؤال؟", tr: "mumkin su'eel?", anlam: "Bir soru sorabilir miyim?" },
          { ar: "إن شاء الله نتقابل تاني", tr: "inşaallah nit'aabil teeni", anlam: "İnşallah yine görüşürüz" },
          { ar: "أشوفك على خير", tr: "eşuufek ale hêr", anlam: "Görüşmek üzere" },
          { ar: "تصبح على خير", tr: "tisbah ale hêr", anlam: "İyi geceler" }
        ]
      }
    ]
  },
  {
    hafta: 5,
    baslik: "İş Hayatı (Ofis)",
    dersler: [
      {
        id: "w5d1",
        gun: 1,
        baslik: "İşte İlk Gün",
        items: [
          { ar: "أنا الموظف الجديد", tr: "ene il-muvazzaf ig-gediid", anlam: "Ben yeni çalışanım" },
          { ar: "شركة", tr: "şirke", anlam: "Şirket" },
          { ar: "مكتب", tr: "mekteb", anlam: "Ofis" },
          { ar: "مدير", tr: "mudiir", anlam: "Müdür" },
          { ar: "زميل", tr: "zemiil", anlam: "İş arkadaşı (erkek için)" },
          { ar: "زميلة", tr: "zemiile", anlam: "İş arkadaşı (kadın için)" },
          { ar: "شغل", tr: "şuğl", anlam: "İş" },
          { ar: "باشتغل مهندسة", tr: "beştağal muhendise", anlam: "Mühendis olarak çalışıyorum (kadın söyler)" },
          { ar: "فرصة سعيدة", tr: "fursa saiide", anlam: "Tanıştığımıza memnun oldum" },
          { ar: "أتمنى نشتغل سوا كويس", tr: "etmenne niştağal seve kuveyyis", anlam: "Umarım iyi çalışırız birlikte" }
        ]
      },
      {
        id: "w5d2",
        gun: 2,
        baslik: "Toplantı ve Randevu",
        items: [
          { ar: "اجتماع", tr: "igtimee", anlam: "Toplantı" },
          { ar: "عندنا اجتماع بكرة", tr: "andine igtimee bukra", anlam: "Yarın toplantımız var" },
          { ar: "الساعة كام؟", tr: "is-seea keem?", anlam: "Saat kaçta?" },
          { ar: "الساعة عشرة الصبح", tr: "is-seea aşara is-subh", anlam: "Sabah saat onda" },
          { ar: "ميعاد", tr: "miaad", anlam: "Randevu" },
          { ar: "متأخر", tr: "mit'ahhar", anlam: "Geç kalmış" },
          { ar: "آسفة على التأخير", tr: "eesfe alet-te'hiir", anlam: "Geciktiğim için üzgünüm" },
          { ar: "نبدأ؟", tr: "nibde'?", anlam: "Başlayalım mı?" },
          { ar: "عندي سؤال", tr: "andi su'eel", anlam: "Bir sorum var" },
          { ar: "اتفقنا", tr: "ittefa'ne", anlam: "Anlaştık" }
        ]
      },
      {
        id: "w5d3",
        gun: 3,
        baslik: "Ofiste Günlük İletişim",
        items: [
          { ar: "ممكن تساعدني؟", tr: "mumkin tiseeidni?", anlam: "Bana yardım edebilir misin?" },
          { ar: "ابعتلي إيميل", tr: "ibatli iimeyl", anlam: "Bana e-posta gönder" },
          { ar: "هابعتلك الملف", tr: "habatlek il-melaff", anlam: "Sana dosyayı göndereceğim" },
          { ar: "خلصت الشغل", tr: "hallast iş-şuğl", anlam: "İşi bitirdim" },
          { ar: "محتاج وقت كمان", tr: "mihteeg va't kemeen", anlam: "Daha fazla zamana ihtiyacım var" },
          { ar: "مشروع", tr: "meşruu", anlam: "Proje" },
          { ar: "تقرير", tr: "ta'riir", anlam: "Rapor" },
          { ar: "تمام كده؟", tr: "temeem kide?", anlam: "Böyle tamam mı?" },
          { ar: "شغل ممتاز", tr: "şuğl mumteez", anlam: "Mükemmel iş" },
          { ar: "استراحة", tr: "istiraaha", anlam: "Mola" }
        ]
      },
      {
        id: "w5d4",
        gun: 4,
        baslik: "Telefon ve Yazışma",
        items: [
          { ar: "ألو", tr: "alo", anlam: "Alo" },
          { ar: "مين معايا؟", tr: "miin maaye?", anlam: "Kiminle görüşüyorum?" },
          { ar: "ثانية واحدة", tr: "senye vahde", anlam: "Bir saniye" },
          { ar: "هو مش موجود", tr: "huvve miş mevguud", anlam: "Kendisi yerinde yok" },
          { ar: "اتصل تاني بعدين", tr: "ittisil teeni baadeyn", anlam: "Sonra tekrar ara" },
          { ar: "هاتصل بحضرتك", tr: "hattisil bihadritek", anlam: "Sizi arayacağım (kibarca)" },
          { ar: "رقم تليفونك كام؟", tr: "ra'm tilifonek keem?", anlam: "Telefon numaran kaç?" },
          { ar: "ممكن تبعت رسالة؟", tr: "mumkin tibat riseele?", anlam: "Mesaj gönderebilir misin?" },
          { ar: "وصلت الرسالة", tr: "vislit ir-riseele", anlam: "Mesaj ulaştı" },
          { ar: "شكراً على وقتك", tr: "şukran ale va'tek", anlam: "Zamanın için teşekkürler" }
        ]
      },
      {
        id: "w5d5",
        gun: 5,
        baslik: "İş Nezaketi ve Kalıplar",
        items: [
          { ar: "حضرتك", tr: "hadritek", anlam: "Siz (kibar hitap)" },
          { ar: "لو سمحت يا أستاذ", tr: "lev semaht ye usteez", anlam: "Affedersiniz beyefendi" },
          { ar: "يا مدام", tr: "ye medeem", anlam: "Hanımefendi (hitap)" },
          { ar: "من غير زحمة", tr: "min ğêr zahme", anlam: "Zahmet olmazsa" },
          { ar: "تحت أمرك", tr: "taht amrek", anlam: "Emrinizdeyim" },
          { ar: "مفيش مانع", tr: "mefiiş meenia", anlam: "Sakıncası yok" },
          { ar: "إجازة", tr: "ageeze", anlam: "İzin / tatil" },
          { ar: "عايزة إجازة بكرة", tr: "ayze ageeze bukra", anlam: "Yarın izin istiyorum (kadın söyler)" },
          { ar: "مرتب", tr: "murattab", anlam: "Maaş" },
          { ar: "ربنا يوفقك", tr: "rabbine yveffa'ek", anlam: "Allah başarı versin" }
        ]
      }
    ]
  },
  {
    hafta: 6,
    baslik: "Tekrar ve Pekiştirme",
    tekrar: true,
    aciklama: "Hafta 1-3 kelimelerini quiz ve konuşma pratiğiyle pekiştir. Çevirmen sekmesinde kendi cümlelerini kur, sesli oku ve telaffuzunu test et."
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

// XP seviye sistemi
const SEVIYELER = [
  { xp: 0, ad: "Yeni Başlayan", ikon: "🐣" },
  { xp: 100, ad: "Turist", ikon: "🧳" },
  { xp: 300, ad: "Sokak Bilgesi", ikon: "🕶️" },
  { xp: 600, ad: "Pazarlık Ustası", ikon: "🛍️" },
  { xp: 1000, ad: "Sohbet Ehli", ikon: "☕" },
  { xp: 1500, ad: "Ofis Profesyoneli", ikon: "💼" },
  { xp: 2200, ad: "Arapça Uzmanı", ikon: "🏆" },
  { xp: 3000, ad: "Yarı Arap", ikon: "👑" }
];

// Sesli diyalog pratiği — uygulama karşı tarafı seslendirir, sen kendi repliğini söylersin
const DIYALOGLAR = [
  {
    id: "dlg1",
    baslik: "☕ Kafede Sipariş",
    seviye: "Kolay",
    adimlar: [
      { rol: "app", kisi: "Garson", ar: "أهلاً، تحب تشرب إيه؟", tr: "ehlen, tihibb tişrab êh?", anlam: "Merhaba, ne içmek istersin?" },
      { rol: "sen", ar: "عايز قهوة لو سمحت", tr: "aayiz ahve lev semaht", anlam: "Kahve istiyorum lütfen" },
      { rol: "app", kisi: "Garson", ar: "بسكر ولا من غير سكر؟", tr: "bisukker velle min ğêr sukker?", anlam: "Şekerli mi şekersiz mi?" },
      { rol: "sen", ar: "من غير سكر", tr: "min ğêr sukker", anlam: "Şekersiz" },
      { rol: "app", kisi: "Garson", ar: "حاضر، ثانية واحدة", tr: "haadir, senye vahde", anlam: "Tamam, bir saniye" },
      { rol: "sen", ar: "شكراً", tr: "şukran", anlam: "Teşekkürler" }
    ]
  },
  {
    id: "dlg2",
    baslik: "🚕 Takside",
    seviye: "Kolay",
    adimlar: [
      { rol: "app", kisi: "Şoför", ar: "رايح فين؟", tr: "raayih feyn?", anlam: "Nereye gidiyorsun?" },
      { rol: "sen", ar: "عايز أروح وسط البلد", tr: "aayiz aruuh vist il-beled", anlam: "Şehir merkezine gitmek istiyorum" },
      { rol: "app", kisi: "Şoför", ar: "ماشي، اتفضل", tr: "meeşi, itfaddal", anlam: "Tamam, buyur" },
      { rol: "sen", ar: "بكام؟", tr: "bikeem?", anlam: "Kaça?" },
      { rol: "app", kisi: "Şoför", ar: "خمسين ريال", tr: "hamsiin riyaal", anlam: "Elli riyal" },
      { rol: "sen", ar: "غالي أوي! تلاتين ماشي؟", tr: "ğaali evi! teleetiin meeşi?", anlam: "Çok pahalı! Otuz olur mu?" },
      { rol: "app", kisi: "Şoför", ar: "ماشي يا صاحبي", tr: "meeşi ye saahbi", anlam: "Tamam dostum" }
    ]
  },
  {
    id: "dlg3",
    baslik: "💼 Ofiste İlk Gün",
    seviye: "Orta",
    adimlar: [
      { rol: "app", kisi: "İş arkadaşı", ar: "أهلاً وسهلاً! إنت الموظف الجديد؟", tr: "ehlen ve sehlen! inte il-muvazzaf ig-gediid?", anlam: "Hoş geldin! Yeni çalışan sen misin?" },
      { rol: "sen", ar: "أيوة، أنا من تركيا", tr: "eyve, ene min turkiye", anlam: "Evet, ben Türkiye'denim" },
      { rol: "app", kisi: "İş arkadaşı", ar: "تشرفنا! اسمك إيه؟", tr: "teşarrafne! ismek êh?", anlam: "Memnun oldum! Adın ne?" },
      { rol: "sen", ar: "اسمي سنم، فرصة سعيدة", tr: "ismii Senem, fursa saiide", anlam: "Adım Senem, memnun oldum" },
      { rol: "app", kisi: "İş arkadaşı", ar: "تحب تشرب شاي؟", tr: "tihibb tişrab şeey?", anlam: "Çay içmek ister misin?" },
      { rol: "sen", ar: "أيوة، شكراً", tr: "eyve, şukran", anlam: "Evet, teşekkürler" },
      { rol: "app", kisi: "İş arkadaşı", ar: "أتمنى نشتغل سوا كويس", tr: "etmenne niştağal seve kuveyyis", anlam: "Umarım birlikte iyi çalışırız" },
      { rol: "sen", ar: "إن شاء الله", tr: "inşaallah", anlam: "İnşallah" }
    ]
  },
  {
    id: "dlg4",
    baslik: "🤝 Toplantıda",
    seviye: "Orta",
    adimlar: [
      { rol: "app", kisi: "Müdür", ar: "صباح الخير، نبدأ؟", tr: "sabaah il-hêr, nibde'?", anlam: "Günaydın, başlayalım mı?" },
      { rol: "sen", ar: "صباح النور، ماشي", tr: "sabaah in-nuur, meeşi", anlam: "Günaydın, tamam" },
      { rol: "app", kisi: "Müdür", ar: "خلصت التقرير؟", tr: "hallast it-ta'riir?", anlam: "Raporu bitirdin mi?" },
      { rol: "sen", ar: "أيوة، هابعتلك الملف", tr: "eyve, habatlek il-melaff", anlam: "Evet, sana dosyayı göndereceğim" },
      { rol: "app", kisi: "Müdür", ar: "شغل ممتاز!", tr: "şuğl mumteez!", anlam: "Mükemmel iş!" },
      { rol: "sen", ar: "شكراً على وقتك", tr: "şukran ale va'tek", anlam: "Zamanın için teşekkürler" }
    ]
  }
];

// 🆘 Cep Rehberi — gerçek hayatta anında kullan: dokun, telefon senin yerine konuşsun
const CEP_REHBERI = [
  {
    kategori: "🚨 Acil Durum",
    ifadeler: [
      { ar: "ساعدني!", tr: "saaidni!", anlam: "Bana yardım edin!" },
      { ar: "اتصل بالإسعاف", tr: "ittisil bil-is'aaf", anlam: "Ambulans çağırın" },
      { ar: "اتصل بالبوليس", tr: "ittisil bil-boliis", anlam: "Polis çağırın" },
      { ar: "أنا تايه", tr: "ene teeyih", anlam: "Kayboldum" },
      { ar: "أنا عيان، محتاج دكتور", tr: "ene ayyeen, mihteeg duktoor", anlam: "Hastayım, doktora ihtiyacım var" },
      { ar: "ضاع باسبوري", tr: "daa basboori", anlam: "Pasaportum kayboldu" },
      { ar: "فين أقرب مستشفى؟", tr: "feyn a'rab mustaşfe?", anlam: "En yakın hastane nerede?" }
    ]
  },
  {
    kategori: "🚕 Taksi ve Yol",
    ifadeler: [
      { ar: "عايز أروح المطار", tr: "aayiz aruuh il-mataar", anlam: "Havalimanına gitmek istiyorum" },
      { ar: "وقف هنا لو سمحت", tr: "ve''af hine lev semaht", anlam: "Burada durun lütfen" },
      { ar: "على طول", tr: "ale tuul", anlam: "Düz git" },
      { ar: "يمين", tr: "yimiin", anlam: "Sağa" },
      { ar: "شمال", tr: "şimeel", anlam: "Sola" },
      { ar: "شغل العداد لو سمحت", tr: "şağğal il-addeed lev semaht", anlam: "Taksimetreyi açın lütfen" },
      { ar: "أنا مستعجل", tr: "ene mistaagil", anlam: "Acelem var" }
    ]
  },
  {
    kategori: "🍽️ Restoran",
    ifadeler: [
      { ar: "المنيو لو سمحت", tr: "il-menyu lev semaht", anlam: "Menü lütfen" },
      { ar: "إيه أحسن حاجة عندكم؟", tr: "êh ahsen haage andukum?", anlam: "En iyi yemeğiniz ne?" },
      { ar: "أنا مش باكل لحمة", tr: "ene miş beekul lahme", anlam: "Et yemiyorum" },
      { ar: "من غير حاجة حارة", tr: "min ğêr haage harra", anlam: "Acısız olsun" },
      { ar: "مية معدنية لو سمحت", tr: "mayya maadaniyya lev semaht", anlam: "Maden suyu / şişe su lütfen" },
      { ar: "الحساب لو سمحت", tr: "il-hiseeb lev semaht", anlam: "Hesap lütfen" },
      { ar: "الأكل لذيذ أوي", tr: "il-ekl leziiz evi", anlam: "Yemek çok lezzetli" }
    ]
  },
  {
    kategori: "🛍️ Alışveriş",
    ifadeler: [
      { ar: "بكام ده؟", tr: "bikeem de?", anlam: "Bu kaça?" },
      { ar: "غالي أوي، خليه أرخص", tr: "ğaali evi, halliih arhas", anlam: "Çok pahalı, biraz indirin" },
      { ar: "ممكن أجرب؟", tr: "mumkin agarrab?", anlam: "Deneyebilir miyim?" },
      { ar: "عندك مقاس أكبر؟", tr: "andek ma'aas ekber?", anlam: "Daha büyük bedeni var mı?" },
      { ar: "هاخد ده", tr: "haahod de", anlam: "Bunu alıyorum" },
      { ar: "ممكن أدفع بالكارت؟", tr: "mumkin edfa bil-kart?", anlam: "Kartla ödeyebilir miyim?" },
      { ar: "بس باتفرج", tr: "bess betfarrag", anlam: "Sadece bakıyorum" }
    ]
  },
  {
    kategori: "💼 Ofis",
    ifadeler: [
      { ar: "ممكن تساعدني؟", tr: "mumkin tiseeidni?", anlam: "Bana yardım edebilir misin?" },
      { ar: "ممكن تتكلم بشويش؟", tr: "mumkin titkellim bişviiş?", anlam: "Yavaş konuşabilir misin?" },
      { ar: "هاتصل بحضرتك بعدين", tr: "hattisil bihadritek baadeyn", anlam: "Sizi sonra arayacağım" },
      { ar: "ابعتلي إيميل لو سمحت", tr: "ibatli iimeyl lev semaht", anlam: "Bana e-posta gönderin lütfen" },
      { ar: "عندنا اجتماع امتى؟", tr: "andine igtimee imte?", anlam: "Toplantımız ne zaman?" },
      { ar: "محتاجة وقت كمان", tr: "mihteege va't kemeen", anlam: "Daha fazla zamana ihtiyacım var (kadın söyler)" },
      { ar: "اتفقنا", tr: "ittefa'ne", anlam: "Anlaştık" }
    ]
  },
  {
    kategori: "🙏 Nezaket",
    ifadeler: [
      { ar: "أنا مش بتكلم عربي كويس", tr: "ene miş betkellim arabi kuveyyis", anlam: "İyi Arapça konuşamıyorum" },
      { ar: "ممكن تقول تاني؟", tr: "mumkin ti'uul teeni?", anlam: "Tekrar söyler misiniz?" },
      { ar: "متشكر أوي", tr: "mutşekkir evi", anlam: "Çok teşekkür ederim" },
      { ar: "معلش، آسف", tr: "maaleş, eesif", anlam: "Kusura bakmayın, üzgünüm" },
      { ar: "بعد إذنك", tr: "baad iznek", anlam: "İzninizle" },
      { ar: "ربنا يخليك", tr: "rabbine yhalliik", anlam: "Allah razı olsun" },
      { ar: "أنا من تركيا", tr: "ene min turkiye", anlam: "Ben Türkiye'denim" }
    ]
  }
];
