// This is a Next.js Edge API route
import { kv } from "@vercel/kv";
export const runtime = "edge";

export async function GET(req, { params }) {
  try {
    const { name, query } = params;
    const data = await kv.get(name).then((response) => response.result);
    if (!data) return res.status(401).json("no data");
    switch (name) {
      case "car":
        return new Response(
          JSON.stringify(data.filter((item) => item.title.includes(query)))
        );
      case "mobile":
        return new Response(
          JSON.stringify(
            data.filter((item) => {
              const name = item.name.toLowerCase();
              return new RegExp(query.toLowerCase(), "i").test(name);
            })
          )
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An error occurred while fetching data from Vercel KV , ${error}`,
      })
    );
  }
}
