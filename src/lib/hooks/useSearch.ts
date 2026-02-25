"use client";

import { useState, useCallback } from "react";
import { GeoLocation } from "@/lib/types";

interface SearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("검색에 실패했습니다");
      }
      const data: GeoLocation[] = await response.json();
      setResults(
        data.map((item) => ({
          name: item.name,
          lat: item.lat,
          lon: item.lon,
          country: item.country,
          state: item.state,
        }))
      );
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { results, loading, search, clearResults };
}
