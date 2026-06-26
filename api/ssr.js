import server from "../dist/server/server.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "localhost";
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const webRequest = new Request(url.toString(), {
    method: req.method,
    headers,
  });

  const webResponse = await server.fetch(webRequest);

  res.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const buf = Buffer.from(await webResponse.arrayBuffer());
  res.end(buf);
}