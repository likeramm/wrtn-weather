"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/lib/hooks/useSearch";
import { SearchHistory, FavoriteLocation } from "@/lib/types";

interface SearchLocationProps {
  onSelect: (lat: number, lon: number) => void;
  onCurrentLocation: () => void;
  searchHistory: SearchHistory[];
  favorites: FavoriteLocation[];
}

export function SearchLocation({
  onSelect,
  onCurrentLocation,
  searchHistory,
  favorites,
}: SearchLocationProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { results, loading, search, clearResults } = useSearch();
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        search(query);
      }, 300);
    } else {
      clearResults();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, search, clearResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lat: number, lon: number) => {
    setOpen(false);
    setQuery("");
    clearResults();
    onSelect(lat, lon);
  };

  const showDropdown = mounted && open && (
    results.length > 0 || 
    loading || 
    (query && results.length === 0) ||
    (!query && (favorites.length > 0 || searchHistory.length > 0))
  );

  return (
    <div className="flex gap-2">
      <div className="relative flex-1" ref={containerRef}>
        <Input
          placeholder="도시 검색 (예: 서울, 부산, Tokyo)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full"
        />
        {showDropdown && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            <Command>
              <CommandList>
                {loading && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    검색 중...
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                )}

                {results.length > 0 && (
                  <CommandGroup heading="검색 결과">
                    {results.map((result, index) => (
                      <CommandItem
                        key={`${result.lat}-${result.lon}-${index}`}
                        onSelect={() => handleSelect(result.lat, result.lon)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">📍</span>
                        <span>
                          {result.name}
                          {result.state && `, ${result.state}`}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {result.country}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {!query && favorites.length > 0 && (
                  <CommandGroup heading="즐겨찾기">
                    {favorites.map((fav) => (
                      <CommandItem
                        key={`fav-${fav.lat}-${fav.lon}`}
                        onSelect={() => handleSelect(fav.lat, fav.lon)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">⭐</span>
                        <span>{fav.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {fav.country}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {!query && searchHistory.length > 0 && (
                  <CommandGroup heading="최근 검색">
                    {searchHistory.map((history) => (
                      <CommandItem
                        key={`history-${history.lat}-${history.lon}`}
                        onSelect={() => handleSelect(history.lat, history.lon)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">🕐</span>
                        <span>{history.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {history.country}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      <Button variant="outline" size="icon" onClick={onCurrentLocation} title="현재 위치">
        <span className="text-lg">📍</span>
      </Button>
    </div>
  );
}
