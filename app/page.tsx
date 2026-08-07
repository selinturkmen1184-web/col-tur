"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  overview: string;
  itinerary: string[];
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
    overview: "Kaleiçi'nin tarihî sokaklarını, Düden Şelalesi'ni ve Antalya kıyısını aynı günde birleştiren şehir keşfi.",
    itinerary: ["Seçili bölgelerden otel transferi", "Düden Şelalesi manzara molası", "Kaleiçi ve Eski Liman yürüyüşü", "Programa göre kıyı tekne gezisi"],
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
    overview: "Adrasan'dan hareket eden tekneyle Suluada ve çevresindeki berrak koylarda yüzme odaklı tam günlük deniz programı.",
    itinerary: ["Antalya bölgesinden Adrasan'a transfer", "Suluada ve çevre koylara tekne yolculuğu", "Programa göre yüzme molaları", "Teknede öğle yemeği"],
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
    overview: "Pamukkale travertenleri ve Hierapolis Antik Kenti'ni Antalya çıkışlı tam günlük kültür rotasında keşfedin.",
    itinerary: ["Sabah erken saatlerde otel transferi", "Pamukkale travertenleri için serbest zaman", "Hierapolis Antik Kenti ziyareti", "Dönüş yolunda planlı dinlenme molaları"],
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
    overview: "Kemer kıyılarında günün daha sakin saatlerinde Akdeniz manzarası ve yüzme molası sunan kısa tekne gezisi.",
    itinerary: ["Kemer limanında tekneye biniş", "Kıyı boyunca manzara seyri", "Programa göre yüzme molası", "Gün batımı saatinde dönüş"],
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
    overview: "Kaş'ın taş sokaklarını ve Kaputaş'ın kıyı manzarasını fotoğraf molalarıyla birleştiren batı Antalya rotası.",
    itinerary: ["Antalya'dan batı kıyısına hareket", "Kaputaş manzara ve fotoğraf molası", "Kaş merkezde serbest zaman", "Sahil rotasından dönüş"],
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
    overview: "Alanya Kalesi, liman çevresi ve Akdeniz koylarını şehir ile deniz deneyiminde bir araya getiren tam günlük program.",
    itinerary: ["Antalya bölgesinden Alanya'ya transfer", "Alanya Kalesi ve şehir manzarası", "Liman çevresinde serbest zaman", "Programa göre tekne gezisi"],
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

type GalleryRoute = (typeof laraRoutes)[number];

const galleryRouteDetails: Record<string, { duration: string; category: string; highlights: string[] }> = {
  "Antalya Şehir Turu": { duration: "Yaklaşık 7–9 saat", category: "Şehir & Kültür", highlights: ["Düden Şelalesi", "Kaleiçi ve Eski Liman", "Programa göre tekne gezisi", "Transfer bilgisi rezervasyonla teyit edilir"] },
  "Adrasan & Suluada": { duration: "Yaklaşık 9–12 saat", category: "Tekne Turu", highlights: ["Adrasan Limanı'ndan kalkış", "Suluada ve çevre koylar", "Programa göre yüzme molaları", "Öğle yemeği ve transfer kapsamı teyit edilir"] },
  "Antalya Akvaryum": { duration: "Yaklaşık 4–6 saat", category: "Aile Aktivitesi", highlights: ["Su altı tüneli", "Ailelere uygun kapalı alan", "Serbest gezi süresi", "Giriş ve transfer pakete göre netleşir"] },
  "Perge, Aspendos & Side": { duration: "Yaklaşık 8–10 saat", category: "Kültür Turu", highlights: ["Perge Antik Kenti", "Aspendos Tiyatrosu", "Side antik liman çevresi", "Giriş ücretleri rezervasyon öncesi teyit edilir"] },
  "Demre, Myra & Kekova": { duration: "Yaklaşık 10–12 saat", category: "Kültür & Tekne", highlights: ["Myra kaya mezarları", "Demre tarih rotası", "Programa göre Kekova tekne gezisi", "Müze girişleri ve yemek kapsamı teyit edilir"] },
  "Kapadokya": { duration: "Konaklamalı program", category: "Kültür Rotası", highlights: ["Kapadokya vadileri", "Yer altı şehri veya açık hava müzesi", "Programa göre konaklama", "Balon uçuşu ayrı teyit edilir"] },
  "Yunus Gösterisi": { duration: "Yaklaşık 2–4 saat", category: "Aile Aktivitesi", highlights: ["Yunus gösterisi", "Ailelere uygun program", "Seans saatine göre planlama", "Transfer ve giriş pakete göre netleşir"] },
  "Özel Balık Avı": { duration: "Yaklaşık 4–7 saat", category: "Özel Tekne", highlights: ["Akdeniz'de balık avı rotası", "Ekipman durumu tekneye göre", "Küçük grup veya özel tekne", "Hava ve deniz koşullarına bağlı program"] },
  "Korsan Tekne Turu": { duration: "Yaklaşık 6–8 saat", category: "Eğlence Teknesi", highlights: ["Korsan temalı tekne", "Antalya kıyısı ve Düden manzarası", "Programa göre yüzme molaları", "Müzik ve yemek kapsamı tekneden teyit edilir"] },
  "Green Canyon": { duration: "Yaklaşık 8–10 saat", category: "Doğa & Tekne", highlights: ["Kanyon içinde tekne gezisi", "Doğa manzaraları", "Programa göre yüzme veya dinlenme molası", "Transfer ve yemek kapsamı teyit edilir"] },
  "At Safari": { duration: "Yaklaşık 2–4 saat", category: "Doğa Aktivitesi", highlights: ["Rehberli at binme rotası", "Başlangıç seviyesi bilgilendirmesi", "Doğa parkuru", "Yaş ve kilo koşulları teyit edilir"] },
  "Jeep Safari": { duration: "Yaklaşık 7–9 saat", category: "Safari", highlights: ["Toroslar rotası", "Köy ve manzara molaları", "Arazi aracı deneyimi", "Yemek ve transfer kapsamı teyit edilir"] },
  "Kemer Mega Star": { duration: "Yaklaşık 7–9 saat", category: "Tekne Turu", highlights: ["Kemer kıyı rotası", "Programa göre koy molaları", "Müzikli tekne atmosferi", "Yemek ve transfer kapsamı teyit edilir"] },
  "The Land of Legends": { duration: "Tam gün", category: "Tema Parkı", highlights: ["Su parkı ve tema alanları", "Serbest park zamanı", "Aile ve arkadaş gruplarına uygun", "Bilet ve transfer paketi teyit edilir"] },
  "Land of Lions": { duration: "Yaklaşık 4–7 saat", category: "Yaşam Parkı", highlights: ["Vahşi yaşam gözlem alanları", "Rehberli veya serbest park programı", "Ailelere uygun aktivite", "Bilet ve transfer kapsamı teyit edilir"] },
  "Pamukkale & Hierapolis": { duration: "Yaklaşık 12–14 saat", category: "Kültür Turu", highlights: ["Pamukkale travertenleri", "Hierapolis Antik Kenti", "Uzun yolculuklu tam gün", "Giriş ve yemek kapsamı teyit edilir"] },
  "Yamaç Paraşütü": { duration: "Aktivite 1–3 saat", category: "Macera", highlights: ["Tandem uçuş", "Profesyonel pilot eşliği", "Hava koşuluna bağlı kalkış", "Yaş, kilo ve sağlık koşulları teyit edilir"] },
  "Peloid Türk Hamamı": { duration: "Yaklaşık 2–3 saat", category: "Wellness", highlights: ["Hamam ve sauna alanı", "Programa göre köpük bakımı", "Dinlenme bölümü", "Masaj ve ek hizmetler pakete göre netleşir"] },
  "Köprülü Kanyon Rafting": { duration: "Yaklaşık 9–10 saat", category: "Macera", highlights: ["Köprülü Kanyon parkuru", "Aktivite öncesi güvenlik bilgilendirmesi", "Rafting ekipmanı", "Yaş ve sağlık koşulları teyit edilir"] },
  "Rafting & Buggy Combo": { duration: "Yaklaşık 9–11 saat", category: "Macera Kombosu", highlights: ["Rafting parkuru", "Buggy veya arazi aktivitesi", "Aynı günde iki deneyim", "Ekipman ve yemek kapsamı teyit edilir"] },
  "Relax Tekne Turu": { duration: "Yaklaşık 4–7 saat", category: "Sakin Tekne", highlights: ["Antalya kıyısı", "Düden Şelalesi manzarası", "Daha sakin tekne atmosferi", "Yüzme ve yemek kapsamı programa göre"] },
  "Scuba Diving": { duration: "Yaklaşık 5–8 saat", category: "Dalış", highlights: ["Eğitmen bilgilendirmesi", "Başlangıç seviyesine uygun seçenek", "Dalış ekipmanı", "Sağlık ve yaş koşulları teyit edilir"] },
  "Türk Hamamı": { duration: "Yaklaşık 2–3 saat", category: "Wellness", highlights: ["Geleneksel hamam deneyimi", "Programa göre kese ve köpük", "Dinlenme alanı", "Masaj ve transfer pakete göre netleşir"] },
};

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
      name: "Çöl Tur",
      alternateName: ["Col Tur", "Coltur Antalya Tur"],
      legalName: "Çöl-Tur Turizm Ticaret ve Nakliyat A.Ş.",
      foundingDate: "1995",
      slogan: "Her yolculuk yeni bir keşif, her gezi güzel bir hatıradır.",
      url: "https://coltur.com.tr/",
      logo: "https://coltur.com.tr/coltur-logo.jpg",
      image: "https://coltur.com.tr/og-v2.png",
      email: "rezervasyon@coltur.com.tr",
      areaServed: ["Antalya", "Kemer", "Alanya", "Kaş", "Adrasan"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Konaklı",
        addressRegion: "Antalya",
        addressCountry: "TR",
      },
      identifier: {
        "@type": "PropertyValue",
        name: "T.C. Kültür ve Turizm Bakanlığı A Grubu Seyahat Acentası Belgesi",
        value: "2783",
      },
      priceRange: "₺₺",
      description: "Antalya çıkışlı şehir, tekne, doğa ve kültür turları için yerel rezervasyon hizmeti.",
      knowsAbout: ["Antalya turları", "Antalya şehir turu", "Antalya tekne turları", "Antalya çıkışlı günübirlik turlar", "Suluada tekne turu"],
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
      "@type": "WebPage",
      "@id": "https://coltur.com.tr/#webpage",
      url: "https://coltur.com.tr/",
      name: "Antalya Turları 2026 | Günübirlik Tur & Tekne | Col Tur",
      description: "Antalya şehir, tekne, rafting, Suluada ve günübirlik tur seçenekleri.",
      inLanguage: "tr-TR",
      dateModified: "2026-08-07",
      isPartOf: { "@id": "https://coltur.com.tr/#website" },
      about: { "@id": "https://coltur.com.tr/#organization" },
      primaryImageOfPage: { "@type": "ImageObject", url: "https://coltur.com.tr/images/lara/antalya-duden-hero.jpg" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://coltur.com.tr/" },
      ],
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
  const [tourList, setTourList] = useState<Tour[]>(tours);
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedGalleryRoute, setSelectedGalleryRoute] = useState<GalleryRoute | null>(null);
  const [travellers, setTravellers] = useState(2);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    let active = true;

    fetch("/data/tours.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Tur verisi alınamadı");
        return response.json();
      })
      .then((data: unknown) => {
        if (!active || !Array.isArray(data)) return;

        const validTours = data.filter((tour): tour is Tour => {
          if (!tour || typeof tour !== "object") return false;
          const candidate = tour as Partial<Tour>;
          return (
            typeof candidate.id === "number" &&
            typeof candidate.title === "string" &&
            typeof candidate.location === "string" &&
            typeof candidate.category === "string" &&
            typeof candidate.duration === "string" &&
            typeof candidate.price === "number" &&
            typeof candidate.image === "string" &&
            Array.isArray(candidate.highlights) &&
            typeof candidate.overview === "string" &&
            Array.isArray(candidate.itinerary)
          );
        });

        if (validTours.length > 0) setTourList(validTours);
      })
      .catch(() => {
        // Sunucudaki yönetilebilir veri okunamazsa yerleşik tur listesi kullanılır.
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredTours = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    return tourList.filter((tour) => {
      const matchesCategory = category === "Tümü" || tour.category === category;
      const matchesSearch =
        !term ||
        `${tour.title} ${tour.location} ${tour.category}`.toLocaleLowerCase("tr").includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, query, tourList]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.querySelector("#turlar")?.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = (tour: Tour) => {
    setSelectedTour(tour);
    setShowBookingForm(false);
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
            <img className="brand-logo" src="./coltur-logo.jpg" alt="" width="48" height="48" />
            <span className="brand-name">col<span>tur</span></span>
          </a>

          <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"} aria-label="Ana menü">
            <a href="./antalya-turlari/" onClick={() => setMenuOpen(false)}>Antalya Turları</a>
            <a href="./antalya-sehir-turu/" onClick={() => setMenuOpen(false)}>Şehir Turu</a>
            <a href="#galeri" onClick={() => setMenuOpen(false)}>Tur Galerisi</a>
            <a href="#rota" onClick={() => setMenuOpen(false)}>Antalya Rotası</a>
            <a href="#hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</a>
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
            <span className="eyebrow">2026 ANTALYA TUR SEÇENEKLERİ</span>
            <h1>Antalya turlarıyla Akdeniz’i <em>yakından keşfet.</em></h1>
            <p>Antalya şehir turu, tekne turları, Suluada, rafting ve kültür rotalarını karşılaştır; otel transferi ile kesin fiyatı yerel Col Tur ekibiyle teyit et.</p>
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
            <div><span className="eyebrow">SENİN İÇİN SEÇTİK</span><h2>En çok tercih edilen Antalya turları</h2></div>
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
              <button className={`gallery-card ${route.className}`.trim()} type="button" onClick={() => setSelectedGalleryRoute(route)} key={route.title} aria-label={`${route.title} turunun detaylarını incele`}>
                <img src={route.image} alt={route.alt} loading="lazy" decoding="async" width="1600" height="1067" />
                <span className="gallery-shade" aria-hidden="true" />
                <span className="gallery-copy"><strong>{route.title}</strong><small>{route.note}</small><i>Tur detayları →</i></span>
              </button>
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

      <section className="seo-hub section" aria-labelledby="seo-hub-title">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">ROTANI DETAYLI İNCELE</span><h2 id="seo-hub-title">Antalya tur rehberleri</h2></div>
            <p>Tur türüne göre süre, transfer, rota ve rezervasyon bilgilerini tek sayfada karşılaştır.</p>
          </div>
          <div className="seo-hub-grid">
            <a href="./antalya-turlari/"><span>01</span><h3>Antalya Turları 2026</h3><p>Şehir, deniz, kültür ve macera seçeneklerinin genel rehberi.</p><strong>Tümünü incele →</strong></a>
            <a href="./antalya-sehir-turu/"><span>02</span><h3>Antalya Şehir Turu</h3><p>Kaleiçi, Düden Şelalesi, liman ve tekne gezisi programı.</p><strong>Şehir turunu incele →</strong></a>
            <a href="./antalya-tekne-turlari/"><span>03</span><h3>Antalya Tekne Turları</h3><p>Suluada, Adrasan, Kemer ve Akdeniz koyları karşılaştırması.</p><strong>Tekne turlarını incele →</strong></a>
            <a href="./antalya-cikisli-gunubirlik-turlar/"><span>04</span><h3>Antalya Çıkışlı Günübirlik Turlar</h3><p>Rafting, Pamukkale, Demre ve çevre rotaları için planlama rehberi.</p><strong>Günübirlik turları incele →</strong></a>
          </div>
        </div>
      </section>

      <section className="about-section section" id="hakkimizda" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-heading">
            <span className="eyebrow">1995’TEN BERİ ANTALYA’DA</span>
            <h2 id="about-title">Çöl Tur hakkında</h2>
            <p>Konaklı–Alanya merkezli, Antalya ve çevresinde günübirlik geziler ve seyahat organizasyonları gerçekleştiren yerel turizm kuruluşu.</p>
            <div className="about-license" aria-label="Seyahat acentası belge bilgisi">
              <span>2783</span>
              <div><strong>A Grubu Seyahat Acentası</strong><small>T.C. Kültür ve Turizm Bakanlığına bağlı belge</small></div>
            </div>
          </div>

          <div className="about-story">
            <p className="about-lede">1995 yılında kurulan <strong>Çöl Tur Turizm Seyahat Acentası</strong>, Antalya ve çevresinde günübirlik geziler ve seyahat organizasyonları gerçekleştiren, Konaklı–Alanya merkezli bir turizm kuruluşudur.</p>
            <p>Çöl-Tur Turizm Ticaret ve Nakliyat A.Ş. bünyesinde faaliyet gösteren acentamız, T.C. Kültür ve Turizm Bakanlığına bağlı 2783 numaralı A Grubu seyahat acentası belgesine sahiptir.</p>
            <p>Kurulduğumuz günden bu yana Antalya’nın doğal güzelliklerini, tarihî mirasını ve eşsiz kıyılarını misafirlerimizle buluşturuyoruz. Doğa gezilerinden tarih ve kültür rotalarına, deniz aktivitelerinden eğlenceli günlük programlara kadar farklı seçenekler sunuyoruz.</p>
            <p>Bölgeyi yakından tanıyan ekibimizle her geziyi dikkatle planlıyor; misafirlerimize doğru bilgilendirme, düzenli organizasyon ve keyifli bir seyahat deneyimi sunmayı amaçlıyoruz.</p>
            <p>Hizmet anlayışımızı güven, misafir memnuniyeti, kaliteli hizmet ve Antalya’ya duyduğumuz bağlılık üzerine kuruyoruz.</p>

            <div className="about-values-grid">
              <article>
                <span>01</span>
                <h3>Misyonumuz</h3>
                <p>Antalya ve çevresinin doğal, tarihî ve kültürel değerlerini özenle hazırlanan günübirlik gezi programlarıyla tanıtmak; güvenli, düzenli, keyifli ve ulaşılabilir seyahat deneyimleri sunmaktır.</p>
                <p>Her misafirimizin ihtiyaçlarını önemseyerek doğru bilgilendirme, kaliteli hizmet ve özenli organizasyon anlayışıyla tatillerine değer katmayı hedefliyoruz.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Vizyonumuz</h3>
                <p>1995 yılından gelen deneyimimizle Antalya’nın günübirlik gezi ve seyahat organizasyonları alanında güven duyulan, hizmet kalitesiyle tercih edilen öncü yerel turizm markalarından biri olmaktır.</p>
                <p>Yerel değerleri koruyan, teknolojiyi etkin kullanan, sürekli gelişen ve sürdürülebilir turizmi destekleyen hizmet anlayışımızla Çöl Tur markasını daha geniş kitlelerle buluşturmayı amaçlıyoruz.</p>
              </article>
            </div>

            <blockquote>Çöl Tur ile her yolculuk yeni bir keşif, her gezi güzel bir hatıradır.</blockquote>
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
          <div className="footer-brand"><a className="brand brand-light" href="#anasayfa" aria-label="Col Tur ana sayfa"><img className="brand-logo" src="./coltur-logo.jpg" alt="" width="48" height="48" /><span className="brand-name">col<span>tur</span></span></a><p>Antalya’nın denizini, tarihini ve hikâyelerini yerel gibi keşfet.</p></div>
          <div><strong>Turlar</strong><a href="./antalya-turlari/">Antalya Turları</a><a href="./antalya-sehir-turu/">Antalya Şehir Turu</a><a href="./antalya-tekne-turlari/">Antalya Tekne Turları</a><a href="./antalya-cikisli-gunubirlik-turlar/">Günübirlik Turlar</a></div>
          <div><strong>Col Tur</strong><a href="#hakkimizda">Hakkımızda</a><a href="mailto:rezervasyon@coltur.com.tr">İletişim</a><a href="#sss">Sık Sorulanlar</a></div>
          <div><strong>Bize ulaş</strong><a href="mailto:rezervasyon@coltur.com.tr">rezervasyon@coltur.com.tr</a><span>Antalya, Türkiye</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Col Tur. Tüm hakları saklıdır.</span><div><a href="/gizlilik.html">Gizlilik</a><a href="/kullanim-kosullari.html">Kullanım Koşulları</a></div></div>
      </footer>

      <div className="mobile-bar"><div><small>Turlar</small><strong>₺990’dan başlayan</strong></div><a href="#turlar">Turunu seç</a></div>

      {selectedTour && (
        <div className="modal-backdrop">
          <button className="modal-backdrop-close" type="button" aria-label="Rezervasyon penceresini kapat" onClick={() => setSelectedTour(null)} />
          <section className={!showBookingForm && bookingStatus !== "sent" ? "booking-modal tour-detail-modal" : "booking-modal"} role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" type="button" aria-label="Rezervasyon penceresini kapat" onClick={() => setSelectedTour(null)}>×</button>
            {bookingStatus === "sent" ? (
              <div className="request-success"><span>✓</span><h2>Talebin bize ulaştı.</h2><p>Col Tur ekibi müsaitlik ve kesin fiyat bilgisini verdiğin iletişim adresine gönderecek.</p><button type="button" onClick={() => setSelectedTour(null)}>Turlara dön</button></div>
            ) : !showBookingForm ? (
              <div className="tour-detail-panel">
                <span className="eyebrow">TUR DETAYLARI</span>
                <img className="tour-detail-image" src={selectedTour.image} alt={selectedTour.title} width="1400" height="933" />
                <div className="tour-detail-heading">
                  <div><h2 id="booking-title">{selectedTour.title}</h2><p>{selectedTour.location} · {selectedTour.duration} · {selectedTour.category}</p></div>
                  <strong>₺{selectedTour.price.toLocaleString("tr-TR")}<small> / kişi başı başlangıç</small></strong>
                </div>
                <p className="tour-detail-overview">{selectedTour.overview}</p>
                <div className="tour-detail-grid">
                  <div><h3>Programda öne çıkanlar</h3><ul>{selectedTour.itinerary.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
                  <div><h3>Öne çıkan hizmetler</h3><ul>{selectedTour.highlights.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
                </div>
                <div className="tour-detail-notice"><strong>Kesin program ve fiyat</strong><span>Tur tarihi, otel bölgesi ve kişi sayısına göre müsaitlik, transfer ve dahil hizmetler yazılı olarak teyit edilir.</span></div>
                <button className="modal-submit" type="button" onClick={() => setShowBookingForm(true)}>Rezervasyon talebine geç</button>
              </div>
            ) : (
              <form onSubmit={submitBooking}>
                <button className="modal-back" type="button" onClick={() => setShowBookingForm(false)}>← Tur detaylarına dön</button>
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

      {selectedGalleryRoute && (
        <div className="modal-backdrop">
          <button className="modal-backdrop-close" type="button" aria-label="Tur detaylarını kapat" onClick={() => setSelectedGalleryRoute(null)} />
          <section className="booking-modal gallery-detail-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-detail-title">
            <button className="modal-close" type="button" aria-label="Tur detaylarını kapat" onClick={() => setSelectedGalleryRoute(null)}>×</button>
            <div className="tour-detail-panel">
              <span className="eyebrow">LARA ÇIKIŞLI TUR DETAYI</span>
              <img className="tour-detail-image" src={selectedGalleryRoute.image} alt={selectedGalleryRoute.alt} width="1600" height="1067" />
              <div className="tour-detail-heading"><div><h2 id="gallery-detail-title">{selectedGalleryRoute.title}</h2><p>{galleryRouteDetails[selectedGalleryRoute.title].duration} · {galleryRouteDetails[selectedGalleryRoute.title].category}</p></div></div>
              <p className="tour-detail-overview">{selectedGalleryRoute.note}. Güncel rota; tur tarihi, hava koşulu ve operasyon planına göre kesinleşir.</p>
              <div className="tour-detail-grid single"><div><h3>Programda öne çıkanlar</h3><ul>{galleryRouteDetails[selectedGalleryRoute.title].highlights.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></div>
              <div className="tour-detail-notice"><strong>Rezervasyondan önce</strong><span>Otel bölgenizi, tarihi, kişi sayısını ve varsa çocuk yaşını iletin; müsaitlik, kesin fiyat ve dahil hizmetler size yazılı bildirilsin.</span></div>
              <a className="modal-submit modal-submit-link" href={`mailto:rezervasyon@coltur.com.tr?subject=${encodeURIComponent(selectedGalleryRoute.title + " turu")}&body=${encodeURIComponent("Merhaba, " + selectedGalleryRoute.title + " için tarih, kişi sayısı, transfer ve fiyat bilgisi almak istiyorum.")}`}>Bu tur için bilgi iste</a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
