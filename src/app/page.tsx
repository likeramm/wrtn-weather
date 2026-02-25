import { WeatherDashboard } from "@/components/weather";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <main className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Simple Weather</h1>
          <p className="mt-2 text-muted-foreground">
            간편하게 확인하는 날씨 정보
          </p>
        </header>

        <WeatherDashboard />

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by OpenWeatherMap</p>
        </footer>
      </main>
    </div>
  );
}
