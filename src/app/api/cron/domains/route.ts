import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/domains`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error en cron job desde GET:", error);
    return NextResponse.json({ message: "Error en la ejecución del cron job desde GET." }, { status: 500 });
  }
}