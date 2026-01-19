
  // API Keys
  const WEATHER_API_KEY = 'b762e2da48695c212bbca1421697bb7c'; // Your OpenWeatherMap key here

  // Elements
  const loading = document.getElementById('loading');
  const countriesView = document.getElementById('countriesView');
  const statesView = document.getElementById('statesView');
  const weatherView = document.getElementById('weatherView');
  const countriesContainer = document.getElementById('countriesContainer');
  const statesContainer = document.getElementById('statesContainer');
  const countryNameEl = document.getElementById('countryName');
  const backToCountries = document.getElementById('backToCountries');
  const backToStates = document.getElementById('backToStates');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');
  const bodyBg = document.getElementById('bodyBg');
  const locationName = document.getElementById('locationName');
  const currentCondition = document.getElementById('currentCondition');
  const currentTemp = document.getElementById('currentTemp');
  const currentHumidity = document.getElementById('currentHumidity');
  const currentWind = document.getElementById('currentWind');
  const hourlyForecast = document.getElementById('hourlyForecast');
  const dailyForecast = document.getElementById('dailyForecast');

  let allCountries = [];
  let currentCountry = null;
  let currentState = null;
  let weatherUpdateInterval = null;
  let map = null;

  // Fetch countries and states (free API)
  async function fetchCountries() {
    loading.classList.remove('hidden');
    countriesView.classList.add('hidden');
    statesView.classList.add('hidden');
    weatherView.classList.add('hidden');

    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states');
      const data = await res.json();
      allCountries = data.data.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      renderCountries(allCountries);
    } catch (err) {
      console.error(err);
      countriesContainer.innerHTML = `<div class="text-center py-20 text-red-500">Failed to load countries. Try again later.</div>`;
    } finally {
      loading.classList.add('hidden');
      countriesView.classList.remove('hidden');
    }
  }

  // Render countries as thin rows
  function renderCountries(countries) {
    countriesContainer.innerHTML = '';
    countries.forEach(country => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between px-4 py-3 hover:bg-gray-700/70 transition-all border-b border-gray-700/50 last:border-b-0 cursor-pointer';
      row.innerHTML = `
        <div class="flex items-center gap-3 flex-1">
          <span class="text-sm font-semibold">${country.name}</span>
        </div>
        <span class="text-sm text-gray-400">${country.states.length} States</span>
      `;
      row.addEventListener('click', () => openStates(country));
      countriesContainer.appendChild(row);
    });
  }

  // Open states view
  function openStates(country) {
    currentCountry = country;
    countryNameEl.textContent = `States in ${country.name}`;
    renderStates(country.states);
    countriesView.classList.add('hidden');
    statesView.classList.remove('hidden');
  }

  // Render states as thin rows
  function renderStates(states) {
    statesContainer.innerHTML = '';
    const sortedStates = states.sort((a, b) => a.name.localeCompare(b.name));
    sortedStates.forEach(state => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between px-4 py-3 hover:bg-gray-700/70 transition-all border-b border-gray-700/50 last:border-b-0 cursor-pointer';
      row.innerHTML = `
        <div class="flex items-center gap-3 flex-1">
          <span class="text-sm font-semibold">${state.name}</span>
        </div>
      `;
      row.addEventListener('click', () => openWeather(state.name, currentCountry.name));
      statesContainer.appendChild(row);
    });
  }


  // Open weather view for state (using Open-Meteo – no key needed)
async function openWeather(stateName, countryName) {
  currentState = stateName;
  statesView.classList.add('hidden');
  weatherView.classList.remove('hidden');
  loading.classList.remove('hidden');

  try {
    // Get lat/lon for state (still use OpenWeather geocoding – it's free/limited, or replace with Nominatim if needed)
    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${stateName},${countryName}&limit=1&appid=${WEATHER_API_KEY}`);
    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error('Location not found');
    const { lat, lon } = geoData[0];

    // Init map (same as before)
    if (map) map.remove();
    map = L.map('map').setView([lat, lon], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup(`${stateName}, ${countryName}`);

    // Fetch weather from Open-Meteo (no key!)
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`);
    const weatherData = await weatherRes.json();

    // Render weather (adapt to Open-Meteo's format – similar to OpenWeather)
    locationName.textContent = `${stateName}, ${countryName}`;
    currentCondition.textContent = getWeatherDescription(weatherData.current.weather_code); // Helper function below
    currentTemp.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
    currentHumidity.textContent = `Humidity: ${weatherData.current.relative_humidity_2m}%`;
    currentWind.textContent = `Wind: ${weatherData.current.wind_speed_10m} m/s`;

    // Background change (adapt code from weather_code – similar logic)
    const conditionCode = weatherData.current.weather_code;
    let gradClass = 'night-grad';
    if (conditionCode === 0) gradClass = 'sunny-grad'; // Clear
    else if (conditionCode >= 1 && conditionCode <= 3) gradClass = 'cloudy-grad'; // Cloudy
    else if (conditionCode >= 51) gradClass = 'rainy-grad'; // Rain
    bodyBg.className = `min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 transition-all duration-500 bg-${gradClass}`;

    // Hourly (next 8 hours – adapt)
    hourlyForecast.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const hour = weatherData.hourly;
      const card = document.createElement('div');
      card.className = 'bg-gray-800/50 rounded-xl p-4 text-center min-w-[120px] snap-center';
      card.innerHTML = `
        <p class="text-sm">${new Date(hour.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p class="text-lg font-bold">${Math.round(hour.temperature_2m[i])}°C</p>
        <p class="text-xs capitalize">${getWeatherDescription(hour.weather_code[i])}</p>
      `;
      hourlyForecast.appendChild(card);
    }

    // Daily (5 days – adapt)
    dailyForecast.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const day = weatherData.daily;
      const card = document.createElement('div');
      card.className = 'bg-gray-800/50 rounded-xl p-4 text-center';
      card.innerHTML = `
        <p class="text-sm">${new Date(day.time[i]).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        <p class="text-2xl font-bold">${Math.round(day.temperature_2m_max[i])}°C / ${Math.round(day.temperature_2m_min[i])}°C</p>
        <p class="text-xs capitalize">${getWeatherDescription(day.weather_code[i])}</p>
      `;
      dailyForecast.appendChild(card);
    }

  } catch (err) {
    console.error(err);
    locationName.textContent = 'Error loading weather';
  } finally {
    loading.classList.add('hidden');
  }

  // Auto-refresh every 5 min
  if (weatherUpdateInterval) clearInterval(weatherUpdateInterval);
  weatherUpdateInterval = setInterval(() => openWeather(currentState, currentCountry.name), 300000);
}

// Helper: Convert Open-Meteo weather code to description (add this below the function)
function getWeatherDescription(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    51: 'Light drizzle',
    61: 'Light rain',
    71: 'Light snow',
    80: 'Rain showers',
    95: 'Thunderstorm',
    // Add more as needed from https://open-meteo.com/en/docs
  };
  return codes[code] || 'Unknown';
}

  /*
  // Open weather view for state
  async function openWeather( stateName, countryName) {
    currentState = stateName;
    statesView.classList.add('hidden');
    weatherView.classList.remove('hidden');
    loading.classList.remove('hidden');

    try {
      // Get lat/lon for state (geocoding)
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${stateName},${countryName}&limit=1&appid=${WEATHER_API_KEY}`);
      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error('Location not found');
      const { lat, lon } = geoData[0];

      // Init map
      if (map) map.remove();
      map = L.map('map').setView([lat, lon], 7); // Zoom level for state view
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      L.marker([lat, lon]).addTo(map).bindPopup(`${stateName}, ${countryName}`);

      // Fetch weather
      const weatherRes = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
      const weatherData = await weatherRes.json();

      // Render weather
      locationName.textContent = `${stateName}, ${countryName}`;
      currentCondition.textContent = weatherData.current.weather[0].description;
      currentTemp.textContent = `${Math.round(weatherData.current.temp)}°C`;
      currentHumidity.textContent = `Humidity: ${weatherData.current.humidity}%`;
      currentWind.textContent = `Wind: ${weatherData.current.wind_speed} m/s`;

      // Change background based on condition
      const condition = weatherData.current.weather[0].main.toLowerCase();
      let gradClass = 'night-grad'; // Default
      if (condition.includes('clear')) gradClass = 'sunny-grad';
      else if (condition.includes('cloud')) gradClass = 'cloudy-grad';
      else if (condition.includes('rain')) gradClass = 'rainy-grad';
      else if (condition.includes('thunderstorm')) gradClass = 'stormy-grad';
      bodyBg.className = `min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 transition-all duration-500 bg-${gradClass}`;

      // Hourly (next 8 hours)
      hourlyForecast.innerHTML = '';
      weatherData.hourly.slice(0, 8).forEach(hour => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800/50 rounded-xl p-4 text-center min-w-[120px] snap-center';
        card.innerHTML = `
          <p class="text-sm">${new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p class="text-lg font-bold">${Math.round(hour.temp)}°C</p>
          <p class="text-xs capitalize">${hour.weather[0].description}</p>
        `;
        hourlyForecast.appendChild(card);
      });

      // Daily (5 days)
      dailyForecast.innerHTML = '';
      weatherData.daily.slice(0, 5).forEach(day => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800/50 rounded-xl p-4 text-center';
        card.innerHTML = `
          <p class="text-sm">${new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p class="text-2xl font-bold">${Math.round(day.temp.day)}°C</p>
          <p class="text-xs capitalize">${day.weather[0].description}</p>
        `;
        dailyForecast.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      locationName.textContent = 'Error loading weather';
    } finally {
      loading.classList.add('hidden');
    }

    // Auto-refresh weather every 5 min
    if (weatherUpdateInterval) clearInterval(weatherUpdateInterval);
    weatherUpdateInterval = setInterval(() => openWeather(currentState, currentCountry.name), 300000);
  }

  */

  // Search filter (live on countries/states)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (countriesView.classList.contains('hidden')) {
      // Filter states if in states view
      const filteredStates = currentCountry.states.filter(s => s.name.toLowerCase().includes(query));
      renderStates(filteredStates);
    } else {
      // Filter countries
      const filteredCountries = allCountries.filter(c => c.name.toLowerCase().includes(query));
      renderCountries(filteredCountries);
    }
  });

  // Back buttons
  backToCountries.addEventListener('click', () => {
    statesView.classList.add('hidden');
    countriesView.classList.remove('hidden');
  });

  backToStates.addEventListener('click', () => {
    weatherView.classList.add('hidden');
    statesView.classList.remove('hidden');
    if (weatherUpdateInterval) clearInterval(weatherUpdateInterval);
  });

  // Refresh button (refreshes current view)
  refreshBtn.addEventListener('click', () => {
    if (!weatherView.classList.contains('hidden')) {
      openWeather(currentState, currentCountry.name);
    } else if (!statesView.classList.contains('hidden')) {
      openStates(currentCountry);
    } else {
      fetchCountries();
    }
  });

  // Initial load
  fetchCountries();