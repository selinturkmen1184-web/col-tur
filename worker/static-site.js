const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    // The DirectAdmin production host executes booking.php. The private Sites
    // preview intentionally returns a clear fallback instead of accepting data.
    if (url.pathname === "/booking.php" && request.method === "POST") {
      return Response.json(
        { ok: false, message: "Rezervasyon formu ana alan adında kullanılabilir." },
        { status: 503 },
      );
    }

    const assetPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const assetUrl = new URL(assetPath, url);
    const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));

    if (assetResponse.status !== 404 || !request.headers.get("accept")?.includes("text/html")) {
      return assetResponse;
    }

    return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
  },
};

export default worker;

