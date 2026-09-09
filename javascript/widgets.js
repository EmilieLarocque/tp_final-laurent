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

// Génère des créneaux d'exemple pour les 3 prochains jours ouvrables, calculés à
// partir d'aujourd'hui (plutôt que des dates codées en dur qui finissent toujours
// par tomber dans le passé). Ajuste les heures/disponibilités selon tes vraies
// disponibilités.
function buildAvailability() {
  const slotTemplate = [
    { time: "09:00", available: true },
    { time: "14:00", available: false },
  ];
  const availability = {};
  const cursor = new Date();
  let daysAdded = 0;
  while (daysAdded < 3) {
    cursor.setDate(cursor.getDate() + 1);
    const weekday = cursor.getDay(); // 0 = dimanche, 6 = samedi
    if (weekday === 0 || weekday === 6) continue;
    const dateKey = formatDateKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    availability[dateKey] = slotTemplate.map((slot) => ({ ...slot }));
    daysAdded++;
  }
  return availability;
}

const AVAILABILITY = buildAvailability();

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
    weekdayCell.className = "calendar__weekday";
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
    dayCell.className = "calendar__day";
    dayCell.textContent = day;
    dayCell.dataset.date = dateKey;

    if (day === today.getDate()) {
      dayCell.classList.add("calendar__day--today");
    }

    if (AVAILABILITY[dateKey]) {
      dayCell.classList.add("calendar__day--has-slots");
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

  document.querySelectorAll(".calendar__day--selected").forEach(function (cell) {
    cell.classList.remove("calendar__day--selected");
  });

  const selectedCell = document.querySelector(`.calendar__day[data-date="${dateKey}"]`);
  if (selectedCell) {
    selectedCell.classList.add("calendar__day--selected");
  }

  const slots = AVAILABILITY[dateKey];

  if (!slots) {
    slotsPanel.innerHTML = `<p class="calendar__slots-empty">Aucun créneau prévu ce jour-là.</p>`;
    return;
  }

  slotsPanel.innerHTML = slots
    .map(function (slot) {
      const status = slot.available ? "calendar__slot--available" : "calendar__slot--unavailable";
      const label = slot.available ? "Dispo" : "Pris";
      return `
        <div class="calendar__slot ${status}">
          <span>${slot.time}</span>
          <span>${label}</span>
        </div>
      `;
    })
    .join("");
}

renderCalendar();
