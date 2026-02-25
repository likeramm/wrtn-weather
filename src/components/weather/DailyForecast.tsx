"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyForecast as DailyForecastType } from "@/lib/types";
import { getWeatherIcon, formatDay } from "@/lib/weather-utils";

interface DailyForecastProps {
  daily: DailyForecastType[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const maxTemp = Math.max(...daily.map((d) => d.temp.max));
  const minTemp = Math.min(...daily.map((d) => d.temp.min));
  const tempRange = maxTemp - minTemp;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">7일 예보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {daily.map((day) => {
          const barStart = ((day.temp.min - minTemp) / tempRange) * 100;
          const barWidth = ((day.temp.max - day.temp.min) / tempRange) * 100;

          return (
            <div
              key={day.dt}
              className="flex items-center gap-4 rounded-lg px-2 py-2 hover:bg-muted/50"
            >
              <span className="w-16 text-sm font-medium">{formatDay(day.dt)}</span>
              <span className="text-2xl">{getWeatherIcon(day.weather.icon)}</span>
              {day.pop > 0 && (
                <span className="w-12 text-xs text-blue-500">💧 {day.pop}%</span>
              )}
              {day.pop === 0 && <span className="w-12" />}
              <span className="w-10 text-right text-sm text-muted-foreground">
                {day.temp.min}°
              </span>
              <div className="relative h-1.5 flex-1 rounded-full bg-muted">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                  style={{
                    left: `${barStart}%`,
                    width: `${Math.max(barWidth, 5)}%`,
                  }}
                />
              </div>
              <span className="w-10 text-sm font-medium">{day.temp.max}°</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
