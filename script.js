const API_KEY = "3GgbkLL4wJeXZ4NSzGP6cVe9K30nLjk5";

let allEvents = [];
let selectedCity = "";
let selectedCategory = "";
let timer;

// 🔄 Fetch Events (with keyword search)
async function getEvents(keyword = "") {
  const loading = document.getElementById("loading");
  loading.classList.remove("hidden");

  try {
    const res = await fetch(
      'https://app.ticketmaster.com/discovery/v2/events.json?apikey=3GgbkLL4wJeXZ4NSzGP6cVe9K30nLjk5&keyword=Madonna'
    );

    const data = await res.json();

    allEvents = data._embedded?.events || [];
    applyFilters(); // apply filters after fetching

  } catch (error) {
    console.log("Error:", error);
  }

  loading.classList.add("hidden");
}

getEvents();


// 🎨 Display Events
function displayEvents(events) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  if (events.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; width:100%">
        <h2>No events found 😔</h2>
        <p>Try different search or filter</p>
      </div>
    `;
    return;
  }

  events.map(event => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${event.images?.[0]?.url || 'https://via.placeholder.com/300'}" alt="event image">
      <h3>${event.name}</h3>
      <p><b>Date:</b> ${event.dates.start.localDate}</p>
      <p><b>City:</b> ${event._embedded?.venues[0]?.city?.name || "N/A"}</p>
      <p><b>Category:</b> ${event.classifications?.[0]?.segment?.name || "N/A"}</p>

      <button onclick="addToFavorites('${event.id}')">❤️ Favorite</button>

      <a href="${event.url}" target="_blank">
        <button>🎟️ Book</button>
      </a>
    `;

    container.appendChild(div);
  });
}


// 🔍 Search (Debounced + API call)
function searchEvents(value) {
  clearTimeout(timer);

  timer = setTimeout(() => {
    if (value.trim() === "") {
      getEvents();
    } else {
      getEvents(value);
    }
  }, 400);
}


// 🎯 Filter by City
function filterByCity(city) {
  selectedCity = city;
  applyFilters();
}


// 🎟️ Filter by Category
function filterByCategory(category) {
  selectedCategory = category;
  applyFilters();
}


// ⚙️ Apply Combined Filters
function applyFilters() {
  let filtered = allEvents;

  if (selectedCity) {
    filtered = filtered.filter(event =>
      event._embedded?.venues[0]?.city?.name === selectedCity
    );
  }

  if (selectedCategory) {
    filtered = filtered.filter(event =>
      event.classifications?.[0]?.segment?.name === selectedCategory
    );
  }

  displayEvents(filtered);
}


// 🔃 Sort by Name
function sortByName() {
  const sorted = [...allEvents].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  displayEvents(sorted);
}


// 🌙 Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}


// ❤️ Favorites (Local Storage)
function addToFavorites(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const event = allEvents.find(e => e.id === id);

  if (!favorites.some(fav => fav.id === id)) {
    favorites.push(event);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to favorites ❤️");
  } else {
    alert("Already in favorites!");
  }
}