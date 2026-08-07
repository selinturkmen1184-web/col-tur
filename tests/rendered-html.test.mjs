import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("renders SEO content into production HTML", async () => {
  const html = await readFile(new URL("dist/index.html", root), "utf8");

  assert.match(html, /<title>Antalya Turları 2026 \| Günübirlik Tur &amp; Tekne \| Col Tur<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/coltur\.com\.tr\/"/);
  assert.match(html, /Antalya turlarıyla denizi, tarihi ve doğayı aynı tatilde keşfet/);
  assert.match(html, /"@type":"TravelAgency"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /Antalya turlarıyla Akdeniz’i/);
  assert.match(html, /coltur-logo\.jpg/);
  assert.match(html, /id="root"><link rel="preload"/);
  assert.doesNotMatch(html, /github\.io|Bu bir arayüz demosudur|codex-preview/);
});

test("ships search, legal and booking support files", async () => {
  const [robots, sitemap, imageSitemap, booking] = await Promise.all([
    readFile(new URL("dist/robots.txt", root), "utf8"),
    readFile(new URL("dist/sitemap.xml", root), "utf8"),
    readFile(new URL("dist/image-sitemap.xml", root), "utf8"),
    readFile(new URL("dist/booking.php", root), "utf8"),
    access(new URL("dist/gizlilik.html", root)),
    access(new URL("dist/kullanim-kosullari.html", root)),
    access(new URL("dist/og-v2.png", root)),
    access(new URL("dist/coltur-logo.jpg", root)),
  ]);

  assert.match(robots, /Sitemap: https:\/\/coltur\.com\.tr\/sitemap\.xml/);
  assert.match(robots, /Sitemap: https:\/\/coltur\.com\.tr\/image-sitemap\.xml/);
  assert.match(sitemap, /https:\/\/coltur\.com\.tr\//);
  assert.match(sitemap, /https:\/\/coltur\.com\.tr\/antalya-turlari\//);
  assert.match(imageSitemap, /Antalya turları 2026/);
  assert.match(booking, /mail\('rezervasyon@coltur\.com\.tr'/);
  assert.match(booking, /HTTP_ORIGIN/);
});

test("ships distinct Antalya SEO landing pages", async () => {
  const pages = await Promise.all([
    readFile(new URL("dist/antalya-turlari/index.html", root), "utf8"),
    readFile(new URL("dist/antalya-sehir-turu/index.html", root), "utf8"),
    readFile(new URL("dist/antalya-tekne-turlari/index.html", root), "utf8"),
    readFile(new URL("dist/antalya-cikisli-gunubirlik-turlar/index.html", root), "utf8"),
  ]);

  assert.match(pages[0], /<h1>Antalya turları:/);
  assert.match(pages[1], /<h1>Antalya şehir turu<\/h1>/);
  assert.match(pages[2], /<h1>Antalya tekne turları<\/h1>/);
  assert.match(pages[3], /<h1>Antalya çıkışlı günübirlik turlar<\/h1>/);
  for (const page of pages) {
    assert.match(page, /rel="canonical" href="https:\/\/coltur\.com\.tr\//);
    assert.match(page, /"@type":"BreadcrumbList"/);
  }
});
