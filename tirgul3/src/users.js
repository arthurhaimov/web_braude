import "./style.css";

const file = "/db.json";
let users = [];
const registeredUsersKey = "tirgul3Users";

function initUsers() {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
      const data = JSON.parse(rawFile.responseText);
      const registeredUsers = JSON.parse(
        localStorage.getItem(registeredUsersKey) || "[]"
      );
      users = mergeUsers(data.users, registeredUsers);
    }
  };
  rawFile.send(null);
}

function mergeUsers(databaseUsers, registeredUsers) {
  const merged = [...databaseUsers];

  registeredUsers.forEach((registeredUser) => {
    if (!merged.some((user) =>
      user.username === registeredUser.username
      || user.email === registeredUser.email
    )) {
      merged.push(registeredUser);
    }
  });

  return merged;
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
  localStorage.setItem(
    registeredUsersKey,
    JSON.stringify(
      users.filter((user) =>
        !(user.username === "lala" || user.username === "maya")
      )
    )
  );
  updateData();
}

function getUserCount() {
  if (users.length === 0) initUsers();
  return users.length;
}

window.find = find;
window.add = add;
window.updateJsonCell = updateJsonCell;
window.getUserCount = getUserCount;
