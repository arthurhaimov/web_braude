import "./style.css";
import "./users.js";

window.onload = function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userName = document.getElementById("userName");

  if (!currentUser || !currentUser.isAdmin) {
    window.location.href = "/src/login.html";
    return;
  }

  userName.textContent = `Welcome ${currentUser.username}`;
  fetch("/db.json")
    .then((response) => response.json())
    .then((jsonData) => populateTable("usersData", jsonData));
};

function populateTable(tableId, jsonData) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");
  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (jsonData.users.length > 0) {
    const headers = Object.keys(jsonData.users[0]).filter(
      (header) => header !== "password"
    );

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.classList.add("px-4", "py-2", "text-left");
      thead.appendChild(th);
    });

    jsonData.users.forEach((item, rowIndex) => {
      const tr = document.createElement("tr");
      headers.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = String(item[header]);
        td.classList.add("border", "px-4", "py-2");
        td.dataset.rowIndex = rowIndex;
        td.dataset.field = header;
        td.addEventListener("dblclick", () => editable.edit(td));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  } else {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = "No data found in JSON.";
    td.className = "border px-4 py-2";
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

const editable = {
  cell: null,
  oldValue: null,
  edit(cell) {
    editable.cell = cell;
    editable.oldValue = cell.textContent;
    cell.classList.add("bg-yellow-100");
    cell.contentEditable = "true";
    cell.focus();
    cell.onblur = () => editable.done();
    cell.onkeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        editable.done();
      } else if (event.key === "Escape") {
        editable.done(true);
      }
    };
  },
  done(discard = false) {
    if (!editable.cell) return;
    editable.cell.onblur = null;
    editable.cell.onkeydown = null;
    editable.cell.classList.remove("bg-yellow-100");
    editable.cell.contentEditable = "false";

    if (discard) {
      editable.cell.textContent = editable.oldValue;
    } else if (editable.cell.textContent !== editable.oldValue) {
      window.updateJsonCell(
        Number(editable.cell.dataset.rowIndex),
        editable.cell.dataset.field,
        editable.cell.textContent
      );
    }

    editable.cell = null;
  }
};

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/src/login.html";
});
