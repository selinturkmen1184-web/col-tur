"use client";

import { FormEvent, useMemo, useState } from "react";

type Tour = {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  rating: string;
  reviews: number;
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
    rating: "4.9",
    reviews: 328,
    price: 990,
    oldPrice: 1250,
    badge: "Çok Sevilen",
    image: "./images/hero.jpg",
    highlights: ["Otel transferi", "Öğle yemeği"],
  },
  {
    id: 2,
    title: "Suluada'nın Turkuaz Koyları",
    location: "Adrasan",
    category: "Tekne Turları",
    duration: "7 saat",
    rating: "4.8",
    reviews: 214,
    price: 1150,
    badge: "En Çok Satan",
    image: "./images/turquoise.jpg",
    highlights: ["3 yüzme molası", "Teknede öğle yemeği"],
  },
  {
    id: 3,
    title: "Pamukkale & Hierapolis Keşfi",
    location: "Antalya çıkışlı",
    category: "Kültür",
    duration: "Tam gün",
    rating: "4.7",
    reviews: 186,
    price: 1850,
    oldPrice: 2150,
    badge: "Fırsat",
    image: "./images/pamukkale.jpg",
    highlights: ["Profesyonel rehber", "Açık büfe öğle yemeği"],
  },
  {
    id: 4,
    title: "Gün Batımında Akdeniz Tekne Turu",
    location: "Kemer",
    category: "Tekne Turları",
    duration: "4 saat",
    rating: "4.9",
    reviews: 97,
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
    rating: "4.8",
    reviews: 142,
    price: 1490,
    badge: "Yeni Rota",
    image: "./images/kas.jpg",
    highlights: ["Küçük grup", "Fotoğraf molaları"],
  },
  {
    id: 6,
    title: "Alanya Kalesi & Akdeniz Koyları",
    location: "Alanya",
    category: "Şehir Turları",
    duration: "8 saat",
    rating: "4.7",
    reviews: 121,
    price: 1250,
    image: "./images/boats.jpg",
    highlights: ["Kale gezisi", "Tekne turu"],
  },
];

const categories = ["Tümü", "Şehir Turları", "Tekne Turları", "Kültür", "Doğa"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [travellers, setTravellers] = useState(2);
  const [requestSent, setRequestSent] = useState(false);

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
    setRequestSent(false);
  };

  return (
    <main>
      <div className="announcement">
        <div className="container announcement-inner">
          <span>Antalya'da seçili turlarda ücretsiz otel transferi</span>
          <span className="announcement-proof">Yerel ekip · Güvenli rezervasyon · Anında onay</span>
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
            <a href="#rota" onClick={() => setMenuOpen(false)}>Antalya Rotası</a>
            <a href="#neden-biz" onClick={() => setMenuOpen(false)}>Neden Col Tur?</a>
            <a href="#destek" onClick={() => setMenuOpen(false)}>Destek</a>
          </nav>

          <div className="nav-actions">
            <button className="language" type="button" aria-label="Dil: Türkçe">TR <span>⌄</span></button>
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
            <span className="eyebrow">ANTALYA'YI BİZİMLE KEŞFET</span>
            <h1>Akdeniz'in en güzel hâline <em>yakından bak.</em></h1>
            <p>Kalabalığı değil, anı takip eden küçük gruplar; bölgeyi seven rehberler ve sonradan sürpriz çıkarmayan net fiyatlar.</p>
            <div className="hero-trust">
              <div className="avatar-stack" aria-hidden="true">
                <span>EC</span><span>MK</span><span>SA</span>
              </div>
              <div><strong>4.9 / 5</strong><span>1.200+ mutlu gezgin</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <img src="./images/hero.jpg" alt="Antalya Kaleiçi limanı ve tur tekneleri" />
            <div className="hero-stamp"><strong>%100</strong><span>yerel deneyim</span></div>
            <div className="hero-caption"><span>01</span><div><strong>Kaleiçi, Antalya</strong><small>Günün ilk ışıklarıyla</small></div></div>
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
          <div><span>✓</span><div><strong>Koşulsuz kolay iptal</strong><small>24 saat öncesine kadar</small></div></div>
          <div><span>₺</span><div><strong>En iyi fiyat garantisi</strong><small>Gizli ücret yok</small></div></div>
          <div><span>☀</span><div><strong>Yerel rota uzmanları</strong><small>Antalya'yı yaşayan ekip</small></div></div>
          <div><span>↗</span><div><strong>Hızlı destek</strong><small>Tur öncesi ve sırasında</small></div></div>
        </div>
      </section>

      <section className="tours-section section" id="turlar">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">SENİN İÇİN SEÇTİK</span><h2>Antalya'nın favori deneyimleri</h2></div>
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
                    <img src={tour.image} alt={tour.title} loading="lazy" />
                    {tour.badge && <span className="card-badge">{tour.badge}</span>}
                    <button className="heart" type="button" aria-label={`${tour.title} turunu favorilere ekle`}>♡</button>
                  </div>
                  <div className="card-body">
                    <div className="card-meta"><span>{tour.location}</span><span>★ {tour.rating} <small>({tour.reviews})</small></span></div>
                    <h3>{tour.title}</h3>
                    <div className="tour-features"><span>◷ {tour.duration}</span><span>● {tour.category}</span></div>
                    <div className="highlight-list">{tour.highlights.map((highlight) => <span key={highlight}>✓ {highlight}</span>)}</div>
                    <div className="card-footer">
                      <div><small>Kişi başı</small><div>{tour.oldPrice && <del>₺{tour.oldPrice.toLocaleString("tr-TR")}</del>}<strong>₺{tour.price.toLocaleString("tr-TR")}</strong></div></div>
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

      <section className="route-section section" id="rota">
        <div className="container route-grid">
          <div className="route-image">
            <img src="./images/boat-cliffs.jpg" alt="Antalya kıyısında tur teknesi" loading="lazy" />
            <div className="route-note"><span>✦</span><div><strong>Bugünün rotası</strong><small>Deniz, şehir ve lezzet</small></div></div>
          </div>
          <div className="route-content">
            <span className="eyebrow">BİR GÜN, DÖRT GÜZEL DURAK</span>
            <h2>Antalya'yı acele etmeden, eksik bırakmadan.</h2>
            <p>Col Tur şehir rotasında sadece görülmesi gerekenleri değil, oradayken hissedilmesi gereken anları da planlıyoruz.</p>
            <ol className="timeline">
              <li><span>09:00</span><div><strong>Otelinden hareket</strong><small>Merkezi bölgelerden klimalı araçla karşılama.</small></div></li>
              <li><span>10:30</span><div><strong>Düden Şelalesi</strong><small>Serbest zaman ve en güzel manzara noktaları.</small></div></li>
              <li><span>13:00</span><div><strong>Kaleiçi & yerel öğle yemeği</strong><small>Tarihi sokaklar, liman ve seçili esnaf lokantası.</small></div></li>
              <li><span>15:30</span><div><strong>Akdeniz'de tekne turu</strong><small>Kıyıya denizden bakış ve yüzme molası.</small></div></li>
            </ol>
            <a className="text-link" href="#turlar">Bu rotadaki turları gör <span>→</span></a>
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
            <article><span>02</span><div className="why-icon">⌁</div><h3>Gerçek yerel bilgi</h3><p>Fotoğraf noktalarından öğle yemeğine kadar Antalya'yı yaşayan öneriler.</p></article>
            <article><span>03</span><div className="why-icon">✓</div><h3>Net ve güvenli</h3><p>Nelerin dahil olduğunu baştan bil; rezervasyonunu kolayca yönet.</p></article>
          </div>
        </div>
      </section>

      <section className="review-section section">
        <div className="container review-grid">
          <div className="review-copy"><span className="eyebrow">GEZGİNLER ANLATIYOR</span><h2>“Bir turdan çok, şehirde yaşayan bir arkadaşla geziyormuş gibiydik.”</h2><div className="review-author"><span>SB</span><div><strong>Selin B.</strong><small>İstanbul · Kaleiçi & Düden turu</small></div></div></div>
          <div className="review-score"><span>★ ★ ★ ★ ★</span><strong>4.9</strong><small>Doğrulanmış 1.200+ değerlendirme</small><div className="score-bars"><i></i><i></i><i></i><i></i><i></i></div></div>
        </div>
      </section>

      <section className="cta-section" id="destek">
        <div className="container cta-inner">
          <div><span className="eyebrow">KARAR VEREMEDİN Mİ?</span><h2>Sana en uygun Antalya rotasını birlikte bulalım.</h2></div>
          <a href="#turlar">Turları karşılaştır <span>→</span></a>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand"><a className="brand brand-light" href="#anasayfa"><span className="brand-mark"><span>c</span></span><span className="brand-name">col<span>tur</span></span></a><p>Antalya'nın denizini, tarihini ve hikâyelerini yerel gibi keşfet.</p></div>
          <div><strong>Turlar</strong><a href="#turlar">Şehir Turları</a><a href="#turlar">Tekne Turları</a><a href="#turlar">Kültür Rotaları</a></div>
          <div><strong>Col Tur</strong><a href="#neden-biz">Hakkımızda</a><a href="#destek">İletişim</a><a href="#destek">Sık Sorulanlar</a></div>
          <div><strong>Bize ulaş</strong><a href="#destek">Gezi danışmanlığı</a><span>Antalya, Türkiye</span><div className="socials"><a href="#anasayfa" aria-label="Instagram">ig</a><a href="#anasayfa" aria-label="YouTube">yt</a><a href="#anasayfa" aria-label="TikTok">tk</a></div></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Col Tur. Tüm hakları saklıdır.</span><div><a href="#">Gizlilik</a><a href="#">Kullanım Koşulları</a></div></div>
      </footer>

      <div className="mobile-bar"><div><small>Turlar</small><strong>₺990'dan başlayan</strong></div><a href="#turlar">Turunu seç</a></div>

      {selectedTour && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedTour(null)}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Rezervasyon penceresini kapat" onClick={() => setSelectedTour(null)}>×</button>
            {requestSent ? (
              <div className="request-success"><span>✓</span><h2>Talebin hazır!</h2><p>Bu demo sitede gerçek ödeme alınmaz. Col Tur ekibi müsaitlik bilgisini burada gösterebilir.</p><button type="button" onClick={() => setSelectedTour(null)}>Turlara dön</button></div>
            ) : (
              <>
                <span className="eyebrow">REZERVASYON TALEBİ</span>
                <h2 id="booking-title">{selectedTour.title}</h2>
                <p>{selectedTour.location} · {selectedTour.duration}</p>
                <label><span>Tur tarihi</span><input type="date" /></label>
                <label><span>Kişi sayısı</span><div className="counter"><button type="button" aria-label="Kişi sayısını azalt" onClick={() => setTravellers(Math.max(1, travellers - 1))}>−</button><strong>{travellers}</strong><button type="button" aria-label="Kişi sayısını artır" onClick={() => setTravellers(Math.min(8, travellers + 1))}>+</button></div></label>
                <div className="modal-total"><span>Tahmini toplam</span><strong>₺{(selectedTour.price * travellers).toLocaleString("tr-TR")}</strong></div>
                <button className="modal-submit" type="button" onClick={() => setRequestSent(true)}>Müsaitlik iste</button>
                <small className="modal-disclaimer">Bu bir arayüz demosudur; ödeme alınmaz.</small>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
