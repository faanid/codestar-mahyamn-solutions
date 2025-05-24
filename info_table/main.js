let allCars = [];
let filteredCars = [];
let searchTimeout = null;
let yearTimeout = null;

const searchInput = document.getElementById("searchInput");
const yearFilter = document.getElementById("yearFilter");
const carsTableBody = document.querySelector("#carsTable tbody");

fetchCarsData().then((cars) => {
  allCars = cars;
  filteredCars = [...cars];
  renderCars(filteredCars);
  createYearFilterList(allCars);
  searchInput.disabled = false;
  yearFilter.disabled = false;
});


function showSpinner() {
  showLoadingInTable();
}

function renderCars(cars) {
  carsTableBody.innerHTML = "";

  if (cars.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", 4);
    cell.textContent = "🚫 هیچ ماشینی با شرایط مورد نظر یافت نشد.";
    cell.classList.add("text-center", "text-danger");
    row.appendChild(cell);
    carsTableBody.appendChild(row);
    return;
  }

  cars.forEach((car) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${car.name}</td>
      <td>${car.model}</td>
      <td>${car.year}</td>
      <td>${car.color}</td>
    `;
    carsTableBody.appendChild(row);
  });
}

function createYearFilterList(cars) {
  const years = [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a);

  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = `سال ${year}`;
    yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedYear = yearFilter.value;

  filteredCars = allCars.filter((car) => {
    const nameMatch = car.name.toLowerCase().includes(searchValue);
    const yearMatch = selectedYear ? car.year === +selectedYear : true;
    return nameMatch && yearMatch;
  });

  renderCars(filteredCars);
}

searchInput.addEventListener("input", () => {
  showSpinner();
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 2500);
});
yearFilter.addEventListener("change", () => {
  showSpinner();
  clearTimeout(yearTimeout);
  yearTimeout = setTimeout(() => {
    applyFilters();
  }, 1000);
});
function showLoadingInTable() {
  carsTableBody.innerHTML = "";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.setAttribute("colspan", 4);
  cell.classList.add("text-center");
  cell.innerHTML = `<div class="spinner-border text-primary" role="status"><span class="visually-hidden">در حال بارگذاری...</span></div>`;
  row.appendChild(cell);
  carsTableBody.appendChild(row);
}
