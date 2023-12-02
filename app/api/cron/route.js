// This is a Next.js Edge API route
import { kv } from "@vercel/kv";
export const runtime = "edge";

export async function GET(req, res) {
  const { TOKEN } = process.env;
  const price = `https://one-api.ir/price/?token=${TOKEN}`;
  const crypto = `https://one-api.ir/DigitalCurrency/?token=${TOKEN}`;
  const car = `https://one-api.ir/car/?token=${TOKEN}&action=divar`;
  const mobile = `https://one-api.ir/mobile/?token=${TOKEN}&action=all`;

  try {
    const [priceData, cryptoData, carData, mobileData] = await Promise.all([
      fetch(price).then((response) => response.json()),
      fetch(crypto).then((response) => response.json()),
      fetch(car).then((response) => response.json()),
      fetch(mobile).then((response) => response.json()),
    ]);
    await Promise.all([
      kv.set("price", priceData),
      kv.set("crypto", cryptoData),
      kv.set("car", carData),
      kv.set("mobile", mobileData),
    ]);
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    return new Response(
      JSON.stringify(
        `cron jobs happened at: ${year}-${month}-${day} ${hour}:${minute}:${second}`
      )
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while fetching data from Vercel KV , ${error}`,
      })
    );
  }
}
