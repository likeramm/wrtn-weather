import { NextRequest, NextResponse } from "next/server";
import { WeatherData } from "@/lib/types";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon parameters are required" },
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
    const [currentRes, forecastRes, geoRes] = await Promise.all([
      fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`,
        { next: { revalidate: 300 } }
      ),
      fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`,
        { next: { revalidate: 300 } }
      ),
      fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!currentRes.ok) {
      const errorData = await currentRes.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch weather data" },
        { status: currentRes.status }
      );
    }

    const [currentData, forecastData, geoData] = await Promise.all([
      currentRes.json(),
      forecastRes.json(),
      geoRes.json(),
    ]);

    const locationName = geoData[0]?.local_names?.ko || geoData[0]?.name || currentData.name || "Unknown";

    const hourlyForecasts = forecastData.list.slice(0, 8).map((item: Record<string, unknown>) => ({
      dt: item.dt,
      temp: Math.round((item.main as Record<string, number>).temp),
      feels_like: Math.round((item.main as Record<string, number>).feels_like),
      humidity: (item.main as Record<string, number>).humidity,
      weather: {
        id: (item.weather as Array<Record<string, unknown>>)[0].id,
        main: (item.weather as Array<Record<string, unknown>>)[0].main,
        description: (item.weather as Array<Record<string, unknown>>)[0].description,
        icon: (item.weather as Array<Record<string, unknown>>)[0].icon,
      },
      pop: Math.round(((item.pop as number) || 0) * 100),
    }));

    const dailyMap = new Map<string, { temps: number[]; item: Record<string, unknown>; pop: number }>();
    forecastData.list.forEach((item: Record<string, unknown>) => {
      const date = new Date((item.dt as number) * 1000).toDateString();
      const temp = (item.main as Record<string, number>).temp;
      const pop = ((item.pop as number) || 0) * 100;
      
      if (dailyMap.has(date)) {
        const existing = dailyMap.get(date)!;
        existing.temps.push(temp);
        existing.pop = Math.max(existing.pop, pop);
      } else {
        dailyMap.set(date, { temps: [temp], item, pop });
      }
    });

    const dailyForecasts = Array.from(dailyMap.entries()).slice(0, 5).map(([, data]) => ({
      dt: data.item.dt,
      temp: {
        min: Math.round(Math.min(...data.temps)),
        max: Math.round(Math.max(...data.temps)),
      },
      humidity: (data.item.main as Record<string, number>).humidity,
      weather: {
        id: (data.item.weather as Array<Record<string, unknown>>)[0].id,
        main: (data.item.weather as Array<Record<string, unknown>>)[0].main,
        description: (data.item.weather as Array<Record<string, unknown>>)[0].description,
        icon: (data.item.weather as Array<Record<string, unknown>>)[0].icon,
      },
      pop: Math.round(data.pop),
    }));

    const result: WeatherData = {
      location: {
        name: locationName,
        country: geoData[0]?.country || currentData.sys?.country || "",
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      },
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        temp_min: Math.round(currentData.main.temp_min),
        temp_max: Math.round(currentData.main.temp_max),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        wind_speed: currentData.wind.speed,
        wind_deg: currentData.wind.deg || 0,
        visibility: currentData.visibility || 10000,
        clouds: currentData.clouds?.all || 0,
        weather: {
          id: currentData.weather[0].id,
          main: currentData.weather[0].main,
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
        },
      },
      hourly: hourlyForecasts,
      daily: dailyForecasts,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
