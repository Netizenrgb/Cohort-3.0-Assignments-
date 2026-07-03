const regDiv = document.getElementById("registrationdiv");
const loginDiv = document.getElementById("logindiv");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

const dashboardCont = document.querySelector("#dashboardcont");
const dashboardNavItem = document.getElementById("dashboard");
const settingsNavItem = document.getElementById("settings");
const dashboardPage = document.getElementById("dashboardPage");
const settingsPage = document.getElementById("settingsPage");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const openModalBtn = document.getElementById("addtransactionbtn");
const closeModalBtn = document.getElementById("close");
const saveTransactionBtn = document.getElementById("savetransaction");

const transactionTypeInput = document.getElementById("transactiontype");
const transactionDescInput = document.getElementById("transactiondesc");
const transactionAmtInput = document.getElementById("transactionamt");
const transactionDateInput = document.getElementById("transactiondate");
const transactionCategoryInput = document.getElementById("transactioncategory");

const transactionBody = document.getElementById("transactionbody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchtransactions");
const categoryFilterInput = document.getElementById(
  "searchtransactioncategory",
);

const changeThemeBtn = document.getElementById("changetheme");
const clearAllDataBtn = document.getElementById("clearalldata");

const saveSettingsBtn = document.getElementById("saveSettings");

let editingTransactionId = null;

//   AUTHENTICATION  REGISTER / LOGIN / LOGOUT

function showLogin() {
  regDiv.style.display = "none";
  loginDiv.style.display = "flex";
}

function showRegister() {
  loginDiv.style.display = "none";
  regDiv.style.display = "flex";
}

document.querySelectorAll(".toLogin").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  }),
);

document.querySelectorAll(".toRegister").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  }),
);

function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem("registereduser")) || [];
}

function registration() {
  const reginput = document.querySelector("#reginput").value.trim();
  const regpass = document.querySelector("#regpass").value.trim();

  if (reginput === "" || regpass === "") {
    alert("Fill in the details");
    return;
  }

  const users = getRegisteredUsers();

  const existingUser = users.find(
    (user) => user.username.toLowerCase() === reginput.toLowerCase(),
  );

  if (existingUser) {
    alert("User already exists");
    return;
  }

  users.push({ username: reginput, passcode: regpass, currency: "₹" });
  localStorage.setItem("registereduser", JSON.stringify(users));

  alert("Registration successful");

  document.querySelector("#reginput").value = "";
  document.querySelector("#regpass").value = "";

  showLogin();
}

function login() {
  const logininput = document.querySelector("#logininput").value.trim();
  const loginpass = document.querySelector("#loginpass").value.trim();

  if (logininput === "" || loginpass === "") {
    alert("Fill in the login credentials");
    return;
  }

  const users = getRegisteredUsers();
  const loggedInUser = users.find(
    (user) => user.username === logininput && user.passcode === loginpass,
  );

  if (!loggedInUser) {
    alert("Invalid username or passcode");
    return;
  }

  localStorage.setItem("currentlogeduser", loggedInUser.username);

  document.querySelector("#logininput").value = "";
  document.querySelector("#loginpass").value = "";

  enterDashboard();
}

function logout() {
  localStorage.removeItem("currentlogeduser");
  dashboardCont.classList.add("dashboardhidden");
  document.getElementById("authContainer").style.display = "flex";
  showLogin();
}

function enterDashboard() {
  document.getElementById("authContainer").style.display = "none";
  dashboardCont.classList.remove("dashboardhidden");
  showDashboardPage();
  loadSettings();
  refreshDashboardData();
}

registerBtn.addEventListener("click", registration);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

//SIDEBAR NAVIGATION — Dashboard <-> Settings

function showDashboardPage() {
  dashboardPage.classList.remove("hidden");
  settingsPage.classList.add("hidden");
  dashboardNavItem.classList.add("active");
  settingsNavItem.classList.remove("active");
}

function showSettingsPage() {
  settingsPage.classList.remove("hidden");
  dashboardPage.classList.add("hidden");
  settingsNavItem.classList.add("active");
  dashboardNavItem.classList.remove("active");
  loadSettings();
}

document
  .getElementById("dashboardbtn")
  .addEventListener("click", showDashboardPage);
document
  .getElementById("settingsbtn")
  .addEventListener("click", showSettingsPage);

//  4. TRANSACTION MODAL

function openAddModal() {
  editingTransactionId = null;
  modalTitle.textContent = "Add transaction";
  saveTransactionBtn.textContent = "Save transaction";

  transactionTypeInput.selectedIndex = 0;
  transactionDescInput.value = "";
  transactionAmtInput.value = "";
  transactionDateInput.value = "";
  transactionCategoryInput.selectedIndex = 0;

  modalOverlay.classList.remove("hidden");
}

function openEditModal(transaction) {
  editingTransactionId = transaction.id;
  modalTitle.textContent = "Edit transaction";
  saveTransactionBtn.textContent = "Update transaction";

  transactionTypeInput.value = transaction.transactiontype;
  transactionDescInput.value = transaction.transactiondesc;
  transactionAmtInput.value = transaction.transactionamt;
  transactionDateInput.value = transaction.transactiondate;
  transactionCategoryInput.value = transaction.transactioncategory;

  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  editingTransactionId = null;
}

openModalBtn.addEventListener("click", openAddModal);
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

//  TRANSACTION DATA

function currentUsername() {
  return localStorage.getItem("currentlogeduser");
}

function transactionsKey() {
  return `transactions_${currentUsername()}`;
}

function getTransactions() {
  return JSON.parse(localStorage.getItem(transactionsKey())) || [];
}

function saveTransactionsList(transactions) {
  localStorage.setItem(transactionsKey(), JSON.stringify(transactions));
}

function saveTransaction() {
  const transactiontype = transactionTypeInput.value;
  const transactiondesc = transactionDescInput.value.trim();
  const transactionamt = Number(transactionAmtInput.value);
  const transactiondate = transactionDateInput.value;
  const transactioncategory = transactionCategoryInput.value;

  if (transactiondesc === "") {
    alert("Description is empty");
    return;
  }
  if (transactionamt <= 0 || isNaN(transactionamt)) {
    alert("Enter a valid amount");
    return;
  }
  if (transactiondate === "") {
    alert("Select a date");
    return;
  }
  if (transactioncategory === "Select Category") {
    alert("Select a category");
    return;
  }

  const transactions = getTransactions();

  if (editingTransactionId) {
    const index = transactions.findIndex((t) => t.id === editingTransactionId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        transactiontype,
        transactiondesc,
        transactionamt,
        transactiondate,
        transactioncategory,
      };
    }
  } else {
    transactions.push({
      id: Date.now(),
      transactiontype,
      transactiondesc,
      transactionamt,
      transactiondate,
      transactioncategory,
    });
  }

  saveTransactionsList(transactions);
  closeModal();
  refreshDashboardData();
}

function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;
  const transactions = getTransactions().filter((t) => t.id !== id);
  saveTransactionsList(transactions);
  refreshDashboardData();
}

function editTransaction(id) {
  const transaction = getTransactions().find((t) => t.id === id);
  if (transaction) openEditModal(transaction);
}

saveTransactionBtn.addEventListener("click", saveTransaction);

transactionBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".editbtn");
  const deleteBtn = e.target.closest(".deletebtn");

  if (editBtn) editTransaction(Number(editBtn.dataset.id));
  if (deleteBtn) deleteTransaction(Number(deleteBtn.dataset.id));
});

// RENDERING

function getUserCurrency() {
  const users = getRegisteredUsers();
  const user = users.find((u) => u.username === currentUsername());
  return user?.currency || "₹";
}

function refreshDashboardData() {
  const transactions = getTransactions();
  renderTransactions(getFilteredTransactions(transactions));
  renderOverview(transactions);
  renderChart(transactions);
}

function renderTransactions(transactions) {
  transactionBody.innerHTML = "";
  const currency = getUserCurrency();

  if (transactions.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  transactions.forEach((trans) => {
    const isIncome = trans.transactiontype === "Income";
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><span class="type-pill ${isIncome ? "income" : "expense"}">${trans.transactiontype}</span></td>
      <td>${escapeHtml(trans.transactiondesc)}</td>
      <td>${isIncome ? "+" : "-"}${currency}${Number(trans.transactionamt).toLocaleString()}</td>
      <td>${trans.transactiondate}</td>
      <td>${trans.transactioncategory}</td>
      <td>
        <div class="action-btns">
          <button class="editbtn" data-id="${trans.id}">Edit</button>
          <button class="deletebtn" data-id="${trans.id}">Delete</button>
        </div>
      </td>
    `;

    transactionBody.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderOverview(transactions) {
  const currency = getUserCurrency();

  const income = transactions
    .filter((t) => t.transactiontype === "Income")
    .reduce((sum, t) => sum + Number(t.transactionamt), 0);

  const expense = transactions
    .filter((t) => t.transactiontype === "Expense")
    .reduce((sum, t) => sum + Number(t.transactionamt), 0);

  const balance = income - expense;

  document.getElementById("statBalance").textContent =
    `${currency}${balance.toLocaleString()}`;
  document.getElementById("statIncome").textContent =
    `${currency}${income.toLocaleString()}`;
  document.getElementById("statExpense").textContent =
    `${currency}${expense.toLocaleString()}`;
  document.getElementById("statCount").textContent = transactions.length;
}

function renderChart(transactions) {
  const canvas = document.getElementById("graphCanvas");
  if (!canvas) return;

  const parent = canvas.parentElement;
  const width = parent.clientWidth;
  const height = parent.clientHeight || 220;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  const income = transactions
    .filter((t) => t.transactiontype === "Income")
    .reduce((sum, t) => sum + Number(t.transactionamt), 0);
  const expense = transactions
    .filter((t) => t.transactiontype === "Expense")
    .reduce((sum, t) => sum + Number(t.transactionamt), 0);

  const styles = getComputedStyle(document.body);
  const emerald = styles.getPropertyValue("--emerald").trim() || "#1f7a5c";
  const rust = styles.getPropertyValue("--rust").trim() || "#b5533c";
  const inkFaint = styles.getPropertyValue("--ink-faint").trim() || "#8b978d";

  if (income === 0 && expense === 0) {
    ctx.fillStyle = inkFaint;
    ctx.font = "14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Add a transaction to see your chart", width / 2, height / 2);
    return;
  }

  const max = Math.max(income, expense, 1);
  const barWidth = Math.min(90, width / 5);
  const chartHeight = height - 50;
  const gap = barWidth * 1.4;
  const startX = width / 2 - gap / 2 - barWidth / 2;

  drawBar(
    ctx,
    startX,
    chartHeight,
    barWidth,
    (income / max) * chartHeight,
    emerald,
    "Income",
    income,
  );
  drawBar(
    ctx,
    startX + gap,
    chartHeight,
    barWidth,
    (expense / max) * chartHeight,
    rust,
    "Expense",
    expense,
  );
}

function drawBar(ctx, x, baseline, barWidth, barHeight, color, label, value) {
  const y = baseline - barHeight;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
  ctx.fill();

  ctx.fillStyle =
    getComputedStyle(document.body).getPropertyValue("--ink").trim() ||
    "#16241d";
  ctx.font = "600 12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x + barWidth / 2, baseline + 20);
  ctx.font = "600 12px 'IBM Plex Mono', monospace";
  ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 8);
}

// SEARCH & FILTER

function getFilteredTransactions(transactions) {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilterInput.value;

  return transactions.filter((t) => {
    const matchesQuery =
      query === "" ||
      t.transactiondesc.toLowerCase().includes(query) ||
      t.transactioncategory.toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || t.transactiontype === category;

    return matchesQuery && matchesCategory;
  });
}

function applyFilters() {
  renderTransactions(getFilteredTransactions(getTransactions()));
}

searchInput.addEventListener("input", applyFilters);
categoryFilterInput.addEventListener("change", applyFilters);

// SETTINGS

function loadSettings() {
  const users = getRegisteredUsers();
  const user = users.find((u) => u.username === currentUsername());
  if (!user) return;

  document.getElementById("loggedInName").textContent = user.username;
  document.querySelector("#settingsName").value = user.username;
  document.querySelector("#settingsCurrency").value = user.currency || "₹";
}

function saveSettings() {
  const users = getRegisteredUsers();
  const user = users.find((u) => u.username === currentUsername());
  if (!user) return;

  const newName = document.querySelector("#settingsName").value.trim();
  const newCurrency = document.querySelector("#settingsCurrency").value;

  if (newName === "") {
    alert("Username cannot be empty");
    return;
  }

  const duplicate = users.find(
    (u) =>
      u.username.toLowerCase() === newName.toLowerCase() &&
      u.username !== currentUsername(),
  );

  if (duplicate) {
    alert("Username already exists");
    return;
  }

  if (newName !== currentUsername()) {
    const oldKey = `transactions_${currentUsername()}`;
    const newKey = `transactions_${newName}`;

    const oldTransactions = JSON.parse(localStorage.getItem(oldKey)) || [];
    localStorage.setItem(newKey, JSON.stringify(oldTransactions));
    localStorage.removeItem(oldKey);

    localStorage.setItem("currentlogeduser", newName);
  }

  user.username = newName;
  user.currency = newCurrency;
  localStorage.setItem("registereduser", JSON.stringify(users));

  document.getElementById("loggedInName").textContent = newName;

  refreshDashboardData();
  alert("Settings updated successfully");
}

saveSettingsBtn.addEventListener("click", saveSettings);

//  9. THEME (dark mode) + RESET DATA

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("theme-dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  renderChart(getTransactions());
}

changeThemeBtn.addEventListener("click", toggleTheme);

function clearAllData() {
  if (!confirm("This will permanently delete all your transactions. Continue?"))
    return;
  saveTransactionsList([]);
  refreshDashboardData();
}

clearAllDataBtn.addEventListener("click", clearAllData);

window.addEventListener("load", () => {
  applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");

  const user = currentUsername();

  if (user) {
    enterDashboard();
  } else {
    document.getElementById("authContainer").style.display = "flex";
    dashboardCont.classList.add("dashboardhidden");
    showLogin();
  }
});

window.addEventListener("resize", () => {
  if (!dashboardCont.classList.contains("dashboardhidden")) {
    renderChart(getTransactions());
  }
});
