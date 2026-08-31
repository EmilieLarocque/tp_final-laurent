/* =========================================================
   WIDGET MÉTÉO
   Récupère la météo actuelle via Open-Meteo (API gratuite,
   sans clé). Change la ville ci-dessous si besoin.
========================================================= */

const WEATHER_CITY = "Québec";
const WEATHER_LATITUDE = 46.8139;
const WEATHER_LONGITUDE = -71.208;

// Codes météo Open-Meteo -> emoji (liste simplifiée, pas exhaustive)
// Le ciel dégagé/peu nuageux a une variante de nuit (soleil -> lune)
const WEATHER_ICONS_DAY = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "🌨️",
  80: "🌧️",
  95: "⛈️",
};

const WEATHER_ICONS_NIGHT = {
  ...WEATHER_ICONS_DAY,
  0: "🌙",
  1: "🌙",
  2: "☁️",
  51: "🌧️",
};

async function loadWeather() {
  const weatherIcon = document.getElementById("weather-icon");
  const weatherTemp = document.getElementById("weather-temp");
  const weatherCity = document.getElementById("weather-city");

  weatherCity.textContent = WEATHER_CITY;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LATITUDE}&longitude=${WEATHER_LONGITUDE}&current=temperature_2m,weather_code,is_day`;
    const response = await fetch(url);
    const data = await response.json();

    const temperature = Math.round(data.current.temperature_2m);
    const icons = data.current.is_day ? WEATHER_ICONS_DAY : WEATHER_ICONS_NIGHT;

    weatherTemp.textContent = `${temperature}°`;
    weatherIcon.textContent = icons[data.current.weather_code] || "🌡️";
  } catch (error) {
    weatherTemp.textContent = "—";
  }
}

loadWeather();

/* =========================================================
   WIDGET CALENDRIER
   Affiche le mois en cours, avec le jour d'aujourd'hui en
   surbrillance. Un clic sur un jour montre mes disponibilités
   (créneaux fixés à la main ci-dessous, à mettre à jour toi-même).
========================================================= */

const WEEKDAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

// Créneaux dispo/pas dispo par date (format "AAAA-MM-JJ").
// Exemple à remplacer par tes vraies disponibilités.
const AVAILABILITY = {
  "2026-08-19": [
    { time: "09:00", available: true },
    { time: "11:00", available: false },
    { time: "14:00", available: true },
  ],
  "2026-08-20": [
    { time: "10:00", available: false },
    { time: "16:00", available: true },
  ],
};

function renderCalendar() {
  const header = document.getElementById("calendar-header");
  const grid = document.getElementById("calendar-grid");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  header.textContent = today.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  WEEKDAYS.forEach(function (day) {
    const weekdayCell = document.createElement("span");
    weekdayCell.className = "calendar-weekday";
    weekdayCell.textContent = day;
    grid.appendChild(weekdayCell);
  });

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // getDay() donne 0 pour dimanche : on décale pour commencer la semaine à lundi
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

  for (let i = 0; i < startOffset; i++) {
    grid.appendChild(document.createElement("span"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month, day);

    const dayCell = document.createElement("span");
    dayCell.className = "calendar-day";
    dayCell.textContent = day;
    dayCell.dataset.date = dateKey;

    if (day === today.getDate()) {
      dayCell.classList.add("today");
    }

    if (AVAILABILITY[dateKey]) {
      dayCell.classList.add("has-slots");
    }

    dayCell.addEventListener("click", function () {
      selectDay(dateKey);
    });

    grid.appendChild(dayCell);
  }

  selectDay(formatDateKey(year, month, today.getDate()));
}

// Transforme une date en clé "AAAA-MM-JJ" pour retrouver ses créneaux
function formatDateKey(year, month, day) {
  const monthNumber = String(month + 1).padStart(2, "0");
  const dayNumber = String(day).padStart(2, "0");
  return `${year}-${monthNumber}-${dayNumber}`;
}

// Affiche les créneaux du jour cliqué, et le met en surbrillance
function selectDay(dateKey) {
  const slotsPanel = document.getElementById("calendar-slots");

  document.querySelectorAll(".calendar-day.selected").forEach(function (cell) {
    cell.classList.remove("selected");
  });

  const selectedCell = document.querySelector(`.calendar-day[data-date="${dateKey}"]`);
  if (selectedCell) {
    selectedCell.classList.add("selected");
  }

  const slots = AVAILABILITY[dateKey];

  if (!slots) {
    slotsPanel.innerHTML = `<p class="calendar-slots-empty">Aucun créneau prévu ce jour-là.</p>`;
    return;
  }

  slotsPanel.innerHTML = slots
    .map(function (slot) {
      const status = slot.available ? "available" : "unavailable";
      const label = slot.available ? "Dispo" : "Pris";
      return `
        <div class="calendar-slot ${status}">
          <span>${slot.time}</span>
          <span>${label}</span>
        </div>
      `;
    })
    .join("");
}

renderCalendar();
