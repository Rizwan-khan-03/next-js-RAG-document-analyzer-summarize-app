// app/api/test-sdk/route.ts

import { gemini } from "@/lib/ai/gemini";
import { NextResponse } from "next/server";

export async function GET() {
  console.log(Object.keys(gemini.models));

  return NextResponse.json({
    ok: true,
  });
}