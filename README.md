# Weather-pulse-
# WeatherPulse 🌤️

A modern, responsive weather dashboard built with HTML, Tailwind CSS, and vanilla JavaScript.  
Explore real-time weather conditions, hourly & weekly forecasts for any location worldwide — with a special focus on Nigeria's 36 states.

https://github.com/yourusername/weather-pulse/assets/yourusername/some-screenshot.gif  
*(Replace with a live demo GIF or screenshot when you have one)*

## Features

- 🌍 Hierarchical navigation: Countries → States → Detailed Weather
- 🇳🇬 Special support for all 36 Nigerian states + FCT
- 📊 Clean, mobile-first thin-row tables (inspired by crypto dashboards)
- 🗺️ Interactive Leaflet map showing the selected state
- ☀️ Dynamic background gradients that change based on current weather
- 🌡️ Real-time current conditions + humidity, wind speed
- ⏱️ Scrollable hourly forecast (next 8 hours)
- 📅 5-day (weekly) forecast grid
- 🔍 Live search/filter across countries and states
- 🔄 Auto-refresh weather data every 5 minutes in detail view
- ⚡ Responsive design — works beautifully on mobile, tablet, and desktop
- No backend required — pure client-side with free APIs

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Maps**: Leaflet.js
- **Geocoding**: Nominatim (OpenStreetMap) — free, no key
- **Weather Data**: Open-Meteo — completely free, no API key required
- **Country/State Data**: CountriesNow API — free, no key

## Live Demo

🔗 **[Try WeatherPulse Live](https://yourusername.github.io/weather-pulse/)**  
*(Deploy to GitHub Pages, Netlify, Vercel, etc. and update this link)*

## Screenshots

# WeatherPulse 🌤️

A modern, responsive, real-time weather dashboard built with pure frontend technologies.  
Navigate through countries → states → detailed weather forecasts, with special support for all 36 Nigerian states + FCT.

Built with clean, mobile-first design and thin-row tables inspired by premium crypto dashboards.  
Perfect for checking local weather anywhere in Nigeria (or worldwide) with dynamic visuals and interactive maps.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/weather-pulse?style=social)](https://github.com/yourusername/weather-pulse)

## Features

- 🌍 Hierarchical navigation: Countries → States → Weather Forecast
- 🇳🇬 Full support for Nigeria's 36 states + Federal Capital Territory
- 📊 Thin, clickable row tables (crypto-dashboard style) for countries & states
- 🗺️ Interactive Leaflet map centered on the selected state
- ☀️ Dynamic background gradients that change based on current weather conditions (sunny yellow, rainy blue, etc.)
- 🌡️ Real-time current weather (temperature, condition, humidity, wind speed)
- ⏱️ Scrollable hourly forecast (next 8 hours)
- 📅 5-day weekly forecast grid
- 🔍 Live search/filter for countries and states
- 🔄 Auto-refresh weather data every 5 minutes when viewing a location
- ⚡ Fully responsive — mobile, tablet, and desktop friendly
- No backend or API keys required for weather data (uses completely free APIs)

## Screenshots

### Countries List
![Countries View](screenshots/countries.png)

### Nigerian States
![Nigeria States View](screenshots/nigeria-states.png)

### Weather Detail + Map (e.g., Lagos)
![Weather Detail View](screenshots/lagos-weather.png)

*(Add your own screenshots to a `screenshots/` folder in the repo and update the paths)*

## Live Demo

🔗 **[Try WeatherPulse Live](https://yourusername.github.io/weather-pulse/)**  
*(Deploy to GitHub Pages, Netlify, Vercel, Surge, or any static host and replace this link)*

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (via CDN), Vanilla JavaScript
- **Maps**: Leaflet.js (open-source interactive maps)
- **Geocoding**: Nominatim (OpenStreetMap) — free, no API key
- **Weather Data**: Open-Meteo — 100% free, no API key, no signup, high-accuracy forecasts
- **Country & State Data**: CountriesNow API — free, no key required

## How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/weather-pulse.git
cd weather-pulse
