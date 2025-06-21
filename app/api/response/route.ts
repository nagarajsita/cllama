import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LIMITS = {
  perMinute: 5,
  perDay: 30,
};

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);

  const minuteKey = `rl:minute:${ip}`;
  const dayKey = `rl:day:${ip}`;

  try {
    // Check counts
    const [minute, day] = (await redis.mget([minuteKey, dayKey])).map(value => Number(value));

    if ((minute ?? 0) >= LIMITS.perMinute) {
      return NextResponse.json({ error: "Try after some time!! Rate limit exceeded: 5 requests/min" }, { status: 429 });
    }
    if ((day ?? 0) >= LIMITS.perDay) {
      return NextResponse.json({ error: "Try after some time!! Rate limit exceeded: 20 requests/day" }, { status: 429 });
    }

    // Increment with expiry
    await redis.multi()
      .incr(minuteKey)
      .expire(minuteKey, 60)         // 1 minute
      .incr(dayKey)
      .expire(dayKey, 86400)         // 1 day
      .exec();

    // Parse body
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Provide the query!" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
