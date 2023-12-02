// This is a Next.js Edge API route
import { kv } from "@vercel/kv";
export const runtime = "edge";

export async function GET() {
  try {
    const [priceData, cryptoData, carData, mobileData] = await Promise.all([
      kv.get("price").then((res) => res),
      kv.get("crypto").then((res) => res),
      kv.get("car").then((res) => res),
      kv.get("mobile").then((res) => res),
    ]);
    return new Response(
      JSON.stringify({
        price: priceData,
        crypto: cryptoData,
        car: carData,
        mobile: mobileData,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while fetching data from Vercel KV , ${error}`,
      })
    );
  }
}
