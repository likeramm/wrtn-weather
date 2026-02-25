"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HourlyForecast as HourlyForecastType } from "@/lib/types";
import { getWeatherIcon, formatHour } from "@/lib/weather-utils";

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">시간별 예보</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {hourly.slice(0, 12).map((hour, index) => (
              <div
                key={hour.dt}
                className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">
                  {index === 0 ? "지금" : formatHour(hour.dt)}
                </span>
                <span className="text-2xl">{getWeatherIcon(hour.weather.icon)}</span>
                <span className="text-lg font-semibold">{hour.temp}°</span>
                {hour.pop > 0 && (
                  <span className="text-xs text-blue-500">💧 {hour.pop}%</span>
                )}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
