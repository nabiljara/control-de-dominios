import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Webhook recibido:", payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}