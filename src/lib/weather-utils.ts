export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return iconMap[iconCode] || "🌤️";
}

export function getWindDirection(deg: number): string {
  const directions = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatHour(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("ko-KR", {
    hour: "numeric",
    hour12: true,
  });
}

export function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "오늘";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "내일";
  }

  return date.toLocaleDateString("ko-KR", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getUVILevel(uvi: number): { level: string; color: string } {
  if (uvi <= 2) return { level: "낮음", color: "text-green-500" };
  if (uvi <= 5) return { level: "보통", color: "text-yellow-500" };
  if (uvi <= 7) return { level: "높음", color: "text-orange-500" };
  if (uvi <= 10) return { level: "매우 높음", color: "text-red-500" };
  return { level: "위험", color: "text-purple-500" };
}

export function getWeatherBackground(weatherMain: string, isDay: boolean): string {
  const backgrounds: Record<string, string> = {
    Clear: isDay
      ? "from-sky-400 to-blue-500"
      : "from-indigo-900 to-slate-900",
    Clouds: isDay
      ? "from-slate-300 to-slate-400"
      : "from-slate-700 to-slate-800",
    Rain: "from-slate-500 to-slate-600",
    Drizzle: "from-slate-400 to-slate-500",
    Thunderstorm: "from-slate-700 to-slate-800",
    Snow: "from-slate-200 to-blue-200",
    Mist: "from-slate-300 to-slate-400",
    Fog: "from-slate-300 to-slate-400",
    Haze: "from-amber-200 to-amber-300",
  };
  return backgrounds[weatherMain] || (isDay ? "from-sky-400 to-blue-500" : "from-indigo-900 to-slate-900");
}
