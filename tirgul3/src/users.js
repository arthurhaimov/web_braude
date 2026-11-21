import "./style.css";

const file = "/db.json";
let users = [];

function initUsers() {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
      const data = JSON.parse(rawFile.responseText);
      users = data.users;
    }
  };
  rawFile.send(null);
}

function find(nameOrMail) {
  if (users.length === 0) {
    initUsers();
  }
  return users.find(
    (user) => user.username === nameOrMail || user.email === nameOrMail
  );
}

function updateData() {
  const data = `{ "users": ${JSON.stringify(users)} }`;
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = file;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function updateJsonCell(rowIndex, field, value) {
  initUsers();
  if (!users[rowIndex]) return;
  users[rowIndex][field] = value;
  updateData();
}

function add(username, email, password, dob, isAdmin) {
  initUsers();
  users.push({ username, email, password, dob, isAdmin });
  updateData();
}

window.find = find;
window.add = add;
window.updateJsonCell = updateJsonCell;
