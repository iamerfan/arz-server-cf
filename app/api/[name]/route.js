// This is a Next.js Edge API route
import { kv } from "@vercel/kv";
export const runtime = "edge";

export async function GET(req, { params }) {
  try {
    const { name } = params;
    const data = await kv.get(name).then((response) => response);
    return new Response(JSON.stringify(data));
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while fetching data from Vercel KV , ${error}`,
      })
    );
  }
}
