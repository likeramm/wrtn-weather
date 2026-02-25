"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherData } from "@/lib/types";
import { getWeatherIcon, getWindDirection, getUVILevel } from "@/lib/weather-utils";

interface CurrentWeatherProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CurrentWeather({ weather, isFavorite, onToggleFavorite }: CurrentWeatherProps) {
  const { location, current } = weather;
  const uviInfo = current.uvi !== undefined ? getUVILevel(current.uvi) : null;

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{location.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isFavorite ? "★" : "☆"}
              </Button>
            </div>
            <p className="text-sm text-white/80">{location.country}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">
              최고 {current.temp_max}° / 최저 {current.temp_min}°
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-7xl">{getWeatherIcon(current.weather.icon)}</span>
            <div>
              <p className="text-6xl font-light">{current.temp}°</p>
              <p className="text-lg text-white/80">{current.weather.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-white/80">
          체감온도 {current.feels_like}°
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailItem label="습도" value={`${current.humidity}%`} icon="💧" />
          <DetailItem
            label="바람"
            value={`${current.wind_speed}m/s ${getWindDirection(current.wind_deg)}`}
            icon="💨"
          />
          <DetailItem label="기압" value={`${current.pressure}hPa`} icon="📊" />
          <DetailItem
            label="가시거리"
            value={`${(current.visibility / 1000).toFixed(1)}km`}
            icon="👁️"
          />
        </div>

        {uviInfo && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span>☀️ 자외선 지수:</span>
            <span className={`font-medium ${uviInfo.color}`}>
              {current.uvi} ({uviInfo.level})
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <div className="flex items-center gap-1 text-xs text-white/70">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
