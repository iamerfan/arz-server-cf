// This is a Next.js Edge API route
import { kv } from "@vercel/kv";
import axios from "axios";
export const runtime = "edge";

export async function GET(req, res) {
  const { TOKEN } = process.env;
  const urls = {
    car: `https://one-api.ir/car/?token=${TOKEN}&action=divar`,
    mobile: `https://one-api.ir/mobile/?token=${TOKEN}&action=all`,
    price: `https://one-api.ir/price/?token=${TOKEN}`,
    crypto: `https://one-api.ir/DigitalCurrency/?token=${TOKEN}`,
  };
  const date = new Date().toLocaleString("fa-IR");

  try {
    const responses = await Promise.all(
      Object.entries(urls).map(([key, url]) =>
        fetch(url, { cache: "no-store" }).then((response) => response.json())
      )
    );

    const results = {};
    for (let i = 0; i < responses.length; i++) {
      const key = Object.keys(urls)[i];
      results[key] = await kv.set(key, { ...responses[i], date });
    }

    return new Response(JSON.stringify(results));
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while fetching data from Vercel KV , ${error}`,
      })
    );
  }
}
