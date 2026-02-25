"use client";

import { useWeather } from "@/lib/hooks/useWeather";
import { SearchLocation } from "./SearchLocation";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyForecast } from "./HourlyForecast";
import { DailyForecast } from "./DailyForecast";
import { WeatherSkeleton } from "./WeatherSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WeatherDashboard() {
  const {
    weather,
    loading,
    error,
    searchHistory,
    favorites,
    fetchWeather,
    getCurrentLocation,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useWeather();

  const handleToggleFavorite = () => {
    if (!weather) return;

    const { lat, lon, name, country } = weather.location;
    if (isFavorite(lat, lon)) {
      removeFavorite(lat, lon);
    } else {
      addFavorite({ name, lat, lon, country });
    }
  };

  return (
    <div className="space-y-6">
      <SearchLocation
        onSelect={fetchWeather}
        onCurrentLocation={getCurrentLocation}
        searchHistory={searchHistory}
        favorites={favorites}
      />

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between p-4">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={getCurrentLocation}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && <WeatherSkeleton />}

      {!loading && weather && (
        <div className="space-y-6">
          <CurrentWeather
            weather={weather}
            isFavorite={isFavorite(weather.location.lat, weather.location.lon)}
            onToggleFavorite={handleToggleFavorite}
          />
          <HourlyForecast hourly={weather.hourly} />
          <DailyForecast daily={weather.daily} />
        </div>
      )}
    </div>
  );
}
