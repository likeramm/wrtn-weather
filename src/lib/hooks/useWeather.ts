"use client";

import { useState, useEffect, useCallback } from "react";
import { WeatherData, SearchHistory, FavoriteLocation } from "@/lib/types";

const SEARCH_HISTORY_KEY = "weather_search_history";
const FAVORITES_KEY = "weather_favorites";
const DEFAULT_LOCATION = { lat: 37.5665, lon: 126.978 }; // Seoul

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "날씨 정보를 불러올 수 없습니다");
      }
      const data: WeatherData = await response.json();
      setWeather(data);

      const newHistory: SearchHistory = {
        name: data.location.name,
        lat: data.location.lat,
        lon: data.location.lon,
        country: data.location.country,
        timestamp: Date.now(),
      };

      setSearchHistory((prev) => {
        const filtered = prev.filter(
          (h) => !(Math.abs(h.lat - lat) < 0.01 && Math.abs(h.lon - lon) < 0.01)
        );
        const updated = [newHistory, ...filtered].slice(0, 5);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      },
      { timeout: 10000 }
    );
  }, [fetchWeather]);

  const addFavorite = useCallback((location: FavoriteLocation) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => Math.abs(f.lat - location.lat) < 0.01 && Math.abs(f.lon - location.lon) < 0.01
      );
      if (exists) return prev;

      const updated = [...prev, location].slice(0, 10);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((lat: number, lon: number) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (f) => !(Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01)
      );
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (lat: number, lon: number) => {
      return favorites.some(
        (f) => Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01
      );
    },
    [favorites]
  );

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
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
  };
}
