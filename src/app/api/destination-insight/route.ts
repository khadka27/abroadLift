import { NextRequest, NextResponse } from "next/server";

// Kathmandu Coordinates for distance calculation
const KATHMANDU_COORDS = { lat: 27.7172, lon: 85.3240 };

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "London";
  const country = searchParams.get("country") || "GB";

  try {
    // 1. Get Geocoding (Lat/Lon)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
       return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const { latitude, longitude, timezone, country: countryName } = geoData.results[0];

    // 2. Get Current Weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=${encodeURIComponent(timezone)}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    // 3. Distance from Home (Kathmandu)
    const distance = calculateDistance(KATHMANDU_COORDS.lat, KATHMANDU_COORDS.lon, latitude, longitude);

    return NextResponse.json({
      city: geoData.results[0].name,
      country: countryName,
      temp: weatherData.current_weather.temperature,
      condition: weatherData.current_weather.weathercode, // WMO Weather Interpretation Codes
      isDay: weatherData.current_weather.is_day === 1,
      timezone: timezone,
      distance: distance,
      lat: latitude,
      lon: longitude,
      localTime: new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    console.error("Destination Insight error:", error);
    return NextResponse.json({ error: "Failed to fetch destination insights" }, { status: 500 });
  }
}
