import { NextResponse } from "next/server";

export async function GET(req: Request) {
  
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
    const response = await fetch(`${process.env.BASE_URL}/api/domains`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CRON_SECRET}`
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error en cron job desde GET:", error);
    return NextResponse.json({ message: "Error en la ejecución del cron job desde GET." }, { status: 500 });
  }
}