// This is a Next.js Edge API route
import { kv } from "@vercel/kv";
import axios from "axios";
export const runtime = "edge";

export async function GET(req, res) {
  const { TOKEN } = process.env;
  const price = `https://one-api.ir/price/?token=${TOKEN}`;
  const crypto = `https://one-api.ir/DigitalCurrency/?token=${TOKEN}`;
  const car = `https://one-api.ir/car/?token=${TOKEN}&action=divar`;
  const mobile = `https://one-api.ir/mobile/?token=${TOKEN}&action=all`;
  const date = new Date().toLocaleString("fa-IR");

  try {
    const priceData = await fetch(price, { cache: "no-store" }).then(
      (response) => response.json()
    );
    const cryptoData = await fetch(crypto, { cache: "no-store" }).then(
      (response) => response.json()
    );
    const carData = await fetch(car, { cache: "no-store" }).then((response) =>
      response.json()
    );
    const mobileData = await fetch(mobile, { cache: "no-store" }).then(
      (response) => response.json()
    );

    const kvPrice = await kv.set("price", { ...priceData, date });
    const kvCypto = await kv.set("crypto", { ...cryptoData, date });
    const kvCar = await kv.set("car", { ...carData, date });
    const kvMoblie = await kv.set("mobile", { ...mobileData, date });

    return new Response(JSON.stringify({ kvPrice, kvCypto, kvCar, kvMoblie }));
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while fetching data from Vercel KV , ${error}`,
      })
    );
  }
}
