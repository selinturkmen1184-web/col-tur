"use client";

import { FormEvent, useMemo, useState } from "react";

type Tour = {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  highlights: string[];
};

const tours: Tour[] = [
  {
    id: 1,
    title: "Kaleiçi, Düden Şelalesi & Tekne Turu",
    location: "Antalya Merkez",
    category: "Şehir Turları",
    duration: "Tam gün",
    price: 990,
    badge: "Şehir & Deniz",
    image: "./images/lara/antalya-duden.jpg",
    highlights: ["Otel transferi", "Öğle yemeği"],
  },
  {
    id: 2,
    title: "Suluada'nın Turkuaz Koyları",
    location: "Adrasan",
    category: "Tekne Turları",
    duration: "7 saat",
    price: 1150,
    badge: "Turkuaz Rota",
    image: "./images/lara/adrasan-koy.jpg",
    highlights: ["3 yüzme molası", "Teknede öğle yemeği"],
  },
  {
    id: 3,
    title: "Pamukkale & Hierapolis Keşfi",
    location: "Antalya çıkışlı",
    category: "Kültür",
    duration: "Tam gün",
    price: 1850,
    badge: "Kültür Rotası",
    image: "./images/lara/pamukkale.jpg",
    highlights: ["Profesyonel rehber", "Açık büfe öğle yemeği"],
  },
  {
    id: 4,
    title: "Gün Batımında Akdeniz Tekne Turu",
    location: "Kemer",
    category: "Tekne Turları",
    duration: "4 saat",
    price: 1350,
    image: "./images/coast-sunset.jpg",
    highlights: ["Gün batımı rotası", "Meyve & içecek"],
  },
  {
    id: 5,
    title: "Kaş & Kaputaş Sahil Rotası",
    location: "Kaş",
    category: "Doğa",
    duration: "Tam gün",
    price: 1490,
    badge: "Sahil Rotası",
    image: "./images/kas.jpg",
    highlights: ["Küçük grup", "Fotoğraf molaları"],
  },
  {
    id: 6,
    title: "Alanya Kalesi & Akdeniz Koyları",
    location: "Alanya",
    category: "Şehir Turları",
    duration: "8 saat",
    price: 1250,
    image: "./images/boats.jpg",
    highlights: ["Kale gezisi", "Tekne turu"],
  },
];

const categories = ["Tümü", "Şehir Turları", "Tekne Turları", "Kültür", "Doğa"];

const laraRoutes = [
  {
    title: "Antalya Şehir Turu",
    note: "Düden Şelalesi · Kaleiçi · tekne gezisi",
    image: "./images/lara/antalya-duden.jpg",
    alt: "Antalya Düden Şelalesi ve şehir manzarası",
    className: "gallery-wide",
  },
  {
    title: "Adrasan & Suluada",
    note: "Turkuaz koylarda yüzme molaları",
    image: "./images/lara/suluada-ada.jpg",
    alt: "Suluada kıyısında tur tekneleri ve turkuaz deniz",
    className: "gallery-tall",
  },
  {
    title: "Antalya Akvaryum",
    note: "Ailece su altı dünyasını keşif",
    image: "./images/lara/antalya-akvaryum.jpg",
    alt: "Antalya Akvaryum su altı tünelinde balina köpek balığı",
    className: "",
  },
  {
    title: "Perge, Aspendos & Side",
    note: "Antik kentler arasında kültür rotası",
    image: "./images/lara/perge-aspendos.jpg",
    alt: "Perge Antik Kenti sütunlu caddesi",
    className: "",
  },
  {
    title: "Demre, Myra & Kekova",
    note: "Tarih ve denizin buluştuğu rota",
    image: "./images/lara/demre-kekova.jpg",
    alt: "Kekova kıyısındaki tarihi yerleşim ve deniz",
    className: "gallery-wide",
  },
  {
    title: "Kapadokya",
    note: "Antalya çıkışlı masalsı yolculuk",
    image: "./images/lara/kapadokya.jpg",
    alt: "Kapadokya vadisinde kalp şeklindeki fotoğraf noktası",
    className: "",
  },
  {
    title: "Yunus Gösterisi",
    note: "Lara’da su dünyası deneyimi",
    image: "./images/lara/yunus-gosterisi.jpg",
    alt: "Yunuslarla su altı deneyimi",
    className: "",
  },
  {
    title: "Özel Balık Avı",
    note: "Akdeniz’de ekipmanlı tekne turu",
    image: "./images/lara/balik-avi.jpg",
    alt: "Akdeniz balık avı teknesinde tutulan balıklar",
    className: "",
  },
  {
    title: "Korsan Tekne Turu",
    note: "Düden Şelalesi önünde eğlenceli deniz rotası",
    image: "./images/lara/korsan-tekne.jpg",
    alt: "Düden Şelalesi önünde korsan temalı tur teknesi",
    className: "gallery-wide",
  },
  {
    title: "Green Canyon",
    note: "Kanyon manzarasında sakin tekne gezisi",
    image: "./images/lara/green-canyon.jpg",
    alt: "Green Canyon içinde tur teknesi",
    className: "",
  },
  {
    title: "At Safari",
    note: "Çam ormanında rehberli doğa deneyimi",
    image: "./images/lara/at-safari.jpg",
    alt: "Çam ormanında at safari deneyimi",
    className: "",
  },
  {
    title: "Jeep Safari",
    note: "Toroslar’da macera ve eğlence",
    image: "./images/lara/jeep-safari.jpg",
    alt: "Toroslar rotasında yeşil safari araçları",
    className: "",
  },
  {
    title: "Kemer Mega Star",
    note: "Koylar ve yüzme molalarıyla tam gün",
    image: "./images/lara/kemer-mega-star.jpg",
    alt: "Kemer kıyısında Mega Star tur teknesi",
    className: "gallery-wide",
  },
  {
    title: "The Land of Legends",
    note: "Su parkı ve tema parkında tam gün",
    image: "./images/lara/land-of-legends.jpg",
    alt: "The Land of Legends su parkı ve kaydırakları",
    className: "gallery-wide",
  },
  {
    title: "Land of Lions",
    note: "Vahşi yaşamı yakından keşfet",
    image: "./images/lara/land-of-lions.jpg",
    alt: "Land of Lions yaşam parkında timsah",
    className: "",
  },
  {
    title: "Pamukkale & Hierapolis",
    note: "Beyaz travertenler ve antik kent",
    image: "./images/lara/pamukkale.jpg",
    alt: "Pamukkale beyaz travertenleri ve termal havuzları",
    className: "",
  },
  {
    title: "Yamaç Paraşütü",
    note: "Alanya kıyılarının üzerinde tandem uçuş",
    image: "./images/lara/yamac-parasutu.jpg",
    alt: "Alanya kıyıları üzerinde tandem yamaç paraşütü",
    className: "gallery-tall",
  },
  {
    title: "Peloid Türk Hamamı",
    note: "Hamam, sauna ve dinlenme deneyimi",
    image: "./images/lara/peloid-hamam.jpg",
    alt: "Peloid Türk hamamı dinlenme alanı",
    className: "",
  },
  {
    title: "Köprülü Kanyon Rafting",
    note: "Doğanın içinde yüksek enerjili macera",
    image: "./images/lara/rafting.jpg",
    alt: "Köprülü Kanyon'da rafting yapan grup",
    className: "gallery-wide",
  },
  {
    title: "Rafting & Buggy Combo",
    note: "Tek günde iki farklı macera",
    image: "./images/lara/rafting-buggy-combo.jpg",
    alt: "Doğa parkurunda buggy safari aracı",
    className: "",
  },
  {
    title: "Relax Tekne Turu",
    note: "Düden Şelalesi manzarasında sakin rota",
    image: "./images/lara/relax-boat.jpg",
    alt: "Düden Şelalesi önünde gezi teknesi",
    className: "gallery-wide",
  },
  {
    title: "Scuba Diving",
    note: "Eğitmen eşliğinde Akdeniz’in altını keşfet",
    image: "./images/lara/scuba-diving.jpg",
    alt: "Akdeniz'de tüplü dalış yapan misafir",
    className: "gallery-tall",
  },
  {
    title: "Türk Hamamı",
    note: "Köpük masajı ve geleneksel bakım",
    image: "./images/lara/turk-hamami.jpg",
    alt: "Türk hamamı masaj ve bakım odası",
    className: "",
  },
];

const faqs = [
  {
    question: "Antalya turlarına otel transferi dahil mi?",
    answer: "Transfer kapsamı tura ve konakladığınız bölgeye göre değişir. Rezervasyon talebinizden sonra alınış bölgesi, saat ve varsa ek ücret size yazılı olarak bildirilir.",
  },
  {
    question: "Antalya tur rezervasyonu nasıl yapılır?",
    answer: "Beğendiğiniz turu seçip tarih, kişi sayısı ve iletişim bilgilerinizi gönderin. Col Tur ekibi müsaitliği ve kesin fiyatı kontrol ederek rezervasyon onayını e-posta üzerinden paylaşır.",
  },
  {
    question: "Tekne turlarına çocuklar katılabilir mi?",
    answer: "Birçok tekne turu aileler için uygundur. Yaş sınırı, çocuk fiyatı, bebek arabası ve güvenlik ekipmanı bilgileri seçilen tekneye göre rezervasyon öncesinde teyit edilir.",
  },
  {
    question: "Tur tarihini değiştirebilir veya iptal edebilir miyim?",
    answer: "Değişiklik ve iptal koşulları tura göre farklılık gösterebilir. Kesin rezervasyondan önce geçerli koşullar açıkça paylaşılır ve onayınız alınır.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://coltur.com.tr/#organization",
      name: "Col Tur",
      url: "https://coltur.com.tr/",
      image: "https://coltur.com.tr/og-v2.png",
      email: "rezervasyon@coltur.com.tr",
      areaServed: ["Antalya", "Kemer", "Alanya", "Kaş", "Adrasan"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Antalya",
        addressCountry: "TR",
      },
      priceRange: "₺₺",
      description: "Antalya çıkışlı şehir, tekne, doğa ve kültür turları için yerel rezervasyon hizmeti.",
    },
    {
      "@type": "WebSite",
      "@id": "https://coltur.com.tr/#website",
      url: "https://coltur.com.tr/",
      name: "Col Tur",
      inLanguage: "tr-TR",
      publisher: { "@id": "https://coltur.com.tr/#organization" },
    },
    {
      "@type": "ItemList",
      name: "Antalya Turları",
      itemListElement: tours.map((tour, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TouristTrip",
          name: tour.title,
          image: `https://coltur.com.tr/${tour.image.replace("./", "")}`,
          description: `${tour.location} · ${tour.duration.toLocaleLowerCase("tr-TR")} ${tour.category.toLocaleLowerCase("tr-TR")} deneyimi.`,
          touristType: ["Aileler", "Çiftler", "Arkadaş grupları"],
          offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            price: tour.price,
            url: "https://coltur.com.tr/#turlar",
          },
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [travellers, setTravellers] = useState(2);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const filteredTours = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    return tours.filter((tour) => {
      const matchesCategory = category === "Tümü" || tour.category === category;
      const matchesSearch =
        !term ||
        `${tour.title} ${tour.location} ${tour.category}`.toLocaleLowerCase("tr").includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.querySelector("#turlar")?.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = (tour: Tour) => {
    setSelectedTour(tour);
    setBookingStatus("idle");
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTour || bookingStatus === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      tour: selectedTour.title,
      date: String(data.get("date") || ""),
      travellers,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      note: String(data.get("note") || ""),
      website: String(data.get("website") || ""),
    };

    setBookingStatus("sending");
    try {
      const response = await fetch("/booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Booking request failed");
      setBookingStatus("sent");
    } catch {
      setBookingStatus("error");
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="announcement">
        <div className="container announcement-inner">
          <span>Antalya’da seçili turlarda ücretsiz otel transferi</span>
          <span className="announcement-proof">Yerel ekip · Güvenli talep · Hızlı müsaitlik yanıtı</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#anasayfa" aria-label="Col Tur ana sayfa">
            <span className="brand-mark" aria-hidden="true"><span>c</span></span>
            <span className="brand-name">col<span>tur</span></span>
          </a>

          <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"} aria-label="Ana menü">
            <a href="#turlar" onClick={() => setMenuOpen(false)}>Turlar</a>
            <a href="#galeri" onClick={() => setMenuOpen(false)}>Tur Galerisi</a>
            <a href="#rota" onClick={() => setMenuOpen(false)}>Antalya Rotası</a>
            <a href="#neden-biz" onClick={() => setMenuOpen(false)}>Neden Col Tur?</a>
            <a href="#sss" onClick={() => setMenuOpen(false)}>Sık Sorulanlar</a>
          </nav>

          <div className="nav-actions">
            <a className="nav-cta" href="#turlar">Turunu Bul</a>
            <button
              className="menu-toggle"
              type="button"
              aria-label="Menüyü aç veya kapat"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="anasayfa">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">ANTALYA’YI BİZİMLE KEŞFET</span>
            <h1>Akdeniz’in en güzel hâline <em>yakından bak.</em></h1>
            <p>Kalabalığı değil, anı takip eden küçük gruplar; bölgeyi seven rehberler ve sonradan sürpriz çıkarmayan net fiyatlar.</p>
            <div className="hero-trust">
              <div className="trust-seal" aria-hidden="true">✓</div>
              <div><strong>Net fiyat, açık koşullar</strong><span>Kesin rezervasyondan önce yazılı teyit</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <img src="./images/lara/antalya-duden-hero.jpg" alt="Antalya Düden Şelalesi ve Akdeniz kıyısı" width="1200" height="1799" fetchPriority="high" />
            <div className="hero-stamp"><strong>COL</strong><span>yerel rota</span></div>
            <div className="hero-caption"><span>01</span><div><strong>Düden, Antalya</strong><small>Şehrin denizle buluştuğu yer</small></div></div>
          </div>
        </div>

        <div className="container search-shell">
          <form className="tour-search" onSubmit={handleSearch}>
            <label className="search-field search-field-wide">
              <span>Nereye?</span>
              <div><span aria-hidden="true">⌖</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tur veya bölge ara" /></div>
            </label>
            <label className="search-field">
              <span>Ne zaman?</span>
              <div><span aria-hidden="true">□</span><input type="date" aria-label="Tur tarihi" /></div>
            </label>
            <label className="search-field">
              <span>Kaç kişi?</span>
              <div><span aria-hidden="true">◯</span><select aria-label="Kişi sayısı" defaultValue="2"><option value="1">1 kişi</option><option value="2">2 kişi</option><option value="3">3 kişi</option><option value="4">4+ kişi</option></select></div>
            </label>
            <button className="search-button" type="submit"><span aria-hidden="true">⌕</span> Turları Ara</button>
          </form>
        </div>
      </section>

      <section className="trust-strip" aria-label="Col Tur güvenceleri">
        <div className="container trust-grid">
          <div><span>✓</span><div><strong>Değişiklik desteği</strong><small>Tur koşullarına göre</small></div></div>
          <div><span>₺</span><div><strong>Açık fiyatlandırma</strong><small>Ödeme öncesi yazılı teyit</small></div></div>
          <div><span>☀</span><div><strong>Yerel rota uzmanları</strong><small>Antalya’yı yaşayan ekip</small></div></div>
          <div><span>↗</span><div><strong>Hızlı destek</strong><small>Tur öncesi ve sırasında</small></div></div>
        </div>
      </section>

      <section className="tours-section section" id="turlar">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">SENİN İÇİN SEÇTİK</span><h2>Antalya’nın favori deneyimleri</h2></div>
            <p>Kıyıdan antik kentlere, bir güne sığan ama uzun süre akılda kalan rotalar.</p>
          </div>

          <div className="category-row" role="group" aria-label="Tur kategorileri">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>

          {filteredTours.length ? (
            <div className="tour-grid">
              {filteredTours.map((tour) => (
                <article className="tour-card" key={tour.id}>
                  <div className="card-image">
                    <img src={tour.image} alt={tour.title} loading="lazy" decoding="async" width="1400" height="933" />
                    {tour.badge && <span className="card-badge">{tour.badge}</span>}
                  </div>
                  <div className="card-body">
                    <div className="card-meta"><span>{tour.location}</span><span>Müsaitlik teyitli</span></div>
                    <h3>{tour.title}</h3>
                    <div className="tour-features"><span>◷ {tour.duration}</span><span>● {tour.category}</span></div>
                    <div className="highlight-list">{tour.highlights.map((highlight) => <span key={highlight}>✓ {highlight}</span>)}</div>
                    <div className="card-footer">
                      <div><small>Kişi başı başlangıç</small><div>{tour.oldPrice && <del>₺{tour.oldPrice.toLocaleString("tr-TR")}</del>}<strong>₺{tour.price.toLocaleString("tr-TR")}</strong></div></div>
                      <button type="button" onClick={() => openBooking(tour)}>İncele</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><strong>Bu aramaya uygun tur bulamadık.</strong><span>Başka bir bölge veya kategori deneyebilirsin.</span></div>
          )}
        </div>
      </section>

      <section className="gallery-section section" id="galeri" aria-labelledby="gallery-title">
        <div className="container">
          <div className="section-heading gallery-heading">
            <div><span className="eyebrow">LARA ÇIKIŞLI ROTALAR</span><h2 id="gallery-title">Gitmeden önce manzaraya göz at.</h2></div>
            <p>Tur arşivinden seçilen rota fotoğraflarıyla Antalya ve çevresinde seni bekleyen deneyimleri keşfet.</p>
          </div>
          <div className="gallery-grid">
            {laraRoutes.map((route) => (
              <a className={`gallery-card ${route.className}`.trim()} href="#turlar" key={route.title} aria-label={`${route.title} turunu incele`}>
                <img src={route.image} alt={route.alt} loading="lazy" decoding="async" width="1600" height="1067" />
                <span className="gallery-shade" aria-hidden="true" />
                <span className="gallery-copy"><strong>{route.title}</strong><small>{route.note}</small></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="route-section section" id="rota">
        <div className="container route-grid">
          <div className="route-image">
            <img src="./images/boat-cliffs.jpg" alt="Antalya kıyısında tur teknesi" loading="lazy" decoding="async" width="1400" height="930" />
            <div className="route-note"><span>✦</span><div><strong>Bugünün rotası</strong><small>Deniz, şehir ve lezzet</small></div></div>
          </div>
          <div className="route-content">
            <span className="eyebrow">BİR GÜN, DÖRT GÜZEL DURAK</span>
            <h2>Antalya’yı acele etmeden, eksik bırakmadan.</h2>
            <p>Col Tur şehir rotasında sadece görülmesi gerekenleri değil, oradayken hissedilmesi gereken anları da planlıyoruz.</p>
            <ol className="timeline">
              <li><span>09:00</span><div><strong>Otelinden hareket</strong><small>Merkezi bölgelerden klimalı araçla karşılama.</small></div></li>
              <li><span>10:30</span><div><strong>Düden Şelalesi</strong><small>Serbest zaman ve en güzel manzara noktaları.</small></div></li>
              <li><span>13:00</span><div><strong>Kaleiçi & yerel öğle yemeği</strong><small>Tarihi sokaklar, liman ve seçili esnaf lokantası.</small></div></li>
              <li><span>15:30</span><div><strong>Akdeniz’de tekne turu</strong><small>Kıyıya denizden bakış ve yüzme molası.</small></div></li>
            </ol>
            <a className="text-link" href="#turlar">Bu rotadaki turları gör <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="guide-section section" aria-labelledby="antalya-turlari-rehberi">
        <div className="container guide-grid">
          <div>
            <span className="eyebrow">ANTALYA TUR REHBERİ</span>
            <h2 id="antalya-turlari-rehberi">Antalya turlarıyla denizi, tarihi ve doğayı aynı tatilde keşfet.</h2>
          </div>
          <div className="guide-copy">
            <p><strong>Antalya şehir turları</strong>; Kaleiçi, Düden Şelalesi ve liman çevresini kısa sürede tanımak isteyenler için ideal bir başlangıçtır. Şehir merkezinde konaklayan misafirler, transferli seçeneklerle günü ulaşım planlamadan değerlendirebilir.</p>
            <p><strong>Antalya tekne turları</strong> için Kemer, Adrasan ve Suluada rotaları öne çıkar. Yüzme molaları, öğle yemeği ve kalkış noktası her programda farklı olabildiği için dahil olan hizmetleri rezervasyon öncesinde netleştiriyoruz.</p>
            <p>Pamukkale, Kaş, Kaputaş ve Alanya gibi tam günlük rotalarda yol süresi daha uzundur. Col Tur; yaş grubu, konaklama bölgesi ve tatil planınıza göre size uygun rotayı seçmenize yardımcı olur.</p>
          </div>
        </div>
      </section>

      <section className="why-section section" id="neden-biz">
        <div className="container">
          <div className="section-heading centered">
            <div><span className="eyebrow">COL TUR FARKI</span><h2>İyi gezi, iyi planla başlar.</h2></div>
            <p>Sana kalan tek şey, güneş kremini sürmek ve manzaranın tadını çıkarmak.</p>
          </div>
          <div className="why-grid">
            <article><span>01</span><div className="why-icon">◎</div><h3>Küçük gruplar</h3><p>Daha az bekleme, rehberle daha çok iletişim ve rahat bir tempo.</p></article>
            <article><span>02</span><div className="why-icon">⌁</div><h3>Gerçek yerel bilgi</h3><p>Fotoğraf noktalarından öğle yemeğine kadar Antalya’yı yaşayan öneriler.</p></article>
            <article><span>03</span><div className="why-icon">✓</div><h3>Net ve güvenli</h3><p>Nelerin dahil olduğunu baştan bil; rezervasyonunu kolayca yönet.</p></article>
          </div>
        </div>
      </section>

      <section className="faq-section section" id="sss" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div className="faq-heading">
            <span className="eyebrow">MERAK ETTİKLERİN</span>
            <h2 id="faq-title">Antalya tur rezervasyonu hakkında sık sorulanlar</h2>
            <p>Turunu seçmeden önce transfer, çocuk katılımı, değişiklik ve rezervasyon sürecini netleştir.</p>
            <a className="text-link" href="mailto:rezervasyon@coltur.com.tr">Başka bir soru sor <span>→</span></a>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="review-section section" aria-labelledby="service-title">
        <div className="container review-grid">
          <div className="review-copy"><span className="eyebrow">REZERVASYON GÜVENCESİ</span><h2 id="service-title">Önce müsaitlik ve detaylar netleşir, sonra rezervasyonun kesinleşir.</h2><div className="review-author"><span>CT</span><div><strong>Col Tur rezervasyon ekibi</strong><small>Antalya · Yerel rota desteği</small></div></div></div>
          <div className="review-score"><span>NET</span><strong>3</strong><small>adımda rezervasyon</small><div className="score-steps"><i>Seç</i><i>Teyit et</i><i>Keşfet</i></div></div>
        </div>
      </section>

      <section className="cta-section" id="destek">
        <div className="container cta-inner">
          <div><span className="eyebrow">KARAR VEREMEDİN Mİ?</span><h2>Sana en uygun Antalya rotasını birlikte bulalım.</h2></div>
          <a href="mailto:rezervasyon@coltur.com.tr">Bize yaz <span>→</span></a>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand"><a className="brand brand-light" href="#anasayfa"><span className="brand-mark"><span>c</span></span><span className="brand-name">col<span>tur</span></span></a><p>Antalya’nın denizini, tarihini ve hikâyelerini yerel gibi keşfet.</p></div>
          <div><strong>Turlar</strong><a href="#turlar">Şehir Turları</a><a href="#turlar">Tekne Turları</a><a href="#turlar">Kültür Rotaları</a></div>
          <div><strong>Col Tur</strong><a href="#neden-biz">Hakkımızda</a><a href="mailto:rezervasyon@coltur.com.tr">İletişim</a><a href="#sss">Sık Sorulanlar</a></div>
          <div><strong>Bize ulaş</strong><a href="mailto:rezervasyon@coltur.com.tr">rezervasyon@coltur.com.tr</a><span>Antalya, Türkiye</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Col Tur. Tüm hakları saklıdır.</span><div><a href="/gizlilik.html">Gizlilik</a><a href="/kullanim-kosullari.html">Kullanım Koşulları</a></div></div>
      </footer>

      <div className="mobile-bar"><div><small>Turlar</small><strong>₺990’dan başlayan</strong></div><a href="#turlar">Turunu seç</a></div>

      {selectedTour && (
        <div className="modal-backdrop">
          <button className="modal-backdrop-close" type="button" aria-label="Rezervasyon penceresini kapat" onClick={() => setSelectedTour(null)} />
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" type="button" aria-label="Rezervasyon penceresini kapat" onClick={() => setSelectedTour(null)}>×</button>
            {bookingStatus === "sent" ? (
              <div className="request-success"><span>✓</span><h2>Talebin bize ulaştı.</h2><p>Col Tur ekibi müsaitlik ve kesin fiyat bilgisini verdiğin iletişim adresine gönderecek.</p><button type="button" onClick={() => setSelectedTour(null)}>Turlara dön</button></div>
            ) : (
              <form onSubmit={submitBooking}>
                <span className="eyebrow">REZERVASYON TALEBİ</span>
                <h2 id="booking-title">{selectedTour.title}</h2>
                <p>{selectedTour.location} · {selectedTour.duration}</p>
                <div className="booking-fields">
                  <label><span>Ad soyad</span><input name="name" type="text" autoComplete="name" required minLength={2} /></label>
                  <label><span>E-posta</span><input name="email" type="email" autoComplete="email" required /></label>
                  <label><span>Telefon</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" required /></label>
                  <label><span>Tur tarihi</span><input name="date" type="date" required /></label>
                </div>
                <div className="counter-field"><span>Kişi sayısı</span><div className="counter"><button type="button" aria-label="Kişi sayısını azalt" onClick={() => setTravellers(Math.max(1, travellers - 1))}>−</button><strong>{travellers}</strong><button type="button" aria-label="Kişi sayısını artır" onClick={() => setTravellers(Math.min(8, travellers + 1))}>+</button></div></div>
                <label><span>Notun (isteğe bağlı)</span><textarea name="note" rows={3} placeholder="Otel bölgesi, çocuk yaşı veya özel talebin" /></label>
                <label className="honeypot" aria-hidden="true"><span>Web sitesi</span><input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
                <div className="modal-total"><span>Tahmini toplam</span><strong>₺{(selectedTour.price * travellers).toLocaleString("tr-TR")}</strong></div>
                <label className="consent"><input type="checkbox" required /><span>Rezervasyon talebimin yanıtlanması için bilgilerimin işlenmesini kabul ediyorum.</span></label>
                {bookingStatus === "error" && <p className="booking-error" role="alert">Talep gönderilemedi. Lütfen <a href="mailto:rezervasyon@coltur.com.tr">rezervasyon@coltur.com.tr</a> adresine yaz.</p>}
                <button className="modal-submit" type="submit" disabled={bookingStatus === "sending"}>{bookingStatus === "sending" ? "Gönderiliyor…" : "Müsaitlik iste"}</button>
                <small className="modal-disclaimer">Talep göndermek ödeme oluşturmaz. Müsaitlik ve kesin fiyat ayrıca teyit edilir.</small>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
