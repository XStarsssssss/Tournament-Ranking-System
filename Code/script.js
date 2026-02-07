const tableBody = document.querySelector("#rankingTable tbody");
let teams = JSON.parse(localStorage.getItem("teamsData")) || [];

function saveData() {
  localStorage.setItem("teamsData", JSON.stringify(teams));
}

function renderTable() {
  teams.sort((a, b) => (b.marks || 0) - (a.marks || 0));
  tableBody.innerHTML = "";

  teams.forEach((team, index) => {
    let rankClass = index === 0 ? "rank1" : index === 1 ? "rank2" : index === 2 ? "rank3" : "";

    const row = document.createElement("tr");

    if (team.zone) {
      row.classList.add(team.zone + "-zone");
    }

    row.innerHTML = `
      <td class="${rankClass}">${index + 1}</td>
      <td>
        <img src="${team.logo || 'https://via.placeholder.com/50'}" class="team-logo">
        <input type="file" accept="image/*" onchange="uploadLogo(event, ${index})">
      </td>
      <td><input type="text" value="${team.name}" id="name-${index}"></td>
      <td><input type="number" value="${team.matches}" id="m-${index}" min="0"></td>
      <td><input type="number" value="${team.wins}" id="w-${index}" min="0"></td>
      <td><input type="number" value="${team.losses}" id="l-${index}" min="0"></td>
      <td><input type="number" value="${team.marks}" id="mark-${index}" min="0"></td>
      <td><button class="save-btn" onclick="updateTeam(${index})">Save</button></td>
      <td><button class="delete-btn" onclick="removeTeam(${index})">Remove</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function updateTeam(index) {
  teams[index].name = document.getElementById(`name-${index}`).value;
  teams[index].wins = parseInt(document.getElementById(`w-${index}`).value) || 0;
  teams[index].losses = parseInt(document.getElementById(`l-${index}`).value) || 0;
  teams[index].matches = parseInt(document.getElementById(`m-${index}`).value) || teams[index].wins + teams[index].losses;
  teams[index].marks = parseInt(document.getElementById(`mark-${index}`).value) || 0;

  saveData();
  renderTable();
}

function uploadLogo(event, index) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    teams[index].logo = e.target.result;
    saveData();
    renderTable();
  };
  reader.readAsDataURL(file);
}

function addTeam() {
  const teamNumber = teams.length + 1;
  teams.push({
    name: "Team " + teamNumber,
    marks: 0,
    matches: 0,
    wins: 0,
    losses: 0,
    logo: "",
    zone: "" 
  });
  saveData();
  renderTable();
}

function removeTeam(index) {
  if (confirm("Remove this team?")) {
    teams.splice(index, 1);
    saveData();
    renderTable();
  }
}

function resetData() {
  if (confirm("Delete ALL teams and scores?")) {
    localStorage.removeItem("teamsData");
    teams = [];
    renderTable();
  }
}

function setZone(type) {
  let from = parseInt(prompt("Start rank number:"));
  let to = parseInt(prompt("End rank number:"));

  if (isNaN(from) || isNaN(to) || from < 1 || to < 1 || from > to) {
    alert("Invalid range");
    return;
  }

  teams.forEach(team => {
    if (team.zone === type) team.zone = "";
  });

  for (let i = from - 1; i <= to - 1 && i < teams.length; i++) {
    teams[i].zone = type;
  }

  saveData();
  renderTable();
}

renderTable();
