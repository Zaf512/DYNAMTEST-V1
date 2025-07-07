const SHEET_ID = '16MPcuCSimsxl1AvEnOoLD8xJam944L-QNLiNBx6N3ds';
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

async function fetchData() {
  const res = await fetch(URL);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  return json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));
}

function renderHouseholdChart(data) {
  const startIndex = data.findIndex(r => r[0]?.toString().startsWith("IDP"));
  const rows = data.slice(startIndex, startIndex + 4);
  const labels = rows.map(r => r[0]);
  const values = rows.map(r => +r[1]);

  new Chart(document.getElementById("householdChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Households",
        data: values,
        backgroundColor: "steelblue"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderPopGenderChart(data) {
  const ageLabels = data[0].slice(46, 63);
  const male = data[1].slice(46, 63).map(Number);
  const female = data[2].slice(46, 63).map(Number);

  new Chart(document.getElementById("popGenderChart"), {
    type: "bar",
    data: {
      labels: ageLabels,
      datasets: [
        { label: "Male", data: male, backgroundColor: "#66c2a5" },
        { label: "Female", data: female, backgroundColor: "#fc8d62" }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

async function renderCharts() {
  const data = await fetchData();
  renderHouseholdChart(data);
  renderPopGenderChart(data);
}

// Initial load and refresh every 60 seconds
renderCharts();
setInterval(renderCharts, 60000);
