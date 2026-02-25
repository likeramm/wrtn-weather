import { NextRequest, NextResponse } from "next/server";
import { GeoLocation } from "@/lib/types";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch geocode data" },
        { status: response.status }
      );
    }

    const data: GeoLocation[] = await response.json();

    const results = data.map((item) => ({
      name: item.local_names?.ko || item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Geocode API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch geocode data" },
      { status: 500 }
    );
  }
}
