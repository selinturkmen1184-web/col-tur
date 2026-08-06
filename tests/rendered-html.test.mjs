import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("renders SEO content into production HTML", async () => {
  const html = await readFile(new URL("dist/index.html", root), "utf8");

  assert.match(html, /<title>Antalya Turları ve Tekne Gezileri \| Col Tur<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/coltur\.com\.tr\/"/);
  assert.match(html, /Antalya turlarıyla denizi, tarihi ve doğayı aynı tatilde keşfet/);
  assert.match(html, /"@type":"TravelAgency"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /id="root"><link rel="preload"/);
  assert.doesNotMatch(html, /github\.io|Bu bir arayüz demosudur|codex-preview/);
});

test("ships search, legal and booking support files", async () => {
  const [robots, sitemap, booking] = await Promise.all([
    readFile(new URL("dist/robots.txt", root), "utf8"),
    readFile(new URL("dist/sitemap.xml", root), "utf8"),
    readFile(new URL("dist/booking.php", root), "utf8"),
    access(new URL("dist/gizlilik.html", root)),
    access(new URL("dist/kullanim-kosullari.html", root)),
    access(new URL("dist/og-v2.png", root)),
  ]);

  assert.match(robots, /Sitemap: https:\/\/coltur\.com\.tr\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/coltur\.com\.tr\//);
  assert.match(booking, /mail\('rezervasyon@coltur\.com\.tr'/);
  assert.match(booking, /HTTP_ORIGIN/);
});

