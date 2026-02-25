"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-400 to-slate-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-8 w-32 bg-white/20" />
              <Skeleton className="mt-2 h-4 w-16 bg-white/20" />
            </div>
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full bg-white/20" />
            <div>
              <Skeleton className="h-16 w-32 bg-white/20" />
              <Skeleton className="mt-2 h-5 w-24 bg-white/20" />
            </div>
          </div>

          <Skeleton className="mt-6 h-4 w-28 bg-white/20" />

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg bg-white/20" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-20 shrink-0 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
